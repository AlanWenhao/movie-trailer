# movie-trailer
Movie trailer from Douban

## How to start
- run `npm install` to install the dependencies
- run `npm run start` to start koa server
- go to http://localhost:8080/ and you will see a simple home page

## Tips
- parcel配置的时候 `--no-cache` 设置为忽略缓存，去掉这个设置打包速度可以变快
- 真实的项目中可以将react和react-dom上传到cdn上，不用打包到项目的js中
- child_process 的fork方法可以派生出一个子进程，该子进程继承了事件循环的机制，所以可以通过 `on` 的方式注册监听的函数（error、exit、message等）
