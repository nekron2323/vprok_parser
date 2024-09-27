const puppeteer = require('puppeteer')
const fs = require('fs')

const path_screenshot = (url) => {
    return `screenshot-${url.split('--')[1]}.jpg`
}

const path_data = (url) => {
    return `product-${url.split('--')[1]}.txt`
}

const parser = async (url, region) => {
    const browser = await puppeteer.launch({
        args: ['--start-maximized']
    })
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle0' })
    await page.setViewport({ width: 1920, height: 1080 })
    // Пауза, чтобы обойти защиту
    await new Promise(resolve => setTimeout(resolve, 10000))
    await page.evaluate(() => {
        if (document.querySelector('div[class^="Modal_root__"]')) document.querySelector('div[class^="Modal_root__"]').remove()
        if (document.querySelector('div[class^="ScreenPortal_root__"]')) document.querySelector('div[class^="ScreenPortal_root__"]').remove()
    })
    // Меняем регион
    await page.click('div[class^="Region_region__"]')
    await page.click(`text/${region}`)
    // Пауза, чтобы прогрузилась страница
    await new Promise(resolve => setTimeout(resolve, 2000))
    // Удаляем лишние окна
    await page.evaluate(() => {
        if (document.querySelector('div[class^="ScreenPortal_root__"]')) document.querySelector('div[class^="ScreenPortal_root__"]').remove()
        if (document.querySelector('div[class^="Tooltip_root__"]')) document.querySelector('div[class^="Tooltip_root__"]').remove()
        if (document.querySelector('div[class^="CookiesAlert_policy__"]')) document.querySelector('div[class^="CookiesAlert_policy__"]').remove()
    })
    await page.evaluate(() => {
        if (document.querySelector('div[class^="Modal_root__"]')) document.querySelector('div[class^="Modal_root__"]').remove()
    })
    // Делаем скриншот
    await page.screenshot(
        {
            path: path_screenshot(url, region),
            fullPage: true
        })
    // Извлекаем необходимые данные
    const data = await page.evaluate(() => {
        const extractData = (selector) => {
            return document.querySelector(selector)
        }
        const priceOld = extractData('div[class^="PriceInfo_oldPrice__"] > span')?.firstChild.nodeValue || 'N/A'
        const price_int = extractData('div[class^="PriceInfo_root__"] > span')?.firstChild.nodeValue
        const price_float = extractData('div[class^="PriceInfo_root__"] > span > span')?.firstChild.nodeValue.replace(/[^0-9]/g, "")
        const price = price_int ? price_int + (price_float ? '.' + price_float : '') : 'N/A'
        const rating = extractData('a[class^="ActionsRow_stars__"]')?.title.replace(/[^0-9.]/g, "") || 'N/A'
        const reviewCount = extractData('a[class^="ActionsRow_reviews__"]')?.innerText.replace(/[^0-9.]/g, "") || 'N/A'
        return { priceOld, price, rating, reviewCount }
    });
    // Сохраняем данные в файл
    fs.writeFileSync(path_data(url, region), [
        `price=${data.price.replace(/\s/g, '')}`,
        `priceOld=${data.priceOld}`,
        `rating=${data.rating}`,
        `reviewCount=${data.reviewCount}`
    ].join('\n'))

    await browser.close()
}

module.exports = parser