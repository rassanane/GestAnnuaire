
// grab the things we need
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/annuaire');
mongoose.connect('mongodb://rachid:test123@ec2-54-200-43-246.us-west-2.compute.amazonaws.com:11933/base_test');


var Schema = mongoose.Schema;

// create a schema
var personneSchema = new Schema({
  id_personnes: {type: Number, unique: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  age: Number,
  groupe: Number,
  created_at: Date,
  updated_at: Date
});


// custom method to add string to end of name
// you can create more important methods like name validations or formatting
// you can also do queries and find similar users 
personneSchema.methods.dudify = function() {
  // add some stuff to the users name
  this.name = this.name + '-dude'; 

  return this.name;
};

// the schema is useless so far
// we need to create a model using it
var PersonneDB = mongoose.model('Personne', personneSchema);

// make this available to our users in our Node applications
module.exports = PersonneDB;

