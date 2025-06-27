import { ProductType } from "src/controllers/products";
import { Prisma, PrismaClient } from "../../generated/prisma";
import { HttpError } from "src/middlewares/errorHandler";
import { ProductWithAmount } from "src/controllers/tickets";
import { PurchaseProduct } from "src/routes/purchase";
import { Client } from 'pg'
import { KEYS } from "src/constants/keys";
import { comparePassword, hashPassword } from "src/utils/encrypt";
import { deleteThumbnail } from "src/constants/multer";

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

export type Admin = {
    id: number,
    username: string,
    password: string
}

export type MediaByIdsResult = MovieWithMedia | SerieWithMedia

class PrismaService {
    private prisma: PrismaClient;
    private rawClient: Client;
    private isConnected = false;

    constructor() {
        this.prisma = new PrismaClient({ log: ["info"] })
        this.rawClient = new Client({
            connectionString: KEYS.DATABASE_URL
        })
        process.on("SIGTERM", () => this.gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => this.gracefulShutdown("SIGINT"));
    }

    async connect() {
        if (!this.isConnected) {
            try {
                await this.prisma.$connect();
                this.isConnected = true;
                this.rawClient.connect()
                await this.createAdminTable();
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
            await this.rawClient.end();
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
            if (showAllProducts == false) {
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


                let updated = await prisma.media.update({
                    where: { id: product.id },
                    data: {
                        title: product.title,
                        price: product.price,
                        description: product.description,
                        rate: product.rate,
                    }
                });

                if (product.thumbnail !== updated.thumbnail && product.thumbnail) {
                    try {
                        await deleteThumbnail(updated.thumbnail)
                    } catch (error) {
                        console.error('Error deleting thumbnail:', error);
                    } finally {
                        updated = await prisma.media.update({
                            where: { id: product.id },
                            data: { thumbnail: "/" + product.thumbnail.replace('dist/', '') }
                        })
                    }
                }

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
                        data: { duration: product.duration, released_date: product.released_date }
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

    private async createAdminTable() {
        try {
            await this.rawClient.query(`
                CREATE TABLE IF NOT EXISTS admin (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) NOT NULL UNIQUE,
                    password VARCHAR(100) NOT NULL
                )
            `);
            const hashedPassword = await hashPassword(KEYS.ADMIN_PASSWORD)
            await this.rawClient.query(`
                INSERT INTO admin (username, password)
                VALUES ($1, $2)
                ON CONFLICT (username) DO NOTHING
            `, [KEYS.ADMIN_USERNAME, hashedPassword]);
        } catch (error) {
            console.error('Error creating admin table:', error);
            throw error;
        }
    }

    async loginAdmin(username: string, password: string) {
        try {
            const admin = await this.rawClient.query<Admin>(`
                SELECT id, username, password FROM admin WHERE username = $1
            `, [username]);
            if (admin.rows.length < 1 || !admin.rows[0]) {
                throw new HttpError(401, "Invalid credentials");
            }
            const adminPassword = admin.rows[0].password;
            const isPasswordValid = await comparePassword(password, adminPassword);
            if (!isPasswordValid) {
                throw new HttpError(401, "Invalid credentials");
            }
            const id = admin.rows[0].id;
            return id;
        } catch (error) {
            console.error('Error getting admin:', error);
            throw error;
        }
    }
    async createProduct(product: ProductType) {
        try {

            const newProduct = await this.client.$transaction(async (prisma) => {
                if (!product.thumbnail) throw new HttpError(400, "Missing thumbnail");
                if (!product.available) throw new HttpError(400, "Missing available");
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

                const directorPromises = product.directors.map(async (directorName) => {
                    let director = await prisma.director.findUnique({
                        where: { name: directorName }
                    });

                    if (!director) {
                        director = await prisma.director.create({
                            data: { name: directorName }
                        });
                    }

                    return director;
                });

                const directors = await Promise.all(directorPromises);

                const media = await prisma.media.create({
                    data: {
                        title: product.title,
                        price: product.price,
                        thumbnail: "/" + product.thumbnail.replace('dist/', ''),
                        description: product.description,
                        rate: product.rate,
                        available: product.available,
                        genres: {
                            create: genres.map(genre => ({
                                genre: { connect: { id: genre.id } },
                            })),
                        },
                        directors: {
                            create: directors.map(director => ({
                                director: { connect: { id: director.id } },
                            })),
                        },
                    },
                });

                if (product.seasons) {
                    await prisma.serie.create({
                        data: {
                            media: { connect: { id: media.id } },
                            seasons: product.seasons,
                            released_date: product.released_date,
                        },
                    });
                } else if (product.duration) {
                    await prisma.movie.create({
                        data: {
                            duration: product.duration,
                            released_date: product.released_date,
                            media: { connect: { id: media.id } },
                        },
                    });
                }
                return media;
            });
            return newProduct
        } catch (error) {
            throw error
        }
    }
}

const prismaInstance = new PrismaService()

export default prismaInstance
