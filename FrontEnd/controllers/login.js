import { login } from "../api/auth.js";

const form = document.querySelector("#login-form");

// Traite la soumission du formulaire de connexion
async function submitLoginForm(event) {
  // Empêche le rechargement de la page lors de l'envoi du formulaire
  event.preventDefault();
  // Récupère les informations saisies par l'utilisateur
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  // Envoie les identifiants à l'API afin de tenter la connexion
  const success = await login(email, password);
  // Redirige l'utilisateur vers la page d'accueil si la connexion réussit
  if (success) {
    window.location.href = "index.html";
    return;
  }

  // Affiche un message d'erreur si la connexion échoue
  const errorMsg = document.querySelector(".error");
  if (errorMsg) {
    errorMsg.textContent = "Erreur dans l’identifiant ou le mot de passe";
  }
}

// Exécute la fonction de connexion lors de la soumission du formulaire
if (form) {
  form.addEventListener("submit", submitLoginForm);
}
