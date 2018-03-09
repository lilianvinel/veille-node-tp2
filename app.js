"use strict";
const fs = require('fs');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const util = require("util");
const peupler = require("./mes_modules/peupler");
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app);
const io = require('./mes_modules/chat_socket').listen(server);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.set('view engine', 'ejs'); // générateur de template
app.use(cookieParser())
const i18n = require("i18n");
/* Ajouter l'objet i18n à l'objet global «res» */
app.use(i18n.init);

i18n.configure({ 
   locales : ['fr', 'en'],
   cookie : 'langueChoisie', 
   directory : __dirname + '/locales' 
})

app.get('/:locale(en|fr)', function(req, res){
	// on récupère le paramètre de l'url pour enregistrer la langue
  res.cookie('langueChoisie' , req.params.locale)
  res.setLocale(req.params.locale)
  // on peut maintenant traduire

  res.redirect(req.get('referer'))
})

app.get('/', (req, res) => {
 res.render('accueil.ejs');
})

app.get('/rechercher', (req, res) => {
	let cursor = db.collection('adresse').find({nom:"rien"}).toArray((err, resultat) => {

		res.render('rechercher.ejs', {adresses: resultat})
	})
})

app.get('/membres', (req, res) => {
 
console.log(req.body)
 var cursor = db.collection('adresse')
                .find().toArray((err, resultat) => {
 if (err) return console.log(err)
 // transfert du contenu vers la vue adresses.ejs (renders)
 res.render('membres.ejs', {adresses: resultat});
 }) 
})
app.get('/chat', (req, res) => {

  let noChambre = 1;
io.on('connection', function(socket){
  //Incrémenté noChambre si plus de un clients dans la chambre.
  if(io.nsps['/'].adapter.rooms["chambre-" + noChambre ] && io.nsps['/'].adapter.rooms["chambre-" + noChambre].length > 1)
    noChambre++;
  socket.join("chambre-"+noChambre);

  // déclenche cet événement pour tous les clients de la chambre.
  io.sockets.in("chambre-" + noChambre).emit('connectAlaChambre', "Vous êtes dans la chambre numéro " + noChambre);
})
  res.render('socket_vue.ejs')
});

app.post('/accueil',  (req, res) => {
 // Preparer l'output en format JSON
// on utilise l'objet req.body pour récupérer les données POST
db.collection('adresse').save(req.body, (err, result) => {
 if (err) return console.log(err)
 res.redirect('/adresses')
 })

})

app.get('/rechercher/:attribut/:valeur',  (req, res) => {
	let attribut = '"'+ req.params.attribut +'"'

	let valeur = '"'+ req.params.valeur +'"'
	console.log(valeur);

	let recherche =JSON.parse('{'+ attribut+':'+valeur+'}')
// on utilise l'objet req.body pour récupérer les données POST
let cursor = db.collection('adresse').find(recherche
).toArray((err, resultat) => {

		res.render('rechercher.ejs', {adresses: resultat, attribut, valeur})
	})
})

app.get('/peupler', (req, res) => {
	db.collection('adresse').save(JSON.parse(peupler()), (err, result) => {
 		if (err) return console.log(err)
 		res.redirect('/adresses')
 })
})

app.get('/trier/:cle/:ordre', (req, res) => {
	let cle = req.params.cle

	let ordre = (req.params.ordre == 'asc' ? 1 : -1)

	let cursor = db.collection('adresse').find().sort(cle,ordre).toArray(function(err, resultat){

		ordre = (req.params.ordre == "asc" ? "desc" : "asc")

		console.log(ordre);

		res.render('membres.ejs', {adresses: resultat, cle, ordre})
	})
})	

app.post('/ajax_ajout',  (req, res) => {
 // Preparer l'output en format JSON
// on utilise l'objet req.body pour récupérer les données POST
db.collection('adresse').save(req.body, (err, result) => {
 if (err) return console.log(err)
 res.redirect('/adresses')
 })

})

// Une nouvelle route pour traiter la requête AJAX

app.post('/ajax_modifier', (req,res) => {
   req.body._id = ObjectID(req.body._id)

   console.log('util = ' + util.inspect(req.body));

   db.collection('adresse').save(req.body, (err, result) => {
   if (err) return console.log(err)
       console.log('sauvegarder dans la BD')
   res.send(JSON.stringify(req.body));
   // res.status(204)
   })
})

app.get('/detruire/', (req, res) => {
 db.collection('adresse').deleteMany({}, (err, resultat) => {

if (err) return console.log(err)
 res.redirect('/adresses')  // redirige vers la route qui affiche la collection
 })
})

app.post('/ajax_detruire', (req, res) => {
 let id = req.body._id;
 db.collection('adresse').findOneAndDelete({"_id": ObjectID(id)}, (err, resultat) => {

if (err) return console.log(err)
 })
})	

let db; // variable qui contiendra le lien sur la BD

MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
 if (err) return console.log(err)
 db = database.db('carnet_adresse')
// lancement du serveur Express sur le port 8081
 server.listen(8081, (err) => {
 console.log('connexion à la BD et on écoute sur le port 8081')
 })
})