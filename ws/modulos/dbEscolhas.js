module.exports = function(mongoose,socket)
    {
    var sequenceescolhasModel  = require('./modelSequenceEscolhas.js');
       
    var salvar = function(vAtendimento, vSequence, vTitulo, vSigla, callback) {		
		var newdata = new sequenceescolhasModel.model({atendimento	: vAtendimento,
													   sequence		: vSequence,
													   servico		: {	titulo	: vTitulo,
																	  	sigla	: vSigla}
													  });
        newdata.save(function(err, result) {                                             
        	if (err) {
                     	console.error('Erro: ' + err);
                        callback(err);
                     } 
            else     {
						var vTS = new Date(result.timestamp).toISOString();
				
                        sequenceescolhasModel.model.count({"servico.sigla": result.servico.sigla, sequence: {$ne: ""}, timestamp: {$lt: new Date(result.timestamp).toISOString(), $gte: new Date( vTS.substring(0,10) + "T00:00:00").toISOString()}}, function(err, quantidade){
							if (err) {
								console.error('Erro: ' + err);
								callback(err);
                     		} 
            				else     
							{	
								var str = "" + (quantidade + 1);
								var pad = "000";
								var seq = result.servico.sigla + (pad.substring(0, pad.length - str.length) + str);
								
								sequenceescolhasModel.model.findByIdAndUpdate(result._id, { $set: { sequence: seq }}, function (err, resultupdate) {
  									if (err) {
										console.error('Erro: ' + err);
										callback(err);
                     				}
									else {	
										resultupdate.sequence = seq;
										socket.emit('escolha', resultupdate);
										callback(resultupdate);
									};
								});
							};
						});
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
		
		sequenceescolhasModel.model.find({sequence: {$ne: ""}, timestamp: {$gte: new Date( vdate).toISOString()}, "chamadas.guiche": {$exists: false}},function(err, result) {
            if (err) {
                console.error('Erro: ' + err);
                callback('Houve algum problema, informação não encontrada.');
            }
            else {
            	callback(result);
			};
        });   			
    };
	
	var atualizar = function(vId, vGuiche, vSequence, vAtendimento, callback) {
		sequenceescolhasModel.model.update({_id: vId},{$push: {chamadas: {guiche: vGuiche}}},{upsert: true}, function(err, result) {
			if (err) {
				console.error('Erro: ' + err);
				callback(err);
			}
			else {	
				var dados = {_id		: vId, 
							 guiche		: vGuiche, 
							 sequence	: vSequence,
							 atendimento: vAtendimento,
							 timestamp	: new Date().toISOString()
							}; 
				socket.emit('chamada', dados);
				callback(result);
			};
		});	
	};

	var retorno = {	"salvar"    : salvar,
				  	"listar"	: listar,
				  	"atualizar"	: atualizar};
   
	return retorno;     
    }