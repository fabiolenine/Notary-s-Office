module.exports = function(mongoose)
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
										var resultadofinal = resultupdate.sequence = seq;
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
		
		sequenceescolhasModel.model.find({sequence: {$ne: ""}, timestamp: {$gte: new Date( vdate).toISOString()}},function(err, result) {
            if (err) {
                console.error('Erro: ' + err);
                callback('Houve algum problema, informação não encontrada.');
            }
            else {
            	callback(result);
			};
        });   			
    };

	var retorno = {	"salvar"    : salvar,
				  	"listar"	: listar};
   
	return retorno;     
    }