// http://api.douban.com/v2/movie/subject/1764796
// /v2/movie/subject/:id
const rp = require('request-promise-native');

async function fetchMovie(item) {
    const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`;
    const res = await rp(url);
    return res;
}

;(async () => {
    let movies = [{
        doubanId: 24879820,
        doubanTitle: '奇怪的她',
        doubanRate: 8.3,
        doubanPoster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2162863558.jpg' },
    {
        doubanId: 1292286,
        doubanTitle: '我的野蛮女友',
        doubanRate: 8.1,
        doubanPoster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p489336497.jpg' 
    }];

    movies.map(async movie => {
        let movieData = await fetchMovie(movie);
        console.log(movieData);
    });
})()
