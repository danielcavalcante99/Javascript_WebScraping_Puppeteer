const express = require('express');
const puppeteer = require('puppeteer');
const app = express();


app.get('/quotes', async (req, res) => {

    const paramCoin = req.query.coin;
    const paramPrice = req.query.price;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`https://www.google.com/search?q=${paramCoin}+${paramPrice}`);

    const pageContent = await page.evaluate(() => {
        return {
            name: document.querySelector('.sBsFoc').innerText,
            result: document.querySelector('.lWzCpb.a61j6').value,
        };
    });

    res.json(pageContent);
});



app.get('/quotes/currency', async (req, res) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.google.com/finance/markets/currencies`);

    const pageContent = await page.evaluate(() => {
        let quotes = [];
        document.querySelector('.Sy70mc ul').querySelectorAll('li').forEach((item) =>
            quotes.push({
                coin: item.querySelector('.ZvmM7').innerText,
                price: String(item.querySelector('.YMlKec').innerText).replace(',', '.'),
            }));
        return quotes;
    });


    res.json(pageContent);
});

app.listen(3000);