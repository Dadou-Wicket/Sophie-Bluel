import { BASE_API } from "../utils/const.js";

export async function loadCategories() {
  // Récupère la liste des catégories depuis l'API
  const response = await fetch(`${BASE_API}/categories`);
  const categories = await response.json();
  return categories;
}
