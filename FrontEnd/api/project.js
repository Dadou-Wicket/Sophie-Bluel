import { BASE_API } from "../utils/const.js";

export async function deleteItem(id) {
  // Envoie une requête DELETE vers l'API pour supprimer un projet précis
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",

    headers: {
      // Envoie le token d'authentification pour prouver que l'utilisateur est connecté
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // Retourne true si la requête a réussi
  return response.ok;
}
