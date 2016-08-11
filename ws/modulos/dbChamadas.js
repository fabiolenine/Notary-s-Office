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
				//socket.emit('chamada', {_id: vId, guiche: vGuiche});
				callback(result);
			};
		});	
	};

	var retorno = {	"atualizar"	: atualizar};
   
	return retorno;     
    }