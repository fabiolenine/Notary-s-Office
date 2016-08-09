module.exports = function(mongoose)
    {
    var sequenceservicosModel  = require('./modelSequenceServicos.js');
       
    var salvar = function(vTitulo, vSigla, callback) {		
		var newdata = new sequenceservicosModel.model({	titulo	: vTitulo,
												 		sigla	: vSigla});
        newdata.save(function(err, result) {                                             
        	if (err) {
                     	console.error('Erro: ' + err);
                        callback(err);
                     } 
            else     {
                        callback(result._id);
                     };
        });
    };
	
	var excluir = function(vId, callback) {
		sequenceservicosModel.model.findByIdAndRemove(vId, function(err, result) {
			if (err) {
                     	console.error('Erro: ' + err);
                        callback(err);
                     } 
            else     {
                        callback('Sucesso ao excluir os dados...');
                     };
		});
	};
	
	var listar = function(callback) {
		sequenceservicosModel.model.find(function(err, result) {
            if (err) {
                console.error('Erro: ' + err);
                callback('Houve algum problema, informação não encontrada.');
            }
            else {
            	callback(result);
			};
        });   			
    };
	
	var alterar = function(vId, vTitulo, vSigla, callback) {
		sequenceservicosModel.model.findById(vId, function (err, result) {  
			if (err) {
				console.error('Erro: ' + err);
                callback('Houve algum problema, informação não encontrada.');
			} 
			else {
				if (result) {
					result.titulo	= vTitulo	|| result.titulo;
					result.sigla 	= vSigla 	|| result.sigla;
					// Save the updated document back to the database
					result.save(function (err, result) {
						if (err) {
							console.error('Erro: ' + err);
							callback('Houve algum problema, informação não encontrada.');
						} 
						else {
							callback('Alterado: ' + result._id);
						};
					});
				} else {
					console.error('Erro: ' + err);
					callback('Houve algum problema, registro não encontrado.');
				};
			};
		});
	};

	var retorno = {	"salvar"    : salvar,
				 	"excluir"	: excluir,
				 	"listar"	: listar,
				  	"alterar"	: alterar};
   
	return retorno;     
    }