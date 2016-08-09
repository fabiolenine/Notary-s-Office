angular.module("sequenceCTRLService",[])
.controller('sequenceControllerService', function($scope,$http,$window,$location) {
	
	var vUrlS = '/api/sequence/v001/servicos';
	var vUrlE = '/api/sequence/v001/escolhas';
	
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
						$scope.escolhas.sequence = retorno.data;
						console.log($scope.escolhas);
    			}, function myError(retorno) {
        				console.log(retorno);
    			});	
	};
	
	$scope.telacheia = function() {
		window.open('/views/contentSequenceServicosFULLSCR.html','NewWindow','fullscreen=yes');
	};
	
	$scope.faseOne = function(dados) {
		zerar();
		$scope.escolhas.servico = {titulo	: dados.titulo,
								   	sigla	: dados.sigla};
	};
	
	$scope.faseTwo = function(dados) {
		$scope.escolhas.atendimento = dados;
		restSalvar(vUrlE, $scope.escolhas);
	};
	
	var zerar = function() {
		$scope.escolhas = {atendimento	: '',
						   sequence		: '',
						   servico		: {	titulo	: '',
									  		sigla	: ''}
						  };
	}; 
	
	var init = function() { 
		restListar(vUrlS, {});
		zerar();
    };
	
	init();
	
});