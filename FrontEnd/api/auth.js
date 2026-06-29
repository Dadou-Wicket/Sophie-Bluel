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
