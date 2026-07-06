import { logout, isLogged } from "../api/auth.js";
import { loadCategories } from "../api/category.js";
import { deleteProject, addProject } from "../api/project.js";

const worksResponse = await fetch("http://localhost:5678/api/works");
let works = await worksResponse.json();
const categoriesResponse = await fetch("http://localhost:5678/api/categories");
const categories = await categoriesResponse.json();

// =====================
// DOM - Galerie
// =====================
const galleryContainer = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filters");

// =====================
// DOM - Authentification
// =====================
const editBanner = document.querySelector(".edit-banner");
const editBtn = document.querySelector(".edit-btn");
const logoutBtn = document.querySelector("#logout");
const loginBtn = document.querySelector("#login");
const modal = document.querySelector(".modal");

// =====================
// DOM - Galerie de la modale
// =====================
const modalGallery = document.querySelector(".modal-gallery");
const galleryView = document.querySelector(".modal-gallery-view");
const addView = document.querySelector(".modal-add-view");
const addPhotoBtn = document.querySelector("#add-photo-button");
const backBtn = document.querySelector(".modal-back");
const closeBtns = document.querySelectorAll(".modal-close");

// =====================
// DOM - Upload
// =====================
const uploadBtn = document.querySelector("#file-upload-button");
const imageInput = document.querySelector("#image-input");
const preview = document.querySelector("#preview-image");
const defaultIcon = document.querySelector("#default-icon");
const uploadText = document.querySelector("#upload-text");

// =====================
// DOM - Formulaire
// =====================
const modalForm = document.querySelector(".modal-form");
const titleInput = document.querySelector("#title");
const categorySelect = document.querySelector("#category-select");
const submitBtn = document.querySelector("#modal-form-submit-button");
const formError = document.querySelector("#form-error");

// =====================
// GALERIE PRINCIPALE
// =====================

// Affiche les projets reçus dans la galerie de la page d'accueil
function displayProjects(projects) {
  // Supprime les projets actuellement affichés
  galleryContainer.innerHTML = "";
  // Crée et ajoute un élément HTML pour chaque projet
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

// =====================
// FILTRES
// =====================

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

  // Filtre les projets selon la catégorie sélectionnée
  filterButton.addEventListener("click", function () {
    const allButtons = document.querySelectorAll(".filters button");
    // Désactive l'état actif de tous les boutons de filtre
    for (const button of allButtons) {
      button.classList.remove("filter-button-active");
    }
    // Active visuellement le filtre sélectionné
    filterButton.classList.add("filter-button-active");
    // Conserve uniquement les projets appartenant à la catégorie choisie
    const filteredWorks = works.filter(function (project) {
      return project.categoryId === category.id;
    });
    // Met à jour la galerie avec les projets filtrés
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

// =====================
// AUTHENTIFICATION
// =====================

// Affiche le bon bouton selon l'état de connexion de l'utilisateur
function initLogoutButton() {
  // Si l'utilisateur est connecté, affiche "logout" et masque "login"
  if (isLogged()) {
    logoutBtn.classList.add("show");
    loginBtn.classList.remove("show");
  } else {
    // Sinon, affiche "login" et masque "logout"
    loginBtn.classList.add("show");
    logoutBtn.classList.remove("show");
  }
}

initLogoutButton();

//Affiche la bannière et le bouton modifier seulement si l'utilisateur est connecté
if (isLogged()) {
  editBanner.style.display = "flex";
  editBtn.style.display = "inline-flex";
}

//Déconnecte lors du clic sur logout
logoutBtn.addEventListener("click", function () {
  logout(); // supprime le token
  window.location.href = "login.html"; // redirection
});

// =====================
// MODALE
// =====================

// Affiche un projet dans la galerie de la modale
function displayModalProject(work) {
  const modalProject = document.createElement("div");
  modalProject.classList.add("modal-project");

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  // Ajoute une icône permettant de supprimer le projet
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash-can");
  deleteIcon.dataset.id = work.id;

  // Supprime le projet de la base de données et met à jour les galeries
  deleteIcon.addEventListener("click", async function () {
    const id = deleteIcon.dataset.id;
    const success = await deleteProject(id);
    if (success) {
      // Retire le projet du tableau des projets
      works = works.filter(function (work) {
        return work.id !== Number(id);
      });
      // Met à jour la galerie de la page d'accueil
      displayProjects(works);
      // Supprime le projet de la galerie de la modale
      modalProject.remove();
    }
  });
  modalProject.appendChild(img);
  modalProject.appendChild(deleteIcon);
  modalGallery.appendChild(modalProject);
}

// Affiche tous les projets dans la galerie de la modale au chargement de la page
for (const work of works) {
  displayModalProject(work);
}

// Ferme la modale lorsqu'on clique sur la croix de fermeture
closeBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    modal.style.display = "none";
  });
});

