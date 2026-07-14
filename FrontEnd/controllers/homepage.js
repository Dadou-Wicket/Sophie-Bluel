import { logout, isLogged } from "../api/auth.js";
import { loadCategories } from "../api/category.js";
import { deleteProject, addProject, fetchProjects } from "../api/project.js";

let works = await fetchProjects();
const categories = await loadCategories();

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
      return Number(project.categoryId) === category.id;
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
  filtersContainer.remove();
}

//Déconnecte lors du clic sur logout
logoutBtn.addEventListener("click", function () {
  logout(); // supprime le token
  window.location.href = "login.html"; // redirection
});

// =====================
// MODALE
// =====================

// Ouverture de la modale
editBtn.addEventListener("click", function () {
  modal.style.display = "flex";
  galleryView.style.display = "block";
  addView.style.display = "none";
  // Recharge la liste des catégories
  initCategories();
  // Réinitialise le formulaire d'ajout
  resetForm();
});

// Crée un projet dans la galerie de la modale
function displayModalProject(work) {
  const modalProject = document.createElement("div");
  modalProject.classList.add("modal-project");
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;
  // Crée l'icône permettant de supprimer ce projet
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash-can");
  deleteIcon.dataset.id = work.id;
  // Supprime le projet lorsqu'on clique sur l'icône
  deleteIcon.addEventListener("click", async function () {
    // Récupère l'identifiant du projet à supprimer
    const id = deleteIcon.dataset.id;
    // Envoie une requête DELETE à l'API
    const success = await deleteProject(id);
    // Met à jour l'interface uniquement si la suppression a réussi
    if (success) {
      // Retire le projet du tableau des projets chargés
      works = works.filter(function (work) {
        return work.id !== Number(id);
      });
      // Reconstruit la galerie de la page d'accueil
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

function initCategories() {
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
  // Convertit le fichier sélectionné en URL temporaire lisible par le navigateur
  reader.readAsDataURL(file);
});

// =====================
// VALIDATION DU FORMULAIRE
// =====================

// Vérifie que tous les champs obligatoires du formulaire sont renseignés
function isFormValid() {
  const image = imageInput.files[0];
  const title = titleInput.value.trim();
  const category = categorySelect.value;
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

// Met à jour le bouton lorsque le titre est modifié
titleInput.addEventListener("input", function () {
  updateSubmitButton();
});

// Met à jour le bouton lorsqu'une catégorie est sélectionnée
categorySelect.addEventListener("change", function () {
  updateSubmitButton();
});

// Initialise l'état du bouton au chargement de la page
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
  // Crée un objet FormData contenant les données du formulaire
  const formData = new FormData();
  formData.append("image", imageInput.files[0]);
  formData.append("title", titleInput.value.trim());
  formData.append("category", categorySelect.value);
  // Envoie les données du formulaire à l'API afin de créer un nouveau projet
  const newProject = await addProject(formData);
  // Ajoute le projet créé au tableau des projets déjà chargés
  works.push(newProject);
  // Reconstruit la galerie de la page d'accueil avec le nouveau projet
  displayProjects(works);
  // Ajoute le nouveau projet dans la galerie de la modale
  displayModalProject(newProject);
  // Réinitialise le formulaire d'ajout
  resetForm();
  // Réaffiche la galerie de la modale
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
