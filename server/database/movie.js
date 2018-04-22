const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed; // 适合变化比较频繁的数据，里面可以存储任意类型的数据

// 填写需要创建的字段跟每个字段的类型
const movieSchema = new Schema({
    doubanId: String,
    rate: Number,
    title: String,
    summary: String,
    video: String,
    poster: String,
    cover: String,

    videoKey: String,
    posterKey: String,
    coverKey: String,

    rawTitle: String, // 原始标题
    movieTypes: [String],
    pubdate: Mixed,
    year: Number,

    tags: [String], // 写成Array也行

    meta: {
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

// 传入model名字与发布生成这个model所需要的数据
mongoose.model('Movie', movieSchema);
