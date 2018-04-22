const mongoose = require('mongoose');
const db = 'mongodb://localhost/douban-test';

// 将mongoose中的promise替换为node全局的promise，因为mongoose可能在版本不同的情况下promise的使用方法不同
mongoose.Promise = global.Promise;

exports.connect = () => {
    // 如果连接失败，mongo就会一直连接，这里设置一个最大重连次数
    let maxConnectTimes = 0;

    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }

        // 连接
        mongoose.connect(db);

        // 设置当链接断开的时候进行重连，有时候因为一些网络等等原因
        mongoose.connection.on('disconnected', () => {
            maxConnectTimes ++;
            if(maxConnectTimes < 5) {
                mongoose.connect(db);
            } else {
                throw new Error('重新连接超过5次，建议修复数据库连接代码');
            }
        });

        // 连接错误
        mongoose.connection.on('error', err => {
            maxConnectTimes ++;
            if(maxConnectTimes < 5) {
                mongoose.connect(db);
            } else {
                throw new Error('重新连接超过5次，建议修复数据库连接代码');
            }
        });

        // 一旦连接成功
        mongoose.connection.once('open', () => {
            const Dog = mongoose.model('Dog', { name: String });
            const doga = new Dog({ name: '阿尔法' });
            doga.save().then(() => {
                console.log('汪汪汪');
            })

            resolve();
            console.log('Mongo connect successfully ！！');
        });
    });

        
}

// 连接，安装的mongo是4点几版本的话可能会需要，最新的5点几的版本不再需要
// mongoose.connect(db, {
//     useMongoClient: true
// });
