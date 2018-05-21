const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { Mixed, ObjectId } = Schema.Types; // 适合变化比较频繁的数据，里面可以存储任意类型的数据

// 填写需要创建的字段跟每个字段的类型
const movieSchema = new Schema({
    doubanId: {
        unique: true,
        type: String
    },
    category: [{
        type: ObjectId,
        ref: 'Category'
    }],
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

// 使用中间件在保存之前执行一些操作
movieSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = new Date();
    }

    next();
});

// 传入model名字与发布生成这个model所需要的数据
mongoose.model('Movie', movieSchema);
