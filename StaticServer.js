const http = require("http");
const fs = require("fs");
const port = process.argv[2];
const dirPath = process.argv[3] || ".";
if (isNaN(port)) {
  if (!port) {
    console.log("请指定静态服务器的端口号！比如\nnode server.js 8888");
  } else {
    console.log("端口号异常");
  }
  process.exit(1);
}

function startServer() {
  const server = http.createServer(
    function (request, response) {
      const fullUrl = `http://${request.headers.host}${request.url}`;
      const parsedUrl = new URL(fullUrl);

      const method = request.method;
      const path = parsedUrl.pathname;
      const params = parsedUrl.searchParams;

      /******** 处理请求 ************/

      console.log("收到请求！url 是" + fullUrl);
      const filePath = path === "/" ? "/index.html" : path; //默认首页
      const fileTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".png": "image/png",
        ".jpg": "image/jpeg",
      };
      let content;
      try {
        content = fs.readFileSync(dirPath + filePath);
        response.statusCode = 200;
        const suffix = filePath.substring(filePath.lastIndexOf("."));
        response.setHeader("Content-Type", `${fileTypes[suffix] || "text/html"};charset=utf-8`);
      } catch (error) {
        console.log("error");
        content = "请求的内容不存在";
        response.statusCode = 404;
        response.setHeader("Content-Type", "text/html;charset=utf-8");
      }
      response.write(content); //根据url来形成查询路径
      response.end();
    },

    /******** 处理完毕 ************/
  );
  server.listen(port);
  console.log("监听 " + port + " 成功\n请打开 http://localhost:" + port + " 来访问静态服务器");
}

fs.stat(dirPath, (err, stats) => {
  if (err) {
    console.log("路径错误");
    process.exit(1);
  } else if (!stats.isDirectory()) {
    console.log("路径应该指向一个文件夹");
    process.exit(1);
  } else {
    startServer();
  }
});
