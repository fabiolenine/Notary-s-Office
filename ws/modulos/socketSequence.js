module.exports = function (socket) {
	console.log('Conexão estabelecida por mais um client...');
	
	socket.emit('escolha',function(){
		console.log('Teste');
	});
	
	socket.on('disconnect', function(){
		console.log('Um client desconectou...');
	});
};