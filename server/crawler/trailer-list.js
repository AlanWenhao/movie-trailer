const puppeteer = require('puppeteer');

const url = `https://movie.douban.com/explore#!type=movie&tag=%E9%9F%A9%E5%9B%BD&sort=rank&page_limit=20&page_start=0`;

const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
});

;(async () => {
    console.log('Start visit the target page');

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    });

    // open a new page
    const page = await browser.newPage();
    await page.goto(url, {
        // 等待知道网路空闲（但是这个不能100%保证数据就是加载完毕了，所以下面会sleep 3s）
        waitUntil: 'networkidle2'
    });

    // sleep 3 seconds waiting for fetching data
    await sleep(3000);

    // 等待页面上出现了这个dom元素
    await page.waitForSelector('.more');

    for (let i; i < 1; i ++) {
        await sleep(3000);
        await page.click('more');
    }

    // 在现在的无头浏览器执行部分，因为看到豆瓣网站有用到jQuery，所以可以直接使用 $
    const result = await page.evaluate(() => {
        var $ = window.$;
        var items = $('.list-wp .list a');
        var links = [];

        if (items.length >= 1) {
            items.each((index, item) => {
                let it = $(item);
                let doubanId = it.find('.cover-wp').data('id');
                let doubanTitle = it.find('.cover-wp img').attr('alt');
                let doubanRate = Number(it.find('p strong').text());
                let doubanPoster = it.find('.cover-wp img').attr('src').replace('s_ratio', 'l_ratio');

                links.push({
                    doubanId,
                    doubanTitle,
                    doubanRate,
                    doubanPoster
                });
            });
        }

        return links;
    });

    browser.close();
    // console.log(result);

    // 将爬取到的数据发送出去并退出进程
    process.send({ result });
    process.exit(0);
    
})()
