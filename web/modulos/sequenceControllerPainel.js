angular.module("sequenceCTRLPainel",['angular.filter'])
.controller('sequenceControllerPainel', function($scope,$http,$window,$interval,$timeout) {
	var synth = window.speechSynthesis;

	var voices = [];
	var vUrl = '/api/sequence/v001/chamadas';
	
	var limite = function(vsize,vlimite) {
		if (vsize > vlimite) {
			$scope.sequencechamadas.splice(vlimite,vsize-vlimite);
		};
	};
	
	var restListar = function(Url, dados) {
    	$http({	url: Url,
        		method: "GET",
        		params: dados
    			}).then(function mySucces(retorno) {
						$scope.dadosretorno = retorno.data;
						$scope.dadosretorno.forEach(registrar);
    			}, function myError(retorno) {
        				console.log(retorno);
    			});
	};
	
	function registrar(element, index, array){
		var vCount = (element.chamadas.length - 1);
		
		var vTemp = {	_id			: element._id,
						atendimento	: element.atendimento,
						sequence	: element.sequence,
						guiche		: element.chamadas[vCount].guiche,
						timestamp	: element.chamadas[vCount].timestamp
					};
		
		if ($scope.sequencechamadas.push(vTemp) > 8) { //limita em 8 linhas o array, backlog para transformar em parametro.
			$scope.sequencechamadas.shift();
		};
	};
	
	var init = function() {
		$scope.sequencechamadas = [];
		restListar(vUrl, {});
	};
	
	var socket = io.connect('http://10.1.1.4:8080');
	
	socket.on('chamada', function (dados) {
		$scope.$apply(function () {
			$scope.last = { sequence	: dados.sequence,
						   guiche		: dados.guiche,
						   atendimento	: dados.atendimento
						   };
			$scope.sequencechamadas = $scope.sequencechamadas.filter(function( obj ) {
				return obj._id !== dados._id;
			});
			if ($scope.sequencechamadas.push(dados) > 8) { //limita em 8 linhas o array, backlog para transformar em parametro.
				$scope.sequencechamadas.shift();
			};
		});
		notificationsound();			
	});
	
	var notificationsound = function() {
		notificationSound = new Audio('../sound/pluck.ogg');
		notificationSound.play();
		voice($scope.last.sequence, $scope.last.atendimento, $scope.last.guiche);
	};
	
	var voice = function(vSequence, vAtendimento, vGuiche) {
		var texto = 'Atenção, senha ' + vSequence + ', ' + vAtendimento + ', atendimento no balcão ' + vGuiche;

		var voices = synth.getVoices();
		
		var utterThis = new SpeechSynthesisUtterance(texto);
		utterThis.volume	= 1; // o default é o valor 1, ou seja o volume máximo.
		utterThis.pitch 	= 1; // o default é o valor 1.
		utterThis.rate 		= 1; // o default é o valor 1.
		utterThis.lang		= 'pt-BR';
		utterThis.voice		= voices[15];
		
		synth.speak(utterThis);
	};

	init();
	
});