import { BASE_API } from "../utils/const.js";

export async function fetchProjects() {
  // Envoie une requête GET à l'API pour récupérer la liste des projets
  const response = await fetch(`${BASE_API}/works`, {
    method: "GET",
    headers: {
      // Transmet le token d'authentification de l'utilisateur
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  // Arrête la fonction si la récupération des projets a échoué
  if (!response.ok) {
    return null;
  }
  // Retourne la liste des projets récupérée depuis l'API
  return await response.json();
}

export async function deleteProject(id) {
  // Envoie une requête à l'API pour supprimer le projet correspondant à l'identifiant reçu
  const response = await fetch(`${BASE_API}/works/${id}`, {
    method: "DELETE",
    headers: {
      // Transmet le token de l'utilisateur afin d'autoriser la suppression du projet
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  // Indique si la suppression a réussi
  return response.ok;
}

export async function addProject(formData) {
  // Envoie les données du formulaire à l'API pour créer un nouveau projet
  const response = await fetch(`${BASE_API}/works`, {
    method: "POST",
    headers: {
      // Transmet le token de l'utilisateur afin d'autoriser l'ajout du projet
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });
  // Arrête la fonction si la création du projet a échoué
  if (!response.ok) {
    return null;
  }
  // Retourne le projet créé par l'API
  return await response.json();
}
