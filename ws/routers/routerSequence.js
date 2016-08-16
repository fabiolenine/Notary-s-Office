// Rota dos sites Cartório Moreira de Deus
module.exports = function(app,dbservicos,dbescolhas,dbchamadas)
{	
	app.route('/api/sequence/v001/servicos')
	.post(function(req, res){
		dbservicos.salvar(req.body.titulo, req.body.sigla, function(retorno) {
			res.send(retorno);
		});		
	})
	.get(function(req, res){
		dbservicos.listar(function(retorno) {
			res.send(retorno);
		});
	})
	.put(function(req, res){
		dbservicos.alterar(req.body.id, req.body.titulo, req.body.sigla, function(retorno) {
			res.send(retorno);
		});
	})
	.delete(function(req, res){
		dbservicos.excluir(req.body.id, function(retorno) {
			res.send(retorno);
		});
	});
	
	app.route('/api/sequence/v001/escolhas')
	.post(function(req, res){
		dbescolhas.salvar(req.body.atendimento, req.body.sequence, req.body.servico.titulo, req.body.servico.sigla, function(retorno) {
			res.send(retorno);
		});
	})
	.get(function(req, res) {
		dbescolhas.listar(function(retorno) {
			res.send(retorno);
		});
	}).put(function(req, res){
		dbescolhas.atualizar(req.body.id, req.body.guiche, req.body.sequence, req.body.atendimento, function(retorno) {
			res.send(retorno);
		});
	});
	
	app.route('/api/sequence/v001/chamadas')
	.get(function(req, res) {
		dbchamadas.listar(function(retorno) {
			res.send(retorno);
		});
	}).put(function(req, res){
		dbchamadas.atualizar(req.body.id, req.body.guiche, function(retorno) {
			res.send(retorno);
		});
	});
	
	const pathDir = '/Users/fabiolenine/Documents/Projetos/notarysoffice/web/views/';
	
	// Tratamentos dos erros 404 e 500
	app.use(function(req, res, next) {
  		res.status(404).sendFile(pathDir + '404.html');
	});

	app.use(function(err, req, res, next) {
	  	console.error(err.stack);
		res.status(500).sendFile(pathDir + '500.html');
	});

}