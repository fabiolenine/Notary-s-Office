angular.module("sequenceCTRLLista",['angular.filter'])
.controller('sequenceControllerLista', function($scope,$http,$window,$interval) {
	
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
	
	var init = function() { 
		restListar(vUrl, {});
		clock();
    };
	
	var tictac = function(element, index, array){
		$scope.dadosretorno[index].tictac = secondsToHms((new Date() - new Date($scope.dadosretorno[index].timestamp)) / 1000);
	};
	
	var clock = function() {
		$interval(function() {
			$scope.dadosretorno.forEach(tictac);
		}, 1000*3);
	};
	
	function secondsToHms(d) {
		d = Number(d);
		var h = Math.floor(d / 3600);
		var m = Math.floor(d % 3600 / 60);
		var s = Math.floor(d % 3600 % 60);
		return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s); 
	};
	
	init();

});