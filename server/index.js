const Koa = require('koa');
const views = require('koa-views');
const mongoose = require('mongoose');
const { resolve } = require('path');
const { connect, initSchemas } = require('./database/init');

;(async () => {
    await connect();

    initSchemas();

    const Movies = mongoose.model('Movie');
    const movies = await Movies.find({});
})()

const app = new Koa();

app.use(views(resolve(__dirname, './views'), {
    extension: 'pug'
}))

app.use(async (ctx, next) => {
    await ctx.render('index', {
        me: 'Alan',
        you: 'Luke'
    })
});

app.listen(8080);
