// routerlegadosdm.js
module.exports = function(app)
{

app.get('/', function(req, res) {
	res.render('index.ejs');
});

//------------------------------------------------
//-- Serviços do Dashboard -----------------------
//------------------------------------------------


app.get('/ping', function(req, res) {
	res.status(200).send("pong!");
});

};
