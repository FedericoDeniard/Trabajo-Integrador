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

    async createTicket(user_name: string, products: {media_id: number; amount: number}[], date: number) {
        try {
            const newTicket = await this.client.ticket.create({
                data: {
                    user_name,
                    date: new Date(date),
                    productTickets: {
                        create: products.map((p) => ({
                            media: {connect: {id: p.media_id}},
                            amount: p.amount
                        })),
                    },
                },
                include: {
                    productTickets: {
                        include: {media: true}
                    }
                }
            });

            return newTicket;
        } catch(error) {
            throw new HttpError(500, "Error creating ticket");
        }
    }
}

const prismaInstance = new PrismaService()

export default prismaInstance
