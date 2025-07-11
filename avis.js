/* global Chart */
export function ajoutListenersAvis() {

	const vinylesElements = document.querySelectorAll(".fiches article button");
 
	for (let i = 0; i < vinylesElements.length; i++) {
 
		vinylesElements[i].addEventListener("click", async function (event) {
 
			const id = event.target.dataset.id;
			const reponse = await fetch(`http://localhost:3000/avis?vinyleId=${id}`);
			const avis = await reponse.json();
			window.localStorage.setItem(`avis-vinyle-${id}`, JSON.stringify(avis));
			const vinyleElement = event.target.parentElement;
			afficherAvis(vinyleElement, avis);
		});
 
	}
}
 
export function afficherAvis(vinyleElement, avis){
	const avisElement = document.createElement("p");
	for (let i = 0; i < avis.length; i++) {
		avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire} <br>`;
	}
	vinyleElement.appendChild(avisElement);
}

export function ajoutListenerEnvoyerAvis() {
	const formulaireAvis = document.querySelector(".formulaire-avis");
	formulaireAvis.addEventListener("submit", function (event) {
		event.preventDefault();
		// Création de l’objet du nouvel avis.
		const avis = {
			vinyleId: parseInt(event.target.querySelector("[name=vinyle-id]").value),
			utilisateur: event.target.querySelector("[name=utilisateur]").value,
			commentaire: event.target.querySelector("[name=commentaire]").value,
			nbEtoiles: parseInt(event.target.querySelector("[name=nbEtoiles]").value)
		};
		// Création de la charge utile au format JSON
		const chargeUtile = JSON.stringify(avis);
		// Appel de la fonction fetch avec toutes les informations nécessaires
		fetch("http://localhost:3000/avis", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: chargeUtile
		});
	});
    
}

export async function afficherGraphiqueAvis() {
	// Calcul du nombre total de commentaires par quantité d'étoiles attribuées
	const avis = await fetch("http://localhost:3000/avis").then(avis => avis.json());
	const nb_commentaires = [0, 0, 0, 0, 0];

	for (let commentaire of avis) {
		nb_commentaires[commentaire.nbEtoiles - 1]++;
	}
	// Légende qui s'affichera sur la gauche à côté de la barre horizontale
	const labels = ["5", "4", "3", "2", "1"];
	// Données et personnalisation du graphique
	const data = {
		labels: labels,
		datasets: [{
			label: "Étoiles attribuées",
			data: nb_commentaires.reverse(), // le reverse permet de mettre les commentaires à 5 étoiles en haut
			backgroundColor: "rgba(255, 230, 0, 1)", // couleur jaune
		}],
	};
	// Objet de configuration final
	const config = {
		type: "bar",
		data: data,
		options: {
			indexAxis: "y",
		},
	};
	// Rendu du graphique dans l'élément canvas
	new Chart(
		document.querySelector("#graphique-avis"),
		config,
	);
	// Récupération des pièces depuis le localStorage
	const vinylesJSON = window.localStorage.getItem("vinyles");
	//const vinyles = vinylesJSON ? JSON.parse(vinylesJSON) : [];
	const vinyles = JSON.parse(vinylesJSON);
	// Calcul du nombre de commentaires
	let nbCommentairesDispo = 0;
	let nbCommentairesNonDispo = 0;
	//if(vinyles.length > 0){
	console.log("Données des vinyles :", vinyles);
	console.log("Données des avis :", avis);

	for (let i = 0; i < avis.length; i++) {
		const piece = vinyles.find(p => p.id === avis[i].vinyleId);

		if (piece) {
			if (piece.disponibilite) {
				nbCommentairesDispo++;
			} else {
				nbCommentairesNonDispo++;
			}
		}
	}

	// Légende qui s'affichera sur la gauche à côté de la barre horizontale
	const labelsDispo = ["Disponibles", "Non dispo."];

	// Données et personnalisation du graphique
	const dataDispo = {
		labels: labelsDispo,
		datasets: [{
			label: "Nombre de commentaires",
			data: [nbCommentairesDispo, nbCommentairesNonDispo],
			backgroundColor: "rgba(0, 230, 255, 1)", // turquoise
		}],
	};

	// Objet de configuration final
	const configDispo = {
		type: "bar",
		data: dataDispo,
	};
	console.log(dataDispo);
	// Rendu du graphique dans l'élément canvas
	new Chart(
		document.querySelector("#graphique-dispo"),
		configDispo,
	);

}


