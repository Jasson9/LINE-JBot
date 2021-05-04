const http = require('http')

http.createServer(function (req, res){  
  res.writeHead(200);
  res.end("hello world\n");
  console.log(req)
}).listen(443,'127.0.0.1');