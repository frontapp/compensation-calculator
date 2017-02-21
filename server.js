const express = require('express');

var app = express();

app.use(express.static('public'));


// app.get('/', function(req, res){
//   res.render('template', { company: process.env.COMPANY_NAME, strikeprice: process.env.STRIKE_PRICE, nbofshares: process.env.NB_FULLY_DILUTED_SHARES });
// });


var port = process.env.PORT || 2676;
app.listen(port, function () { console.log('App running on port', port); });