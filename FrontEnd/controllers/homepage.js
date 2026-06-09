const worksResponse = await fetch("http://localhost:5678/api/works");
const works = await worksResponse.json();
const categoriesResponse = await fetch("http://localhost:5678/api/categories");
const categories = await categoriesResponse.json();

const galleryContainer = document.querySelector(".gallery");

// Parcourt les projets récupérés depuis l’API et crée dynamiquement les éléments HTML de la galerie
for (const project of works) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  figure.appendChild(img);
  img.setAttribute("src", project.imageUrl);
  img.setAttribute("alt", project.title);
  const figcaption = document.createElement("figcaption");
  figure.appendChild(figcaption);
  figcaption.innerText = project.title;
  galleryContainer.appendChild(figure);
}

const filtersContainer = document.querySelector(".filters");

// Création du bouton de filtre "Tous", non présent dans les données de l’API
const allFilterButton = document.createElement("button");
allFilterButton.textContent = "Tous";
filtersContainer.appendChild(allFilterButton);

// Parcourt les catégories récupérées depuis l’API et crée dynamiquement les boutons de filtre
for (const category of categories) {
  const filterButton = document.createElement("button");
  filterButton.type = "button";
  filterButton.textContent = category.name;
  filtersContainer.appendChild(filterButton);
}
