module.exports = function(mongoose,socket)
    {
    var sequenceescolhasModel  = require('./modelSequenceEscolhas.js');
       	
	var atualizar = function(vId, vGuiche, callback) {
		sequenceescolhasModel.model.update({_id: vId},{ $set: { atendido: { guiche: vGuiche, timestamp: new Date()} }},{upsert: true}, function(err, result) {
			if (err) {
				console.error('Erro: ' + err);
				callback(err);
			}
			else {	
				callback(result);
			};
		});	
	};
	
	var listar = function(callback) {
		
		var vTS 	= new Date();
		var pad 	= "00";
		var vTSy 	= vTS.getFullYear();
		var vTSm 	= "" + (vTS.getMonth() + 1);
		var vTSd 	= "" + vTS.getDate();
		
		var vdate	= vTSy + '-' + (pad.substring(0, pad.length - vTSm.length) + vTSm) + '-' + (pad.substring(0, pad.length - vTSd.length) + vTSd)+ "T00:00:00";
		
		sequenceescolhasModel.model.find({sequence: {$ne: ""}, atendido: {$exists: false},timestamp: {$gte: new Date(vdate).toISOString()}, "chamadas.guiche": {$exists: true}},function(err, result) {
            if (err) {
                console.error('Erro: ' + err);
                callback('Houve algum problema, informação não encontrada.');
            }
            else {
            	callback(result);
			};
        });   			
    };

	var retorno = {	"listar"	: listar,	
				    "atualizar"	: atualizar};
   
	return retorno;     
    }