const cp = require('child_process');
const { resolve } = require('path');
const mongoose  = require('mongoose');
const Movie = mongoose.model('Movie');

;(async () => {
    const script = resolve(__dirname, '../crawler/trailer-list');

    // child_process 上的 fork 方法可以派生出一个子进程
    // 子进程与 Event Emmet 时间循环机制是有很大关系的，是继承了事件循环机制，所以可以在他上面可以通过 on 的方式注册监听的函数
    const child = cp.fork(script, []);

    // 是否被调用的标识
    let invoked = true;

    // 错误监听
    child.on('error', err => {
        if (invoked) return;
        invoked = true;
        console.log(err);
    });

    // 退出监听
    child.on('exit', code => {
        if (invoked) return;
        invoked = true;
        let err = code === 0 ? null : new Error(`exit code ${code}`);
        console.log(err);
    });

    // 消息的获取
    child.on('message', data => {
        let result = data.result;
        console.log(result);

        result.forEach(async item => {
            let movie = await Movie.findOne({
                doubanId: item.doubanId
            })

            if (!movie) {
                movie = new Movie(item);
                await movie.save();
            } 
        });
    });
})()
