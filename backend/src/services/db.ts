import { PrismaClient } from "../../generated/prisma"

const prismaInstance = new PrismaClient({ log: ["info"] })

export const gracefulShutdown = async (signal: string) => {
    console.log(`Received ${signal}`);
    try {
        await prismaInstance.$disconnect();
    }
    catch (error) {
        console.log(error);
    } finally {
        process.exit(0);
    }
}

export default prismaInstance
