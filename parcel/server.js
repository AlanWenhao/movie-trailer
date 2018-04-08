const Koa = require('koa');
const { resolve }  = require('path');
const server = require('koa-static');

const app = new Koa();
app.use(server(__dirname, './'));

app.listen(8888);
