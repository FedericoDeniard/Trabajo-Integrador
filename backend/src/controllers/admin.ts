import { fileURLToPath } from "node:url"
import { dirname } from "node:path"
import jwt from 'jsonwebtoken'
import { KEYS } from "src/constants/keys"
import { Admin } from "src/services/db"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


export const generateAdminLoginHtml = () => {

}

export const generarteAdminJwt = ({ id }: Pick<Admin, "id">) => {
    const token = jwt.sign({ id }, KEYS.JWT_SECRET, { expiresIn: "1h" })
    return token
}
