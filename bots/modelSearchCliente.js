var mongoose = require('mongoose');
var searchClinteSchema;

searchClinteSchema = new mongoose.Schema({  codigo                  : Number,
                                            nome                    : String,
                                            nomefantasia            : String,
                                            cpfcnpj                 : String,
                                            email                   : String,
                                            datanascimento          : {type:Date, default: Date.now},
                                            datacadastro            : {type:Date, default: Date.now},
                                            dataobito               : Date,
                                            tipopessoa              : {type:String, default: 'Pessoa Fisica'},
                                            atosregistrado          : [],
                                            situacao                : [],
                                            pessoacomdeficiencia    : []
                                       });

exports.model = mongoose.model('searchcliente',searchClinteSchema);