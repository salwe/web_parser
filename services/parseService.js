const puppeteer = require('puppeteer');
const $ = require('cheerio');

const BASE_URL = 'https://pixel24.ru';
const PATH = {
    COMMISSION: '/catalog/index/category_id/1585',
    SALE: '/akcii',
}

class ParseService {
    async getCommissionList() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`${BASE_URL}${PATH.COMMISSION}`);

        const data = [];
        const content = await page.content();
        this.addDataFromCommissionPage(data, content);

        if (await page.$('.pager') !== null) {
            const links = await page.evaluate(
                () => Array.from(
                    document.querySelectorAll('.pager .page>a'),
                    a => a.getAttribute('href')
                )
            );

            links.shift();

            for (let i = 0; i < links.length; i++) {
                const path = links[i];
                await page.goto(`${BASE_URL}${path}`);

                const currContent = await page.content();
                this.addDataFromCommissionPage(data, currContent);
            }

        }

        browser.close();

        return data;
    }

    addDataFromCommissionPage(data, page) {
        $('.products-catalog>.products', page).each((i, el) => {
            const id = +$(el).data('pk');
            const link = $(el).find('.product-panel-item');
            const item = {
                id,
                title: link.text(),
                price: +$(el).find('.product-panel>.product-price>span').text(),
                href: `${BASE_URL}${link.attr('href')}`,
                img: `${BASE_URL}${$(el).find('.img-product img').attr('src')}`,
            };

            data.push(item);
        });

        return data;
    }

    async getSaleList() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`${BASE_URL}${PATH.SALE}`);

        const data = [];
        const content = await page.content();

        $('.akcii-ul>li', content).each((i, el) => {
            const path = $(el).find('.img>a').attr('href');
            const item = {
                title: $(el).find('p>a').text(),
                dates: $(el).find('span').text(),
                link: `${BASE_URL}${path}`,
                img: `${BASE_URL}${$(el).find('.img img').attr('src')}`,
            }

            data.push(item);
        });

        browser.close();

        return data;
    }
}

module.exports = new ParseService();