// Ferme la modale lorsqu'on clique en dehors de son contenu
modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// =====================
// CHANGEMENT DE VUE DE LA MODALE
// =====================

// Affiche le formulaire d'ajout de projet
addPhotoBtn.addEventListener("click", function () {
  galleryView.style.display = "none";
  addView.style.display = "block";
});

// Revient à la galerie des projets
backBtn.addEventListener("click", function () {
  addView.style.display = "none";
  galleryView.style.display = "block";
});

editBtn.addEventListener("click", function () {
  // Affiche la modale
  modal.style.display = "flex";
  // Affiche la vue Galerie et masque le formulaire d'ajout
  galleryView.style.display = "block";
  addView.style.display = "none";
  // Recharge la liste des catégories
  loadCategories();
  // Réinitialise le formulaire d'ajout
  resetForm();
});

// =====================
// UPLOAD D'IMAGE
// =====================

// Ouvre l'explorateur de fichiers au clic sur le bouton "Ajouter photo"
uploadBtn.addEventListener("click", function () {
  imageInput.click();
});

// Affiche une prévisualisation de l'image sélectionnée
imageInput.addEventListener("change", function () {
  const file = imageInput.files[0];
  // Arrête la fonction si aucun fichier n'a été sélectionné
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    // Affiche l'image sélectionnée dans la zone de prévisualisation
    preview.src = event.target.result;
    preview.style.display = "block";
    // Masque les éléments de la zone d'upload
    defaultIcon.style.display = "none";
    uploadBtn.style.display = "none";
    uploadText.style.display = "none";
    // Met à jour l'apparence du bouton Valider
    updateSubmitButton();
  };
  // Convertit le fichier sélectionné en URL lisible par le navigateur
  reader.readAsDataURL(file);
});

// =====================
// VALIDATION DU FORMULAIRE
// =====================

// Vérifie que tous les champs obligatoires du formulaire sont renseignés
function isFormValid() {
  const title = titleInput.value.trim();
  const category = categorySelect.value;
  const image = imageInput.files[0];
  return image && title !== "" && category !== "";
}

// Modifie la couleur du bouton "Valider" selon l'état du formulaire
function updateSubmitButton() {
  if (isFormValid()) {
    submitBtn.style.backgroundColor = "#1D6154";
  } else {
    submitBtn.style.backgroundColor = "#A7A7A7";
  }
}

// Vérifie le formulaire à chaque modification du titre
titleInput.addEventListener("input", function () {
  updateSubmitButton();
});

// Vérifie le formulaire à chaque changement de catégorie
categorySelect.addEventListener("change", function () {
  updateSubmitButton();
});

// Initialise l'apparence du bouton au chargement de la page
updateSubmitButton();

// =====================
// AJOUT D'UN PROJET
// =====================

// Ajoute un nouveau projet lorsque le formulaire est validé
modalForm.addEventListener("submit", async function (event) {
  // Empêche le rechargement de la page
  event.preventDefault();
  // Vérifie que tous les champs obligatoires sont remplis
  if (!isFormValid()) {
    formError.textContent =
      "Veuillez sélectionner une image, saisir un titre et choisir une catégorie.";
    return;
  }
  // Efface le message d'erreur
  formError.textContent = "";
  // Prépare les données à envoyer à l'API
  const formData = new FormData();
  formData.append("image", imageInput.files[0]);
  formData.append("title", titleInput.value.trim());
  formData.append("category", categorySelect.value);
  // Envoie le nouveau projet à l'API
  const newProject = await addProject(formData);
  // Ajoute le projet au tableau local
  works.push(newProject);
  // Met à jour la galerie de la page d'accueil
  displayProjects(works);
  // Ajoute le projet dans la galerie de la modale
  displayModalProject(newProject);
  // Réinitialise le formulaire
  resetForm();
  // Revient à la vue Galerie de la modale
  addView.style.display = "none";
  galleryView.style.display = "block";
});

// =====================
// RÉINITIALISATION DU FORMULAIRE
// =====================

// Remet le formulaire dans son état initial
function resetForm() {
  modalForm.reset();
  imageInput.value = "";
  preview.style.display = "none";
  defaultIcon.style.display = "block";
  uploadBtn.style.display = "block";
  uploadText.style.display = "block";
  formError.textContent = "";
  categorySelect.selectedIndex = 0;
  updateSubmitButton();
}
