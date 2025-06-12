import path from "node:path"
import puppeteer from "puppeteer"
import ejs from "ejs"
import { KEYS } from "../constants/keys"
import { fileURLToPath } from "node:url"
import { dirname } from "node:path"
import { MediaByIdsResult } from "src/services/db"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const generatePdf = async (html: string, url: { base: string, port: string | number }) => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    await page.setViewport({ width: 200, height: 800 })

    const baseUrl = `http://${url.base}:${url.port}/`
    const htmlWithBase = html.replace('<head>', `<head><base href="${baseUrl}">`)

    await page.setContent(htmlWithBase, { waitUntil: 'networkidle0' })
    const bodyHeightPx = await page.evaluate(() => {
        return document.documentElement.scrollHeight
    })
    const bodyWidhtPx = await page.evaluate(() => {
        return document.documentElement.scrollWidth
    })

    const bodyHeightMm = bodyHeightPx * 0.2646
    const bodyWidthMm = bodyWidhtPx * 0.2646

    const pdf = await page.pdf({ width: `${bodyWidthMm}mm`, height: `${bodyHeightMm}mm`, printBackground: true })
    await browser.close()
    return pdf
}

interface UrlType {
    base: typeof KEYS.URL_BASE
    port: typeof KEYS.PORT
}

type ProductWithAmount = MediaByIdsResult & { amount: number }

interface GenerateTicketParams {
    products: ProductWithAmount[]
    username: string | false
    print: boolean
    url?: UrlType
}

export const generateTicketHTML = async ({ products, username, print, url = { base: KEYS.URL_BASE, port: KEYS.PORT } }: GenerateTicketParams): Promise<string> => {
    const templatePath = path.join(__dirname, "views/ticket.ejs")

    try {
        const html = await ejs.renderFile(templatePath, {
            v: products,
            user: username,
            print,
            url
        })

        return html
    } catch (err) {
        console.error("Error rendering EJS file:", err)
        throw new Error("Could not render ticket HTML")
    }
}