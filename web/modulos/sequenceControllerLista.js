angular.module("sequenceCTRLLista",['angular.filter'])
.controller('sequenceControllerLista', function($scope,$http,$window,$interval,$timeout) {
	
	var vUrl = '/api/sequence/v001/escolhas';
	
	var restListar = function(Url, dados) {
    	$http({	url: Url,
        		method: "GET",
        		params: dados
    			}).then(function mySucces(retorno) {
						$scope.dadosretorno = retorno.data;
    			}, function myError(retorno) {
        				console.log(retorno);
    			});
	};
	
	var restAtualizar = function(Url, dados) {
		$http({	url: Url,
        		method: "PUT",
			   	data: dados,
			    headers: {'Content-Type': 'application/json;charset=utf-8'}
    			}).then(function mySucces(retorno) {
							console.log(retorno);
							$scope.dadosretorno.forEach(registrar);
							console.log($scope.dadosretorno);
			
    			}, function myError(retorno) {
        				console.log(retorno);
    			});	
	};
	
	var init = function() { 
		restListar(vUrl, {});
		$scope.buttonEnabledChamar = true;
		clock();
    };
	
	var tictac = function(element, index, array){
		$scope.dadosretorno[index].tictac = secondsToHms((new Date() - new Date($scope.dadosretorno[index].timestamp)) / 1000);
	};
	
	var clock = function() {
		$interval(function() {
			$scope.dadosretorno.forEach(tictac);
		}, 1000 * 3);
	};
	
	function secondsToHms(d) {
		d = Number(d);
		var h = Math.floor(d / 3600);
		var m = Math.floor(d % 3600 / 60);
		var s = Math.floor(d % 3600 % 60);
		return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s); 
	};
	
	var socket = io.connect('http://192.168.0.6:8080'); //O IP ou Endereço do servidor;
	socket.on('escolha', function (dados) {
		$scope.dadosretorno.push(dados);
	});
	socket.on('chamada', function (dados) {
		if( dados.guiche !== $scope.envio.guiche) {
			$scope.dadosretorno = $scope.dadosretorno.filter(function( obj ) {
				return obj._id !== dados._id;
			});
		};
	});
	
	function registrar(element, index, array){
		if(element._id === $scope.envio.id) {
			$scope.dadosretorno[index].chamadas.push({guiche: $scope.envio.guiche});
		};
	};
	
	$scope.chamar = function(dados) {
		$scope.buttonEnabledChamar = false;
		$scope.envio = {id		: dados._id,
					 	guiche	: $scope.envio.guiche}; 
		restAtualizar(vUrl, $scope.envio);
		$timeout(function() {
   			$scope.buttonEnabledChamar = true;
		}, 1000 * 3);
	};
	
	$scope.atender = function(dados) {
		console.log(dados);
	};
	
	init();

});