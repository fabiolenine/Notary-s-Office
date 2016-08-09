/**
 * appbotdbs.js
 * 
 * @version 0.1 - alfa
 * 
 * DESCRIPTION:
 * Serviço de sincronização do banco de dados da Lyon com a banco de dados na nuvem do cartório. 
 * O escopo é durante o horário comercial transferir todos os novos registros de cadastro de cliente,
 * no período da noite enviar todos a base para sincronizar também todas as alterações e inclusões.
 * 
 * @author fabio lenine vilela da silva
 * (C) 2016 Fortaleza - Ceará - Brasil
 */
'use strict';

const express       = require('express');
const mongoose      = require('mongoose');
const firebird      = require('node-firebird');    
const SearchCliente = require('./crudSearchCliente.js')(mongoose);      

// ------------------------------------------------------------------------
// connect to our mongo database hosted on another server
//
// const config    =       {
//                        // "USER"     : "",
//                        // "PASS"     : "",
//                         "HOST"     : "127.0.0.1",
//                         "PORT"     : "27017",
//                         "DATABASE" : "md"
//                         };

const config    =       {
                        "USER"     : "MDappSourceBot",
                        "PASS"     : "5JtcANAhxFw3xYYL9DqhWY9OumgA+eC/s9WknuPnnu/2JRrjfxEycnGEHUf108d8AxTLkrn5CDQ975RcXBlsgph4Lu5EGNNTpHzOJanmwerJ6dcYfcNkUB6BJiu0iIHo944s0KW97ywLarIk7w6VmfDgcf2VdIiM5JGjQivvwmMl6X0bX5cdUDvXg+pQ4qxIXz9COHUFaeW0T5+3nVyhC+vkIVU/CRD8JU3MvbQj5L1t75lPOPKdvDfm41S0rtrtqN70Vv10OMLHrXhtc914zEN0mjgQQKOo8lpakOVfMPZ9zw24mguaoY/JgSkS2kqGzfFOpCpbsMNsi6xGKVX5vg==",
                        "HOST"     : "104.154.224.76",
                        "PORT"     : "27017",
                        "DATABASE" : "md"
                        };


const dbPath    = "mongodb://" +    config.USER     + ":" +
                                    config.PASS     + "@"+
                                    config.HOST     + ":"+
                                    config.PORT     + "/"+
                                    config.DATABASE;

console.log('\ntentando se conectar a instância mongoDB localhost ' + config.HOST);

const db = mongoose.connect(dbPath,{ server: { poolSize=5 }});
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



// Conexão com o banco de dados Firebird
// declaração de variaveis:

const fbOptions = {};

//fbOptions.host      = '127.0.0.1';                          // default when creating database
//fbOptions.port      = '3050';                               // default when creating database
fbOptions.database  = '/Volumes/Marvin/MD/SAN/SAN.FDB';
fbOptions.user      = 'SYSDBA';                             // default when creating database
fbOptions.password  = 'masterkey';                          // default when creating database
fbOptions.pageSize  = 4096;                                 // default when creating database
fbOptions.timeout   = 3000;                                 // default query timeout

const pool = firebird.pool(5,fbOptions);

    pool.get(function(err, dbfb) {
//    firebird.attach(fbOptions,function(err, db) {
        
        if (err)
            throw err;


const ioSearchCliente   = require('./ioSearchCliente.js')(dbfb, mongoose, SearchCliente); 

let control     = 0;
let checkin     = 0;
let datafirst   = 0;
let datalast    = 0;

setInterval(function () {

            SearchCliente.maxcodigo(function(retorno) {

                if (retorno.length == 0) {
                    datafirst   = 0;
                    datalast    = 20;
                    control     = 1;
                }
                else {
                    datafirst   = (retorno[0].codigo + 1);
                    datalast    = (retorno[0].codigo + 20);
                    control     = (retorno[0].codigo + 1);
                };

                if (checkin==0) {
                    //checkin = control;
                    console.log('Iniciou o controle de repetição');
                }
                
                if (checkin==control) {
                        console.log('Desviando da repetição...');

                        dbfb.query("Select first 1 clicod as COD From SAN0000 Where clicod > ? order by clicod",[datafirst],function(err, result) {
                            
                            //console.log(result);

                            if (err) { 
                                console.log(err);
                                }
                            else if (result.length != 0) {
                                if (result[0].COD > datalast) {
                                    console.log('Lacuna no banco de dados da faixa definida, reiniciando a partir do código ' + result[0].COD);
                                    datafirst   = result[0].COD;
                                    datalast    = result[0].COD + 20;
                                    control     = result[0].COD;
                                    checkin     = control;

                                    ioSearchCliente.io(datafirst,datalast,function(retorno){
                                        console.log('Vai dar continuidade no fluxo principal....');
                                    });

                                }
                                else {
                                    console.log('Delay...');
                                };
                            } else {
                                console.log('Aguardando mais registros...')
                            };

                            dbfb.detach();
                        });
                    }
                    else {
                        checkin = control;

                        ioSearchCliente.io(datafirst,datalast,function(retorno){
                            console.log('Vai dar continuidade no fluxo principal....');
                        });

                    };
            });
},1000*5);

    });
pool.destroy();

console.log('Olá Mundo!!!');