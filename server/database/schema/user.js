const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed; // 适合变化比较频繁的数据，里面可以存储任意类型的数据
const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

// 填写需要创建的字段跟每个字段的类型
const userSchema = new Schema({
    userName: {
        unique: true,
        type: String
    },
    email: {
        unique: true,
        required: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
    loginAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    lockUntil: Number,

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

// 增加mongoose虚拟字段存储用户是否被限制登陆，这个字段不会被实时地保存到数据库，而是每次通过get方法进行判断
userSchema.virtual('isLocked').get(() => {
    return !!(this.lockUntil && this.lockUntil > Date.now())
});

// 使用中间件在保存之前执行一些操作
userSchema.pre('save', next => {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = new Date();
    }

    next();
});

userSchema.pre('save', next => {
    // mongoose 提供的一个方法，查看某个字段有没有被更改
    if (!this.isModified('password')) {
        return next();
    }

    // 两个变量,盐值(越大构建盐的复杂度就越高，相应的genSalt这个函数就越耗性能)、回调(接受err与盐值)
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) {
            return next(err);
        }
        // 使用hash进行加密加盐，并将现在的密码进行替换
        bcrypt.hash(this.password, salt, (error, hash) => {
            this.password = hash;
            next();
        });
    })

    next();
});

// 实例方法集合
userSchema.methods = {
    // 比较加密前后密码
    comparePassword: (_password, password) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, password, (err, isMatch) => {
                if (!err) {
                    resolve(isMatch);
                } else {
                    reject(err);
                }
            });
        });
    },
    incLoginAttempts: (user) => {
        return new Promise((resolve, reject) => {
            if (this.lockUntil && this.lockUntil < Date.now()) {
                this.update({
                    $set: {
                        loginAttempts: 1
                    },
                    $unset: {
                        lockUntil: 1
                    }
                }, (err) => {
                    if (!err) {
                        resolve(true);
                    } else {
                        reject(err);
                    }
                })
            } else {
                let updates = {
                    $inc: {
                        loginAttempts: 1
                    }
                }

                if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
                    updates.$set = {
                        lockUntil: Date.now() + LOCK_TIME
                    }
                }

                this.update(updates, err => {
                    if (!err) {
                        resolve(true);
                    } else {
                        reject(err);
                    }
                })
            }
        });
    }
}

// 传入model名字与发布生成这个model所需要的数据
mongoose.model('User', userSchema);
