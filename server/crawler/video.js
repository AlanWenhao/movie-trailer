const puppeteer = require('puppeteer');

const base = `https://movie.douban.com/subject/`;
const videoBase = `https://movie.douban.com/trailer/224638`;
const movieId = 10437779;

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
    await page.goto(`${base}${movieId}`, {
        // 等待知道网路空闲（但是这个不能100%保证数据就是加载完毕了，所以下面会sleep 3s）
        waitUntil: 'networkidle2'
    });

    // sleep 3 seconds waiting for fetching data
    await sleep(2000);

    // 在现在的无头浏览器执行部分，因为看到豆瓣网站有用到jQuery，所以可以直接使用 $
    const result = await page.evaluate(() => {
        var $ = window.$;
        var it = $('.related-pic-video');

        if (it && it.length > 0) {
            var link = it.attr('href');
            var cover = it.find('img').attr('src');
            
            return {
                link,
                cover
            }
        }
        return {};
    });

    let video;
    if (result.link) {
        await page.goto(`${result.link}`, {
            waitUntil: 'networkidle2'
        });
        await sleep(2000);

        video = await page.evaluate(() => {
            var $ = window.$;
            var it = $('source');
            console.log(it);
    
            if (it && it.length > 0) {
                return it.attr('src');
            }
            return '';
        });
    }

    const data = {
        video,
        movieId,
        cover: result.cover
    }

    browser.close();
    
    process.send(data);
    process.exit(0);
})()
