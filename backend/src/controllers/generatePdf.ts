import puppeteer from "puppeteer"

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