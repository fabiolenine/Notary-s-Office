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
'use strict';

const express			= require('express');
const app				= express();
const bodyParser		= require('body-parser');
const http    			= require('http').createServer(app);
const io      			= require('socket.io')(http);
const vhost   			= require('vhost');
const mongoose			= require('mongoose');

http.listen(8080); // http.listen(8080,'192.168.0.6'); // Estabelece o IP do servidor para os clientes acessarem.

const config    =       {
                        "USER"     : "",
                        "PASS"     : "",
                        "HOST"     : "127.0.0.1",
                        "PORT"     : "27017",
                        "DATABASE" : "md"
                        };

const dbPath  = 'mongodb://localhost/md'; // Usado no servidor no CMD.

//const dbPath    = "mongodb://" +    config.USER     + ":" +
//                                    config.PASS     + "@"+
//                                    config.HOST     + ":"+
//                                    config.PORT     + "/"+
//                                    config.DATABASE;

console.log('\ntentando se conectar a instância mongoDB localhost ' + config.HOST);

mongoose.Promise = global.Promise;
const db = mongoose.connect(dbPath);
if ( !(db) ) console.log('Não é possível conectar ao mongoDB em '+dbPath);
else console.log('conexão com o mongoDB em '+dbPath);

// connection failed event handler
mongoose.connection.on('erro: ', function(err)
        {
        console.log('conexão da base de dados com erro '+err);
        }); // mongoose.connection.on()

// connection successful event handler:
// check if the db already contains a greeting. if not, create one and save it to the db
mongoose.connection.once('open', function() 
        {
        console.log('database '+config.DATABASE+' está agora aberto em '+config.HOST );
        });


io.on('connection', function (socket) {
		socket.on('disconnect', function(){ });
});
	
//Definições dos detalhes que serão repassados as rotas para serem utilizados
const dbservicos	= require('./modulos/dbServicos.js')(mongoose);
const dbescolhas	= require('./modulos/dbEscolhas.js')(mongoose,io);

//---------------------------------------------------------------------------------------

app.use(bodyParser.json());							//for parsing application/json
app.use(bodyParser.urlencoded({extended: true}));	// for parsing application/x-www-form-urlencoded

// set up ejs for templating
//app.set('view engine','ejs');
app.use(express.static('../web'));

// roteamento
require('./routers/routerSequence.js')(app,dbservicos,dbescolhas);

// ------------------------------------------------------------------------
// Start Express Webserver
//
console.log('Iniciando o Web server Notarys Office');
console.log('Webserver está escutando na port 8080.');