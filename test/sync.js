const doSync  = (sth, time) => new Promise(resolve => {
    setTimeout(() => {
        console.log(sth + '用了' + time + 'ms');
        resolve();
    }, time); 
});

const doAsync = (sth, time, cb) => {
    setTimeout(() => {
        console.log(sth + '用了' + time + 'ms');
        cb && cb();
    }, time);
}

const doElse = (sth) => {
    console.log(sth);
};

const Me = { doSync, doAsync };
const Shiyou = { doSync, doAsync, doElse }

// 同步执行的过程
;(async () => {
    // console.log('室友到门口');
    // await Me.doSync('我在刷牙', 1000);
    // console.log('等待过程');
    // await Shiyou.doSync('室友刷牙', 2000);
    // console.log('洗漱完毕');

    console.log('室友来到门口按下开关');
    Me.doAsync('我刷牙', 2000, () => {
        console.log('通知室友去刷牙');
        Shiyou.doAsync('室友刷牙', 2000);
    })

    console.log('室友去干别的了');
})()