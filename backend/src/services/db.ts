import { MediaWithRelations } from "src/controllers/products";
import { PrismaClient } from "../../generated/prisma"
import { HttpError } from "src/middlewares/errorHandler";
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

    async getProductsByIds(ids: number[]): Promise<MediaWithRelations[]> {
        try {
            return this.client.media.findMany({
                where: {
                    id: {
                        in: ids
                    }
                },
                include: {
                    genres: { include: { genre: true } },
                    directors: { include: { director: true } },
                    movie: true,
                    serie: { include: { seasons: true } }
                }
            })
        } catch (error) {
            throw new HttpError(500, "Error retrieving products by ids");
        }
    }

    async getAllProducts(): Promise<MediaWithRelations[]> {
        try {
            return this.client.media.findMany({
                include: {
                    genres: { include: { genre: true } },
                    directors: { include: { director: true } },
                    movie: true,
                    serie: { include: { seasons: true } }
                }
            })
        } catch (error) {
            throw new HttpError(500, "Error retrieving all products");
        }
    }

}

const prismaInstance = new PrismaService()

export default prismaInstance
