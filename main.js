var express = require('express');
var serveStatic = require('serve-static');
var app = express();

app.use(express.static('app'));
app.listen(8080);