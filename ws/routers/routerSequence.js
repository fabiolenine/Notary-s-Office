// Rota dos sites Cartório Moreira de Deus
module.exports = function(app, passport, dbservicos, dbescolhas, dbchamadas)
{	
	
	// Web Page
	
	app.route('/login(.html)?')
	.post(passport.authenticate('local-login',{
		successRedirect : 'main',
		failureRedirect	: '/login',
		failureFlash	: true
	}))
	.get(function(req, res) {
		res.render('login.ejs', {message: req.flash('loginMessage')});
	});
	
	app.route('/signup(.html)?')
	.post(passport.authenticate('local-signup', {
		successRedirect	: '/',
		failureRedirect	: '/signup',
		failureFlash	: true
	}))
	.get(function(req, res) {
		res.render('signup.ejs', {message: req.flash('signupMessage')});
	});

	app.get('/', isLoggedIn, function(req, res) {
		res.render('index.ejs', {usuario: req.user});
	});
	
	app.get('/main(.html)?', isLoggedIn, function(req, res) {
		res.render('index.ejs', {usuario: req.user});
	});
	
	app.get('/perfil(.html)?', isLoggedIn, function(req, res) {
		res.render('perfil.ejs', {usuario: req.user});
	});
	
	app.get('/contentSequenceConfiguracao(.html)?', isLoggedIn, function(req, res) {
		res.render('contentSequenceConfiguracao.ejs', {usuario: req.user});
	});
	
	app.get('/contentSequenceDashboard(.html)?', isLoggedIn, function(req, res) {
		res.render('contentSequenceDashboard.ejs');
	});
	
	app.get('/contentSequenceLayouts(.html)?', isLoggedIn, function(req, res) {
		res.render('contentSequenceLayouts.ejs', {usuario: req.user});
	});
	
	app.get('/contentSequenceLista(.html)?', isLoggedIn, function(req, res) {
		res.render('contentSequenceLista.ejs', {usuario: req.user});
	});
	
	app.get('/contentSequenceServicos(.html)?', isLoggedIn, function(req, res) {
		res.render('contentSequenceServicos.ejs', {usuario: req.user});
	});
	
	app.get('/contentSequenceServicosFULLSCR(.html)?', isLoggedIn, function(req, res) {
		res.render('contentSequenceServicosFULLSCR.ejs', {usuario: req.user});
	});
	
	app.get('/painelLayout01(.html)?', isLoggedIn, function(req, res) {
		res.render('painelLayout01.ejs', {usuario: req.user});
	});
	
	app.get('/painelLayout02(.html)?', isLoggedIn, function(req, res) {
		res.render('painelLayout02.ejs', {usuario: req.user});
	});
	
	app.get('/404in(.html)?', isLoggedIn, function(req, res) {
		res.render('404in.ejs', {usuario: req.user});
	});
	
	app.get('/sair', function(req,res) {
		req.logout();
		res.redirect('/login');
	});
	
	// API

//	app.route('/api/sequence/v001/login')
//	.post(function(req, res){
//		console.log(req.body);
////		dbservicos.salvar(req.body.titulo, req.body.sigla, function(retorno) {
////			res.send(retorno);
////		});		
//	});	
	
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
	
	// Geral
	
	// Tratamentos dos erros 404 e 500
	app.use(function(req, res, next) {
  		res.status(403).render('403.ejs');
	});
	
	app.use(function(req, res, next) {
  		res.status(404).render('404.ejs');
	});

	app.use(function(err, req, res, next) {
	  	console.error(err.stack);
		res.status(500).render('500.ejs');
	});

};

function isLoggedIn(req, res, next) {
	console.log(req.isAuthenticated());
	if (req.isAuthenticated()) 
		return next();
	
	res.redirect('/login');
}