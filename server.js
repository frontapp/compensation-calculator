require('dotenv').config();

const pug = require('pug');

const express = require('express');

const basicAuth = require('basic-auth');
var BASIC_AUTH = {
  name: process.env.USERNAME,
  pass: process.env.PASSWORD
};

function auth(req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Autorization Required');
    return res.sendStatus(401);
  }

  var user = basicAuth(req);
  if(!user || !user.name || !user.pass)
    return unauthorized(res);

  if (user.name === BASIC_AUTH.name && user.pass == BASIC_AUTH.pass)
    return next();

  return unauthorized(res);
}

var app = express();
app.set('view engine', 'pug');

app.get('/model.js')

app.get('/', function(req, res){
  res.render('template', { company: process.env.COMPANY_NAME, strikeprice: process.env.STRIKE_PRICE, nbofshares: process.env.NB_FULLY_DILUTED_SHARES });
});

app.use([auth, express.static('public')]);

function log(msg) {
  console.log(moment().format(), msg);
}

var port = process.env.PORT || 2676;
app.listen(port, function () { console.log('App running on port', port); });