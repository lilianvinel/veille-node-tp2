"use strict";

let max = 5;

let tableauPrenom = [
	"Francis",
	"Thomas",
	"Angel",
	"Alison",
	"Pierre"
];

let tableauNom = [
	"Laporte",
	"Tucci",
	"Bryan",
	"Smith",
	"Picola"
];

let tableauNum = [
	"514-514-5151",
	"514-123-4568",
	"438-222-2222",
	"438-999-9999",
	"350-111-1111"
];

let tableauCourriel = [
	"@hotmail.com",
	"@gmail.com",
	"@yahoo.com",
	"@hotmail.ca",
	"@gmail.ca"
];

const peupler_json = () => {

	let position1 = Math.floor(Math.random()*max)
	let position2 = Math.floor(Math.random()*max)
	let position3 = Math.floor(Math.random()*max)
	let position4 = Math.floor(Math.random()*max)

	return('{"nom":' +'"'+tableauNom[position1]+'"'+',"prenom":'+'"'+tableauPrenom[position2]+'"'+',"telephone":' +'"'+ tableauNum[position3] +'"'+',"courriel":'+'"'+tableauPrenom[position2].toLowerCase()+'.'+tableauNom[position1].toLowerCase()+ tableauCourriel[position4]+'"}');
}

module.exports = peupler_json