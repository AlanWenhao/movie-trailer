const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
// const Mixed = Schema.Types.Mixed; // 适合变化比较频繁的数据，里面可以存储任意类型的数据

// 填写需要创建的字段跟每个字段的类型
const categorySchema = new Schema({
    name: {
        unique: true,
        type: String
    },
    movies: [{
        type: ObjectId,
        ref: 'Movie'
    }],
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
categorySchema.pre('save', next => {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = new Date();
    }

    next();
});

// 传入model名字与发布生成这个model所需要的数据
mongoose.model('Category', categorySchema);
