import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherAvis, afficherGraphiqueAvis } from "/avis.js";
//Récupération des vinyles eventuellement stockées dans le localStorage
let vinyles = window.localStorage.getItem("vinyles");

if (vinyles === null) {
	// Récupération des vinyles depuis l'API
	const reponse = await fetch("http://localhost:3000/vinyles/");
	vinyles = await reponse.json();
	// Transformation des vinyles en JSON
	const valeurvinyles = JSON.stringify(vinyles);
	// Stockage des informations dans le localStorage
	window.localStorage.setItem("vinyles", valeurvinyles);
} else {
	vinyles = JSON.parse(vinyles);
}
// on appel la fonction pour ajouter le listener au formulaire
ajoutListenerEnvoyerAvis();

function genererVinyles(vinyles) {
	for (let i = 0; i < vinyles.length; i++) {

		const article = vinyles[i];
		// Récupération de l'élément du DOM qui accueillera les fiches
		const sectionFiches = document.querySelector(".fiches");
		// Création d’une balise dédiée à un vinyle
		const vinyleElement = document.createElement("article");
		vinyleElement.dataset.id = vinyles[i].id;
		// Création des balises 
		const imageElement = document.createElement("img");
		imageElement.src = article.image;
		const nomElement = document.createElement("h2");
		nomElement.innerText = `${article.id} - ${article.nom}`;
		const artisteElement = document.createElement("h3");
		artisteElement.innerText = article.artiste;
		const anneeElement = document.createElement("h4");
		anneeElement.innerText = article.annee;
		const prixElement = document.createElement("p");
		prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;
		const categorieElement = document.createElement("p");
		categorieElement.innerText = article.categorie ?? "(aucune catégorie)";
		const descriptionElement = document.createElement("p");
		descriptionElement.innerText = article.description ?? "Pas de description pour le moment.";
		const stockElement = document.createElement("p");
		stockElement.innerText = article.disponibilite ? "En stock" : "Rupture de stock";
		//Code ajouté
		const avisBouton = document.createElement("button");
		avisBouton.dataset.id = article.id;
		avisBouton.textContent = "Afficher les avis";

		// On rattache la balise article a la section Fiches
		sectionFiches.appendChild(vinyleElement);
		vinyleElement.appendChild(imageElement);
		vinyleElement.appendChild(nomElement);
		vinyleElement.appendChild(artisteElement);
		vinyleElement.appendChild(anneeElement);
		vinyleElement.appendChild(prixElement);
		vinyleElement.appendChild(categorieElement);
		vinyleElement.appendChild(descriptionElement);
		vinyleElement.appendChild(stockElement);
		//Code aJouté
		vinyleElement.appendChild(avisBouton);

	}
	ajoutListenersAvis();
}

genererVinyles(vinyles);

for (let i = 0; i < vinyles.length; i++) {
	const id = vinyles[i].id;
	const avisJSON = window.localStorage.getItem(`avis-vinyle-${id}`);
	const avis = JSON.parse(avisJSON);

	if (avis !== null) {
		const vinyleElement = document.querySelector(`article[data-id="${id}"]`);
		afficherAvis(vinyleElement, avis);
	}
}

//gestion des bouttons 
const boutonTrier = document.querySelector(".btn-trier");

boutonTrier.addEventListener("click", function () {
	const vinylesOrdonnees = Array.from(vinyles);
	vinylesOrdonnees.sort(function (a, b) {
		return a.prix - b.prix;
	});
	document.querySelector(".fiches").innerHTML = "";
	genererVinyles(vinylesOrdonnees);
});

const boutonFiltrer = document.querySelector(".btn-filtrer");

boutonFiltrer.addEventListener("click", function () {
	const vinylesFiltrees = vinyles.filter(function (vinyle) {
		return vinyle.prix >= 35;
	});
	document.querySelector(".fiches").innerHTML = "";
	genererVinyles(vinylesFiltrees);
});


const boutonDecroissant = document.querySelector(".btn-decroissant");

boutonDecroissant.addEventListener("click", function () {
	const vinylesOrdonnees = Array.from(vinyles);
	vinylesOrdonnees.sort(function (a, b) {
		return b.prix - a.prix;
	});
	document.querySelector(".fiches").innerHTML = "";
	genererVinyles(vinylesOrdonnees);
});

const boutonRelease = document.querySelector(".btn-release");

boutonRelease.addEventListener("click", function () {
	const vinylesRelease = Array.from(vinyles);
	vinylesRelease.sort(function (a, b) {
		return a.annee - b.annee;
	});
	document.querySelector(".fiches").innerHTML = "";
	genererVinyles(vinylesRelease);
});

const boutonNoDescription = document.querySelector(".btn-nodesc");

boutonNoDescription.addEventListener("click", function () {
	const vinylesFiltrees = vinyles.filter(function (vinyle) {
		return vinyle.description;
	});
	document.querySelector(".fiches").innerHTML = "";
	genererVinyles(vinylesFiltrees);
});

const noms = vinyles.map(vinyle => vinyle.nom);
for (let i = vinyles.length - 1; i >= 0; i--) {
	if (vinyles[i].prix > 35) {
		noms.splice(i, 1);
	}
}
console.log(noms);
//Création de l'en-tête

const pElement = document.createElement("p");
pElement.innerText = "Vinyles abordables :";
//Création de la liste
const abordablesElements = document.createElement("ul");
//Ajout de chaque nom à la liste
for (let i = 0; i < noms.length; i++) {
	const nomElement = document.createElement("li");
	nomElement.innerText = noms[i];
	abordablesElements.appendChild(nomElement);
}
// Ajout de l'en-tête puis de la liste au bloc résultats filtres
document.querySelector(".abordables")
	.appendChild(pElement)
	.appendChild(abordablesElements);

const nomsDisponibles = vinyles.map(vinyle => vinyle.nom);
const prixDisponibles = vinyles.map(vinyle => vinyle.prix);

for (let i = vinyles.length - 1; i >= 0; i--) {
	if (vinyles[i].disponibilite === false) {
		nomsDisponibles.splice(i, 1);
		prixDisponibles.splice(i, 1);
	}
}

const disponiblesElement = document.createElement("ul");

for (let i = 0; i < nomsDisponibles.length; i++) {
	const nomElement = document.createElement("li");
	nomElement.innerText = `${nomsDisponibles[i]} - ${prixDisponibles[i]} €`;
	disponiblesElement.appendChild(nomElement);
}

const pElementDisponible = document.createElement("p");
pElementDisponible.innerText = "Vinyles disponibles :";
document.querySelector(".disponibles").appendChild(pElementDisponible).appendChild(disponiblesElement);

const inputPrixMax = document.querySelector("#prix-max");
inputPrixMax.addEventListener("input", function () {
	const vinylesFiltrees = vinyles.filter(function (vinyle) {
		return vinyle.prix <= inputPrixMax.value;
	});
	document.querySelector(".fiches").innerHTML = "";
	genererVinyles(vinylesFiltrees);
});

const value = document.querySelector("#value");
const input = document.querySelector("#prix-max");
value.textContent = input.value;
input.addEventListener("input", (event) => {
  value.textContent = event.target.value;
});


// Ajout du listener pour mettre à jour des données du localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
	window.localStorage.removeItem("vinyles");
});

await afficherGraphiqueAvis();

