let data = {
    video: 'http://vt1.doubanio.com/201804172237/6a9982d6bc57057545c2adfdd7070295/view/movie/M/301290147.mp4',
    movieId: 10437779,
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p1903380040.jpg',
    cover: 'https://img3.doubanio.com/img/trailer/medium/1847827045.jpg?',
    videoKey: 'cbXNIY_FUB4k3Mr_HnzKp.mp4',
    coveroKey: 'qQLMsVfftlXmhJx5KXKBc.png',
    posterKey: 'http://p7honkwrp.bkt.clouddn.com/LwKDyIPsI5pdIYMs4aOvK.png'
};

const qiniu = require('qiniu');
const nanoid = require('nanoid');
const config = require('../config');

const bucket = config.qiniu.bucket;
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK);
const cfg = new qiniu.conf.Config();
const client = new qiniu.rs.BucketManager(mac, cfg);

// 上传某一个线上资源，存储到七牛的bucket中，使用一个key将这个资源重命名
const uploadToQiniu = async (url, key) => {
    return new Promise((resolve, reject) => {
        // client默认方法， 可以从网络上获取静态资源
        client.fetch(url, bucket, key, (err, ret, info) => {
            if (err) {
                reject(err);
            } else {
                if (info.statusCode === 200) {
                    resolve({ key });
                }
            }
        })
    });
}

;(async () => {
    let movies = [{ 
        "video": 'http://vt1.doubanio.com/201804172237/6a9982d6bc57057545c2adfdd7070295/view/movie/M/301290147.mp4',
        "movieId": 10437779,
        "poster": 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p1903380040.jpg',
        "cover": 'https://img3.doubanio.com/img/trailer/medium/1847827045.jpg?'
    }];

    movies.map(async movie => {
        if (movie.video && !movie.key) {
            try {
                console.log('开始传资源');
                let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4');
                let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png');
                let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png');
                console.log('资源传完了');

                if (videoData.key) {
                    movie.videoKey = videoData.key;
                }
                if (videoData.key) {
                    movie.coveroKey = coverData.key;
                }
                if (videoData.key) {
                    movie.posterKey = posterData.key;
                }
                console.log(movie);
            } catch (err) {
                console.log(err);
            }
        }
    });
})()
