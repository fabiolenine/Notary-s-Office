angular.module("sequenceRouter",[]).config(function ($routeProvider){
	$routeProvider.when("/",{
		templateUrl:"./views/contentSequenceDashboard.html",
		controller:"sequenceControllerMain"
	})
	.when("/dashboard/sequence",{
		templateUrl:"./views/contentSequenceDashboard.html",
		controller:"sequenceControllerMain"
	})
	.when("/sequence/lista",{
		templateUrl:"./views/contentSequenceLista.html",
		controller:"sequenceControllerLista"
	})
	.when("/sequence/servicos",{
		templateUrl:"./views/contentSequenceServicos.html",
		controller:"sequenceControllerService"
	})
	.when("/sequence/configuracao",{
		templateUrl:"./views/contentSequenceConfiguracao.html",
		controller:"sequenceControllerConfig"
	})
	.when("/404",{
		templateUrl:"./views/404in.html",
		controller:"sequenceControllerMain"
	})
	.otherwise({
		redirectTo:"/404"
	});
});