import { login } from "../api/auth.js";

const form = document.querySelector("#login-form");

//Fonction de soumission du formulaire
async function submitLoginForm(event) {
  event.preventDefault(); // empêche le rechargement de la page

  // Récupération des valeurs du formulaire
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  // Appel de la fonction login
  const success = await login(email, password);

  // Si connexion réussie → redirection
  if (success) {
    window.location.href = "index.html";
    return;
  }

  // Sinon affichage du message d’erreur
  const errorMsg = document.querySelector(".error");

  if (errorMsg) {
    errorMsg.textContent = "Erreur dans l’identifiant ou le mot de passe";
  }
}

// Ajout de l'écouteur d'événement sur le formulaire, quand l'utilisateur
// clique sur "Envoyer", appelle la fonction submitLoginForm
if (form) {
  form.addEventListener("submit", submitLoginForm);
}
