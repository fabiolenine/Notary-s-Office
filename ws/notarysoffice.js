/**
 * notarysoffice.js
 *
 * @version 0.1 - alpha
 *
 * DESCRIPTION:
 * Gerenciador de cartório extra-judicial.
 *
 *
 * @fabiolenine
 * @see lenines.com
 * @see lenines.info
 *
 * @author Fabio Lenine Vilela da Silva
 * (C) 2015 Fortaleza - Brasil
 */

var http                = require('http');
var https               = require('https');
var mongoose            = require('mongoose');
var express             = require('express');
var bodyParser          = require('body-parser');
var session             = require('express-session');
var MemoryStore         = require('connect').session;
var vhost               = require('vhost');

var app                 = express();

http.createServer(app).listen(80);

var dbPath  = 'mongodb://localhost/reconhecimento';

var db;              // our MongoDb database

var reconhecimentosDetalhes  = require('./modulos/reconhecimentodetalhes.js')(mongoose);

var ObjectID 		= mongoose.Types.ObjectId;

// ------------------------------------------------------------------------
// Connect to our Mongo Database hosted on another server
//
console.log('\ntentando se conectar a instância MongoDB no servidor local');

if ( !(db = mongoose.connect(dbPath)) ) console.log('Não é possível conectar ao MongoDB em '+dbPath);
else console.log('conexão com o MongoDB em '+dbPath);

// connection failed event handler
mongoose.connection.on('erro: ', function(err)
        {
        console.log('Conexão da base de dados com erro '+err);
        }); // mongoose.connection.on()

// connection successful event handler:
// check if the Db already contains a greeting. if not, create one and save it to the Db
mongoose.connection.once('open', function()
        {
        console.log('database está agora aberto.' );
        });

//---------------------------------------------------------------------------------------


// set up ejs for templating
app.set('view engine','ejs');
app.use(express.static('../web'));
app.use(express.static('../lib'));

// routes
require('./modulos/routesreconhecimentos.js')(app, passport, mongoose, reconhecimentosDetalhes);      // load our routes and pass in our app and fully configured passport


//
// Express route to handle errors
//
//
// Express route to handle errors
//
app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.status(err.status || 500);
  res.render('500', { error: err });
});

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Não encontrado. ;-(' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Não encontrado. ;-(');
});

// ------------------------------------------------------------------------
// Start Express Webserver
//
console.log('Iniciando o Web server Notarys Office);
console.log('Webserver está escutando na port 80.');