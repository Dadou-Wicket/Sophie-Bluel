import { BASE_API } from "../utils/const.js";

export async function loadCategories() {
  // Récupère la liste des catégories depuis l'API
  const response = await fetch(`${BASE_API}/categories`);
  const categories = await response.json();
  // Récupère la liste déroulante des catégories
  const select = document.querySelector("#category-select");
  // Arrête la fonction si la liste déroulante est introuvable
  if (!select) return;
  // Supprime les catégories actuellement affichées
  select.innerHTML = "";
  // Ajoute une option vide affichée par défaut
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);
  // Ajoute chaque catégorie récupérée dans la liste déroulante
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  }
}
