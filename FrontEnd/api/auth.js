import { BASE_API } from "../utils/const.js";

// Envoie email + password à l'API et récupère un token si succès
export async function login(email, password) {
  try {
    // Envoi de la requête POST vers l'API login
    const response = await fetch(BASE_API + "/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Si la réponse du serveur est OK
    if (response.ok) {
      // on récupère les données renvoyées par l'API (token)
      let data = await response.json();

      // On stocke le token dans le localStorage pour garder l'utilisateur connecté
      localStorage.setItem("token", data.token);

      return true;
    } else {
      return false;
    }
  } catch (error) {
    // Si erreur réseau ou serveur inaccessible
    return false;
  }
}

export async function logout() {
  // On supprime le token pour déconnecter l'utilisateur
  localStorage.removeItem("token");
}

export function getUserData() {
  return localStorage.getItem("token");
}

export function isLogged() {
  return localStorage.getItem("token") !== null;
}

const form = document.querySelector("#login-form");

//Fonction de soumission du formulaite
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

  // Sinon → affichage du message d’erreur
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
