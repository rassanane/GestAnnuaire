	// create the module and name it scotchApp.
	//var scotchApp = angular.module('scotchApp', ['ngRoute', 'ngDialog']);
	var scotchApp = angular.module('scotchApp', ['ngRoute']);
	
	//L'url des services Rest :
	//var servicesUrl = "http://localhost:3000";
	var servicesUrl = "http://ec2-54-200-43-246.us-west-2.compute.amazonaws.com";

	// configure our routes
	scotchApp.config(function($routeProvider) {

		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/liste.html',
				controller  : 'listePersonneController'
			})

			.when('/home', {
				templateUrl : 'pages/home.html',
				controller  : 'mainController'
			})

			// route for the about page
			.when('/about', {
				templateUrl : 'pages/about.html',
				controller  : 'aboutController'
			})

			// route for the contact page
			.when('/contact', {
				templateUrl : 'pages/contact.html',
				controller  : 'contactController'
			});

	});

	// create the controller and inject Angular's $scope
	scotchApp.controller('mainController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Everyone come and see how good I look!';
	});

	scotchApp.controller('aboutController', function($scope) {
		$scope.message = 'Look! I am an about page.';
	});

	scotchApp.controller('contactController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	});

	scotchApp.controller('listePersonneController', function($scope, $http) {
		
		//Appel service rest pour selectionner les personnes
		/*$http.get('http://localhost:3000/personnes/').
			success(function(data) {
				alert(data);
				//$scope.greeting = data;
			});*/
		
		$http({
			method : "GET",
			url : servicesUrl + "/personnes"
		}).then(function mySucces(response) {
			$scope.personsArray = response.data.personnesDB;
			//$scope.personsArray = JSON.stringify(response.data.personnesDB);
		}, function myError(response) {
			$scope.personsArray = response.statusText;
		});

		/*$http({
			method : 'GET',
			url : 'http://localhost:3000/personnes/'
		}).then(function successCallback(response) {
			//$scope.employees = response.data.employees;
			alert('tata');
		}, function errorCallback(response) {
			alert('toto : ' + response.statusText);
			console.log(response.statusText);
		});*/

		
		$scope.supprimer = function (ident) {
			
			
			if(confirm("Etes vous sur de vouloir supprimer ? ")){
				$http({
					method : "GET",
					url : servicesUrl + "/personnes/delPersonne/"+ident
				}).then(function mySucces(response) {
					$scope.personsArray = response.data.personnesDB;
				}, function myError(response) {
					$scope.personsArray = response.statusText;
				});
			}
		  /*alert(ident);
		  alert($scope.personsArray);
		  $scope.personsArray.splice(ident, 1);
		  alert($scope.personsArray);
		  alert($scope.personsArray.length);*/
		};

		
		//alert("ident : " + ident);


		$scope.maj = function () {

			  // collect the form data while iterating over the inputs
			  var datajson = {};
			  datajson["id"] = document.annuaireForm.id.value;
			  datajson["nom"] = document.annuaireForm.nom.value;
			  datajson["prenom"] = document.annuaireForm.prenom.value;
			  datajson["age"] = document.annuaireForm.age.value;
			  datajson["groupe"] = document.annuaireForm.groupe.value;

				//alert(JSON.stringify(datajson));

				var config = {
					headers : {
						'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
					}
				}

				$http.post(servicesUrl + '/personnes/majPersonne/', JSON.stringify(datajson), config)
					.then(function mySucces(response) {
					$scope.personsArray = response.data.personnesDB;
				}, function myError(response) {
					$scope.personsArray = response.statusText;
				});

				
				document.getElementById('myModal').style.display = "none";

		};


		$scope.afficherMaj = function (ident) {
			
			
			$http({
				method : "GET",
				url : servicesUrl + "/personnes/"+ident
			}).then(function mySucces(response) {

				document.getElementById('id').value = response.data.personneDB[0].id_personnes;
				document.getElementById('nom').value = response.data.personneDB[0].nom;
				document.getElementById('prenom').value = response.data.personneDB[0].prenom;
				document.getElementById('age').value = response.data.personneDB[0].age;
				document.getElementById('groupe').value = response.data.personneDB[0].groupe;

				document.getElementById('myModal').style.display = 'block';

			}, function myError(response) {
				$scope.personsArray = response.statusText;
			});

		};


		$scope.afficherCreer = function () {
							
			document.getElementById('id').value = '';
			document.getElementById('nom').value = '';
			document.getElementById('prenom').value = '';
			document.getElementById('age').value = '';
			document.getElementById('groupe').value = '';

			document.getElementById('myModal').style.display = 'block';

		};



	});

	





	function initializeModal(){

		// Get the modal
		var modal = document.getElementById('myModal');

		// Get the <span> element that closes the modal
		var span = document.getElementsByClassName("close")[0];

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
			modal.style.display = "none";
		}

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		}

	}


