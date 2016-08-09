var mongoose = require('mongoose');
var sequenceServicoSchema = new mongoose.Schema({	titulo		: { type: String, required: true, unique: true },
                                            		sigla	    : { type: String, required: true, unique: true },
                                            		timestamp	: {type:Date, default: Date.now}
                                       });

exports.model = mongoose.model('sequenceservico',sequenceServicoSchema);