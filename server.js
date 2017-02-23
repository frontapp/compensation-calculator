const express = require('express');

var app = express();

app.use(express.static('public'));

var port = process.env.PORT || 2676;
app.listen(port, function () { console.log('App running on port', port); });