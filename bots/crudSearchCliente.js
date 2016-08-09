module.exports = function(mongoose)
    {
    const searchclienteModel  = require('./modelSearchCliente.js');
       
    var salvar = function(data, callback) {
        var newdata = new searchclienteModel.model(data);

        var checkinrec = searchclienteModel.model.find({codigo: newdata.codigo},function(err, result) {
            if (err) {
                console.error('Erro: ' + err);
                callback(err);
            }
            else {
                if (result) {
                    newdata.save(function(err, result) {                                             
                                        if (err) {
                                                    console.error('Erro: ' + err);
                                                    callback(err);
                                                 } 
                                        else     {
                                                    callback('sucesso');
                                                 }
                                            });
                }
                else {
                    console.log('Tentativa de insersão de código já existente, por favor, verifique o primeiro nível de proteção de consistência.');
                }
            }
        });   
    };
   
    var maxcodigo = function(callback) {
        
        var busca = searchclienteModel.model.find({},{_id: 0, codigo: 1}).sort({'codigo': -1}).limit(1).exec(function(err, result) {
                if (err) {
                            console.log('Erro: ' + err);
                            callback(result);
                         } 
                else     {
                            callback(result);
                        }
        }); 
    };

   var retorno = {  "salvar"    : salvar,
                    "maxcodigo" : maxcodigo};
   
   return retorno;     
    }