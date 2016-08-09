angular.module("sequenceCTRLConfig",[])
.controller('sequenceControllerConfig', function($scope,$http,$window,$location) {
	
	var vUrl = '/api/sequence/v001/servicos';
	
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
	
	var restSalvar = function(Url, dados) {
    	$http({	url: Url,
        		method: "POST",
        		data: dados,
			    headers : {'Content-Type': 'application/json;charset=utf-8'}
    			}).then(function mySucces(retorno) {
						$scope.dadosretorno.push({	id			: retorno.data,
													titulo		: dados.titulo,
													sigla		: dados.sigla,
													timestamp	: new Date(dados.timestamp)});
						console.log($scope.dadosretorno);
						$scope.showbtdel = true;
    			}, function myError(retorno) {
        				console.log(retorno);
    			});	
	};
	
	var restExcluir = function(Url, dados) {
		$http({	url: Url,
        		method: "DELETE",
			   	data: dados,
			    headers: {'Content-Type': 'application/json;charset=utf-8'}
    			}).then(function mySucces(retorno) {
							$scope.novo();
							$scope.dadosretorno = $scope.dadosretorno.filter(function( obj ) {
    							console.log(obj);
								console.log(dados.id);
								return obj._id !== dados.id;
							});
    			}, function myError(retorno) {
        				console.log(retorno);
    			});	
	};
	
	var restAlterar = function(Url, dados) {
		$http({	url: Url,
        		method: "PUT",
			   	data: dados,
			    headers: {'Content-Type': 'application/json;charset=utf-8'}
    			}).then(function mySucces(retorno) {
							$scope.dadosretorno.forEach(substituir);
							console.log($scope.dadosretorno);
			
    			}, function myError(retorno) {
        				console.log(retorno);
    			});	
	};
	
	function substituir(element, index, array){
		if(element._id === $scope.dados.id) {
			$scope.dadosretorno[index].titulo 	= $scope.dados.titulo;
			$scope.dadosretorno[index].sigla	= $scope.dados.sigla;
		};
	};
	
	var init = function() { 
		restListar(vUrl, {});
		$scope.showbtdel = false;
    };
	
	$scope.excluir = function() {
		restExcluir(vUrl,$scope.dados);
	};
	
	$scope.salvar = function() {
		if ($scope.dados.id !== '') {
			restAlterar(vUrl, $scope.dados);
		} else { restSalvar(vUrl, $scope.dados)};
	};
	
	$scope.novo = function() {
		$scope.dados 		= {	id			: '',
					   			titulo		: '',
					   			sigla		: '',
					   			timestamp	: new Date()}; 
		$scope.showbtdel	= false;
	};
	
	$scope.existente = function(registro) {
		$scope.dados 		= {	id			: registro._id,
					   			titulo		: registro.titulo,
					   			sigla		: registro.sigla,
					   			timestamp	: new Date(registro.timestamp)};
		$scope.showbtdel	= true;
	};

	init();
	
});