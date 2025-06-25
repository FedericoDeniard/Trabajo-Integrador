import bcrypt from "bcrypt";

const config = {
    saltRounds: 10
}
export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, config.saltRounds)
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword)
}