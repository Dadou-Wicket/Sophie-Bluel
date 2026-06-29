import { logout, isLogged } from "../api/auth.js";
import { deleteItem } from "../api/project.js";

const worksResponse = await fetch("http://localhost:5678/api/works");
let works = await worksResponse.json();
const categoriesResponse = await fetch("http://localhost:5678/api/categories");
const categories = await categoriesResponse.json();

const galleryContainer = document.querySelector(".gallery");

// Fonction qui affiche une liste de projets dans la galerie
function displayProjects(projects) {
  // Vide la galerie avant d’ajouter les nouveaux projets
  galleryContainer.innerHTML = "";
  // Parcourt chaque projet à afficher
  for (const project of projects) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = project.imageUrl;
    img.alt = project.title;
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = project.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
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

  filterButton.addEventListener("click", function () {
    const allButtons = document.querySelectorAll(".filters button");
    for (const button of allButtons) {
      // Retire l’état actif de tous les boutons
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

// ===== LOGIN / LOGOUT =====
function initLogoutButton() {
  const logoutBtn = document.querySelector("#logout");
  const loginBtn = document.querySelector("#login");

  if (!logoutBtn || !loginBtn) return;

  if (isLogged()) {
    logoutBtn.classList.add("show");
    loginBtn.classList.remove("show");
  } else {
    loginBtn.classList.add("show");
    logoutBtn.classList.remove("show");
  }
}

initLogoutButton();

// ===== EDIT MODE =====

//Affiche la bannière et le bouton modifier seulement si l'utilisateur est connecté
const editBanner = document.querySelector(".edit-banner");
const editBtn = document.querySelector(".edit-btn");
const modal = document.querySelector(".modal");

if (isLogged()) {
  if (editBanner) editBanner.style.display = "flex";
  if (editBtn) editBtn.style.display = "inline-flex";
}

// ouverture modal
if (editBtn && modal) {
  editBtn.addEventListener("click", function () {
    modal.style.display = "flex";
  });
}

//Déconnecte lors du clic sur logout
const logoutBtn = document.querySelector("#logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    logout(); // supprime le token
    window.location.href = "login.html"; // redirection
  });
}

//Inclusion des projets dans la modal
const modalGallery = document.querySelector(".modal-gallery");

if (modalGallery) {
  for (const work of works) {
    const modalItem = document.createElement("div");
    modalItem.classList.add("modal-item");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    //Création icone de suppression
    const deleteIcone = document.createElement("i");
    deleteIcone.classList.add("fa-solid", "fa-trash-can");
    deleteIcone.dataset.id = work.id;

    //Suppression de l'item séléctionné dans la modal
    deleteIcone.addEventListener("click", async function () {
      const id = deleteIcone.dataset.id;
      const success = await deleteItem(id);
      if (success) {
        // Met à jour le tableau en retirant le projet supprimé
        works = works.filter(function (work) {
          return work.id !== Number(id);
        });
        // Met à jour l'affichage de la galerie principale
        displayProjects(works);
        // Supprime l'élément dans la modal
        modalItem.remove();
      }
    });
    modalItem.appendChild(img);
    modalItem.appendChild(deleteIcone);
    modalGallery.appendChild(modalItem);
  }
}

//Fermeture de la modal en cliquant sur la croix
const closeBtn = document.querySelector(".modal-close");
closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});
