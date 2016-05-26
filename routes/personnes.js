
////////////////////////////////////////////////////////////////////////////////////
// personnes.js pour publier des services REST
////////////////////////////////////////////////////////////////////////////////////



var express = require('express');
var router = express.Router();

//Pour tester avant de se connecter a la BD
var personnes = require('../personnes.json');

var PersonneDB = require('../database/PersonneDB');

// Liste des personnes
router.get('/', function(req, res) {

	// get all the personnes from DB
	PersonneDB.find({}, function(err, personnesDB) {
	  if (err) {
		  throw err;
	  }else{
		  // object of all the personnesDB
		  //console.log(personnesDB);
		  res.send({ title: 'Personnes', personnesDB });
	  }
	});

   //res.send({ title: 'Personnes', personnes });

});

// Selectionner une personne par son id_personnes
router.get('/:id', function(req, res, next) {
	console.log(req.params)
   
   //var personne = personnes["pers" + req.params.id] 

	// get the user with id_personnes
	PersonneDB.find({id_personnes : req.params.id }, function(err, personneDB) {
	//console.log(personneDB);
	  if (err) {
		  throw err;
	  }else{

		   if(personneDB.length!=0){
			  res.send({ title: 'Personne', personneDB});
		   }else{
			  res.send({ Message: 'Personne not present'});
		   }   

	  }
	});

});

// Ajouter une personnes !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! il faut tester avec firefox Rest easy (post)
router.post('/majPersonne', function(req, res, next) { 

	////  {"id":4,"nom":"Brown","prenom":"Samir","age":"30","groupe":2}

	var body = '';
	req.on('data', function (data) {
		body += data;
	});

	req.on('end', function () {  
		
	   var json = JSON.parse(body);
	   console.log("json : " + JSON.stringify(json));
		
		//Insertion
		if(json.id==''){

			//Select max id
			var maxId = 0;
			PersonneDB.findOne().sort('-id_personnes').exec(function(err, item) {
				if(item == null){
					maxId = 1;
				}else{
					maxId = item.id_personnes + 1;
				}
				
				console.log("maxId : " + maxId);
				var newPerson = PersonneDB({
				  id_personnes: maxId,
				  nom: json.nom,
				  prenom: json.prenom,
				  age: json.age,
				  groupe: json.groupe
				});

				// save the person
				newPerson.save(function(err) {
				  if (err) {
					  throw err;
				  }else{
					console.log('User created!');

					// get all the personnes from DB
					PersonneDB.find({}, function(err, personnesDB) {
					  if (err) {
						  throw err;
					  }else{
						  // object of all the personnesDB
						  res.send({ title: 'Personnes', personnesDB });
					  }
					});

				  }
				});

			});

		}

		
		//Update
		if(json.id!=''){

			// get a user with ID of 1
			PersonneDB.findOne({id_personnes : json.id }, function(err, personneDB) {
			  if (err) throw err;

			  personneDB.id_personnes = json.id;
			  personneDB.nom = json.nom;
			  personneDB.prenom = json.prenom;
			  personneDB.age = json.age;
			  personneDB.groupe = json.groupe;

			  // save the user
			  personneDB.save(function(err) {
				if (err) throw err;

				console.log('personneDB successfully updated!');
			  });

			});

		}


	   //personnes["pers"+json.id] = body;
	   /*personnes["pers4"] = body;
	   res.send({ Message: 'Personne Added'});    */  
	});	   

});

// Supprimer une personnes
router.get('/delPersonne/:id', function(req, res, next) { 

	// get the user with id_personnes
	PersonneDB.findOne({id_personnes : req.params.id }, function(err, personneDB) {
	  if (err) {
		  throw err;
	  }else{

		  // delete him
		  personneDB.remove(function(err) {
			if (err) {
				throw err;
			}else{
				console.log('Personne successfully deleted!');

				// get all the personnes from DB
				PersonneDB.find({}, function(err, personnesDB) {
				  if (err) {
					  throw err;
				  }else{
					  // object of all the personnesDB
					  res.send({ title: 'Personnes', personnesDB });
				  }
				});
			}
		  });
	  }
	});

		   /*var personne = personnes["pers" + req.params.id] 
		   if(personne){
			  
			  //var index = Object.keys(personnes).indexOf("pers" + req.params.id);
			  delete personnes["pers" + req.params.id];
			  res.send({ title: 'Personnes', personnes });  

		   }else{
			  res.send({ Message: 'Personne not present'});
		   }   */

});

module.exports = router;



