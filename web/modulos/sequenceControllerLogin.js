angular.module("sequenceCTRLLogin",[])
.controller('sequenceControllerLogin', function($scope,$http,$window,$location) {
	
	var vUrl = '/api/sequence/v001/login';
	
	var restSubmeter = function(Url, dados) {
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
	
	$scope.submeter = function() {
		restSubmeter(vUrl,$scope.login);
	};
	
	var init = function() {
		$scope.login = {usuario	: '',
						senha	: ''};
	};
	
	init();
	
});