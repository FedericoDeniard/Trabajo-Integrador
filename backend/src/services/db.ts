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

    async getMediasByIds(ids: number[]) {
        try {
            const movies = await this.client.movie.findMany({
                where: {
                    media: {
                        id: { in: ids }
                    }
                },
                include: { media: { include: { genres: { include: { genre: true } }, directors: { include: { director: true } } } } }
            })
            const series = await this.client.serie.findMany({
                where: {
                    media: {
                        id: { in: ids }
                    }
                },
                include: { seasons: true, media: { include: { genres: { include: { genre: true } }, directors: { include: { director: true } } } } }
            })
            return [...movies, ...series]
        } catch (error) {
            throw new HttpError(500, "Error retrieving products by ids");
        }
    }

    async getAllProducts() {
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
}

const prismaInstance = new PrismaService()

export default prismaInstance
