import { Prisma, PrismaClient } from "../../generated/prisma"
import { HttpError } from "src/middlewares/errorHandler";

export type MovieWithMedia = Prisma.MovieGetPayload<{
    include: {
        media: {
            include: {
                genres: { include: { genre: true } },
                directors: { include: { director: true } }
            }
        }
    }
}>

export type SerieWithMedia = Prisma.SerieGetPayload<{
    include: {
        seasons: true,
        media: {
            include: {
                genres: { include: { genre: true } },
                directors: { include: { director: true } }
            }
        }
    }
}>

type MediaWithProduct = Prisma.MediaGetPayload<{
    include: { Movie: true, Serie: { include: { seasons: true } }, genres: { include: { genre: true } }, directors: { include: { director: true } } }
}>

export type MediaByIdsResult = MovieWithMedia | SerieWithMedia

class PrismaService {
    private prisma: PrismaClient;
    private isConnected = false;

    constructor() {
        this.prisma = new PrismaClient({ log: ["info"] })
        process.on("SIGTERM", () => this.gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => this.gracefulShutdown("SIGINT"));
    }

    async connect() {
        if (!this.isConnected) {
            try {
                await this.prisma.$connect();
                this.isConnected = true;
                console.log("Database connected");
            } catch (error) {
                console.error("DB connection error:", error);
                throw error;
            }
        }
        else {
            console.log("Database already connected");
        }
    }

    async gracefulShutdown(signal: string) {
        console.log(`Received ${signal}, disconnecting DB...`);
        try {
            await this.prisma.$disconnect();
            console.log("Database disconnected");
        } catch (error) {
            console.error("Error disconnecting DB:", error);
        } finally {
            process.exit(0);
        }
    }

    get client() {
        if (!this.isConnected) {
            throw new Error("Prisma client not connected");
        }
        return this.prisma;
    }

    async getMediasByIds(ids: number[]): Promise<MediaByIdsResult[]> {
        try {
            const [movies, series] = await Promise.all([
                await this.client.movie.findMany({
                    where: {
                        media: {
                            id: { in: ids }
                        }
                    },
                    include: { media: { include: { genres: { include: { genre: true } }, directors: { include: { director: true } } } } }
                }),
                await this.client.serie.findMany({
                    where: {
                        media: {
                            id: { in: ids }
                        }
                    },
                    include: { seasons: true, media: { include: { genres: { include: { genre: true } }, directors: { include: { director: true } } } } }
                })])
            return [...movies, ...series]
        } catch (error) {
            throw new HttpError(500, "Error retrieving products by ids");
        }
    }

    async getMediaById(id: number): Promise<MediaByIdsResult> {
        try {
            const media = await this.client.media.findUnique({
                where: {
                    id: id
                },
                include: { Movie: true, Serie: { include: { seasons: true } }, genres: { include: { genre: true } }, directors: { include: { director: true } } }
            })
            let mappedMedia: MediaByIdsResult
            if (media?.Movie) {
                mappedMedia = this.mediaToMovie(media)
            } else if (media?.Serie) {
                mappedMedia = this.mediaToSerie(media)
            } else throw new Error("Media not found");
            return mappedMedia
        } catch (error) {
            throw new HttpError(500, "Error retrieving products by ids");
        }
    }

    async getAllProducts(): Promise<MediaByIdsResult[]> {
        try {
            const [movies, series] = await Promise.all([
                this.client.movie.findMany({
                    include: { media: { include: { genres: { include: { genre: true } }, directors: { include: { director: true } } } } }
                }),
                this.client.serie.findMany({
                    include: { seasons: true, media: { include: { genres: { include: { genre: true } }, directors: { include: { director: true } } } } }
                })
            ])
            return [...movies, ...series]
        } catch (error) {
            throw new HttpError(500, "Error retrieving products");
        }
    }

    private mediaToSerie = (media: MediaWithProduct): SerieWithMedia => {
        if (!media.Serie) throw new Error("Media is not a serie");
        const serie = {
            id: media.Serie.id,
            seasons: media.Serie.seasons,
            mediaId: media.id,
            media: {
                id: media.id,
                title: media.title,
                price: media.price,
                thumbnail: media.thumbnail,
                description: media.description,
                rate: media.rate,
                available: media.available,
                genres: media.genres,
                directors: media.directors
            }

        }
        return serie
    }

    private mediaToMovie = (media: MediaWithProduct): MovieWithMedia => {
        if (!media.Movie) throw new Error("Media is not a movie");
        const movie = {
            id: media.Movie.id,
            duration: media.Movie.duration,
            released_date: media.Movie.released_date,
            mediaId: media.id,
            media: {
                id: media.id,
                title: media.title,
                price: media.price,
                thumbnail: media.thumbnail,
                description: media.description,
                rate: media.rate,
                available: media.available,
                genres: media.genres,
                directors: media.directors
            }

        }
        return movie
    }

}

const prismaInstance = new PrismaService()

export default prismaInstance
