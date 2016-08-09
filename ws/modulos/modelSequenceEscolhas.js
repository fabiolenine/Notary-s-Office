var mongoose = require('mongoose');
var sequenceEscolhaSchema = new mongoose.Schema({	atendimento	: { type: String, required: true}, 
												 	sequence	: { type: String //, required: true
																  },
												 	servico		: {	titulo		: { type: String, required: true},
                                            						sigla	    : { type: String, required: true}},
                                            		timestamp	: {type:Date, default: Date.now}
                                       });

exports.model = mongoose.model('sequenceescolha',sequenceEscolhaSchema);