const worksResponse = await fetch("http://localhost:5678/api/works");
const works = await worksResponse.json();
const categoriesResponse = await fetch("http://localhost:5678/api/categories");
const categories = await categoriesResponse.json();

const galleryContainer = document.querySelector(".gallery");

// Fonction qui affiche une liste de projets dans la galerie
function displayProjects(projects) {
  // Vide la galerie avant d’ajouter les nouveaux projets
  galleryContainer.innerHTML = "";
  // Parcourt chaque projet à afficher
  for (const project of projects) {
    // Crée la structure HTML d’un projet
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = project.title;
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = project.title;
    // Ajoute l’image et le titre dans la figure
    figure.appendChild(img);
    figure.appendChild(figcaption);
    // Ajoute le projet complet dans la galerie
    galleryContainer.appendChild(figure);
  }
}

// Affiche tous les projets au chargement de la page
displayProjects(works);

const filtersContainer = document.querySelector(".filters");

// Création du bouton de filtre "Tous", non présent dans les données de l’API
const allFilterButton = document.createElement("button");
allFilterButton.type = "button";
allFilterButton.textContent = "Tous";
allFilterButton.classList.add("filter-button-active");
filtersContainer.appendChild(allFilterButton);

// Parcourt les catégories récupérées depuis l’API et crée dynamiquement les boutons de filtre
for (const category of categories) {
  const filterButton = document.createElement("button");
  filterButton.type = "button";
  filterButton.textContent = category.name;
  filtersContainer.appendChild(filterButton);

  /// Au clic sur un bouton de catégorie
  filterButton.addEventListener("click", function () {
    // Retire l’état actif de tous les boutons
    const allButtons = document.querySelectorAll(".filters button");
    for (const button of allButtons) {
      button.classList.remove("filter-button-active");
    }
    // Active visuellement le bouton cliqué
    filterButton.classList.add("filter-button-active");
    // Garde uniquement les projets de la catégorie sélectionnée
    const filteredWorks = works.filter(function (project) {
      return project.categoryId === category.id;
    });
    // Affiche les projets filtrés dans la galerie
    displayProjects(filteredWorks);
  });
}

// Au clic sur "Tous", réaffiche tous les projets
allFilterButton.addEventListener("click", function () {
  const allButtons = document.querySelectorAll(".filters button");
  for (const button of allButtons) {
    button.classList.remove("filter-button-active");
  }
  allFilterButton.classList.add("filter-button-active");
  displayProjects(works);
});
