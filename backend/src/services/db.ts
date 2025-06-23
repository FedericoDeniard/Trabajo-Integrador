import { ProductType } from "src/controllers/products";
import { Prisma, PrismaClient } from "../../generated/prisma";
import { HttpError } from "src/middlewares/errorHandler";
import { ProductWithAmount } from "src/controllers/tickets";
import { PurchaseProduct } from "src/routes/purchase";

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
        media: {
            include: {
                genres: { include: { genre: true } },
                directors: { include: { director: true } }
            }
        }
    }
}>

type MediaWithProduct = Prisma.MediaGetPayload<{
    include: { Movie: true, Serie: true, genres: { include: { genre: true } }, directors: { include: { director: true } } }
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
                    include: { media: { include: { genres: { include: { genre: true } }, directors: { include: { director: true } } } } }
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
                include: { Movie: true, Serie: true, genres: { include: { genre: true } }, directors: { include: { director: true } } }
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
    async getProductsFromTicket(ticketId: number): Promise<ProductWithAmount[]> {
        try {
            const ticket = await this.client.ticket.findUnique({
                where: { id: ticketId },
                include: {
                    productTickets: true
                }
            });

            if (!ticket) throw new HttpError(404, "Ticket not found");

            const mediaIds = ticket.productTickets.map(pt => pt.media_id);
            const allMedias = await this.getMediasByIds(mediaIds);

            return allMedias.map(media => ({
                ...media,
                amount: ticket.productTickets.find(pt => pt.media_id === media.mediaId)?.amount ?? 0
            }));
        } catch (error) {
            throw new HttpError(500, "Error retrieving products from ticket");
        }
    }

    async getProducts(showAllProducts: boolean = true): Promise<MediaByIdsResult[]> {
        try {
            let hideProducts = {}
            if(showAllProducts == false) {
                hideProducts = { available: true };
            }

            const [movies, series] = await Promise.all([
                this.client.movie.findMany({
                    where: { media: hideProducts },
                    include: { media: { include: { genres: { include: { genre: true } }, directors: { include: { director: true } } } } }
                }),
                this.client.serie.findMany({
                    where: { media: hideProducts },
                    include: { media: { include: { genres: { include: { genre: true } }, directors: { include: { director: true } } } } }
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
            released_date: media.Serie.released_date,
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
    async updateProduct(product: ProductType) {
        try {
            const updatedProduct = await this.client.$transaction(async (prisma) => {
                const genrePromises = product.genres.map(async (genreName) => {
                    let genre = await prisma.genre.findUnique({
                        where: { name: genreName }
                    });

                    if (!genre) {
                        genre = await prisma.genre.create({
                            data: { name: genreName }
                        });
                    }

                    return genre;
                });

                const genres = await Promise.all(genrePromises);

                await prisma.productGenre.deleteMany({
                    where: { media_id: product.id }
                });

                const updated = await prisma.media.update({
                    where: { id: product.id },
                    data: {
                        title: product.title,
                        price: product.price,
                        description: product.description,
                        rate: product.rate
                    }
                });

                if (genres.length > 0) {
                    await prisma.productGenre.createMany({
                        data: genres.map(genre => ({
                            media_id: product.id,
                            genre_id: genre.id
                        }))
                    });
                }
                if (product.seasons) {
                    await prisma.serie.update({
                        where: {
                            mediaId: product.id
                        },
                        data: { seasons: product.seasons, released_date: product.released_date }
                    });
                } else {
                    await prisma.movie.update({
                        where: { mediaId: product.id },
                        data: { released_date: product.released_date }
                    });
                }

                return updated;
            });

            return updatedProduct;

        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    async disableProduct(id: number) {
        try {
            const disabledProduct = await this.client.media.update({
                where: { id },
                data: { available: false }
            });
            return disabledProduct;
        } catch (error) {
            console.error('Error disabling product:', error);
            throw error;
        }
    }

    async activateProduct(id: number) {
        try {
            const activatedProduct = await this.client.media.update({
                where: { id },
                data: { available: true }
            });
            return activatedProduct;
        } catch (error) {
            console.error('Error activating product:', error);
            throw error;
        }
    }

    async createTicket(username: string, products: PurchaseProduct[], date: Date) {
        try {
            const newTicket = await this.client.ticket.create({
                data: {
                    user_name: username,
                    date: date,
                    productTickets: {
                        create: products.map((p) => ({
                            media: { connect: { id: p.mediaId } },
                            amount: p.amount
                        })),
                    },
                },
                include: {
                    productTickets: {
                        include: { media: true }
                    }
                }
            });

            return newTicket;
        } catch (error) {
            throw new HttpError(500, "Error creating ticket");
        }
    }
}

const prismaInstance = new PrismaService()

export default prismaInstance
