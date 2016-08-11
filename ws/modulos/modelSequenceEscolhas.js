var mongoose = require('mongoose');
var sequenceEscolhaSchema = new mongoose.Schema({	atendimento	: { type		: String, required: true}, 
												 	sequence	: { type		: String},
												 	servico		: {	titulo		: { type: String, required: true},
                                            						sigla	    : { type: String, required: true}},
                                            		timestamp	: { type		: Date, default: Date.now},
												 	chamadas	: [{guiche		: {type: String},
																	timestamp	: {type: Date, default: Date.now}}],
												 	atendido	: { guiche		: {type: String},
																	timestamp	: {type: Date, default: Date.now}}
                                       });

exports.model = mongoose.model('sequenceescolha',sequenceEscolhaSchema);