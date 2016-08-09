module.exports = function(dbfb,mongoose,SearchCliente)
    {

    const funcCliTip    = require('./funcCliTip.js');
    const funcTrim      = require('./funcTrim.js');
    const funcString    = require('./funcString.js');

    var io = function(dataone, datatwo, callback) {

        var datafirst   = dataone;
        var datalast    = datatwo;

        console.log('Período: '+ datafirst + ' a ' + datalast);

        dbfb.query("Select cliCod, coalesce(CAST(cliNomFantasia AS VARCHAR(250) CHARACTER SET ISO8859_1),'') as FANTASIA, coalesce(CAST(cliEmail AS VARCHAR(250) CHARACTER SET ISO8859_1),'') as EMAIL, coalesce(CAST(cliNom AS VARCHAR(250) CHARACTER SET ISO8859_1),'') as NOME, coalesce(cliCPFCGC,'') CPFCGC, coalesce(cliDTNascimento,'') NASCIMENTO, coalesce(cliDTCadastro,'') as CADASTRO, coalesce(cliDTOBITO,'') as DATAOBITO, Case When CLIDEFICIENTEVISUAL = '1' then 'Visual' end VISUAL, Case When CLIRELINCAPAZ = '1' then 'Relativamente Incapaz' end INCAPAZ, Case When CLIDTOBITO is not null Then 'Falecido' end OBITO, cliTip, Case When cliBLOQ = 1 Then 'Bloqueado no SAN' end BLOQUEADO, Case When cliEsc = 1 or CliFesc = 1 then 'Escritura' end ESCRITURA, Case When cliPro = '1' or cliFpro = 1 then 'Procuração' end PROCURACAO, Case When cliASS = 1 then 'Firma' end ASSINATURA From SAN0000 Where cliCod between ? and ?",[datafirst, datalast],function(err, result) {

        if (err) { 
            console.log(err);
                }
        else {            
            for (var i = 0; i < result.length; i++) {

                var codigo                  = result[i].CLICOD;
                var tipopessoa              = funcCliTip(result[i].cliTip);
                var atosregistrado          = [funcTrim(result[i].ESCRITURA),funcTrim(result[i].PROCURACAO),funcTrim(result[i].ASSINATURA)].filter(Boolean)
                var situacao                = ['Novo',funcTrim(result[i].BLOQUEADO),funcTrim(result[i].OBITO)].filter(Boolean);
                var pessoacomdeficiencia    = [funcTrim(result[i].VISUAL),funcTrim(result[i].INCAPAZ)].filter(Boolean);
                var dataobito               = funcString(result[i].DATAOBITO);
                var datanascimento          = funcString(result[i].NASCIMENTO);
                var datacadastro            = funcString(result[i].CADASTRO);
                var cpfcnpj                 = funcString(result[i].CPFCGC);
                var nome                    = funcString(result[i].NOME);
                var nomefantasia            = funcString(result[i].FANTASIA);
                var email                   = funcString(result[i].EMAIL);  
                                
                var data   = {   codigo
                                ,situacao 
                                ,tipopessoa        
                                ,atosregistrado
                                ,pessoacomdeficiencia
                                ,dataobito 
                                ,datanascimento
                                ,datacadastro
                                ,cpfcnpj
                                ,nome
                                ,nomefantasia
                                ,email
                            };

                                    SearchCliente.salvar(data, function(retorno) {
                                        //console.log('deu certo ....');
                                    });   
                                };                                                
                            };
                            dbfb.detach();
                        });
    };

   var retorno = {"io" : io};
   
   return retorno;     
    }