# Sophie Bluel

Projet réalisé dans le cadre de ma formation de développeur web.

## Description

Développement du portfolio de l'architecte Sophie Bluel afin de transformer
un site statique en application web dynamique communiquant avec une API REST.

## Technologies

- HTML5
- CSS3
- JavaScript
- API REST
- JWT
- FormData

## Fonctionnalités

- Affichage dynamique des projets depuis l'API
- Filtrage des projets par catégories
- Authentification administrateur avec token JWT
- Interface d'administration
- Ajout de nouveaux projets
- Suppression de projets
- Prévisualisation des images avant leur envoi
- Gestion des formulaires
- Améliorations de l'accessibilité

## Organisation du code

Le projet a été structuré en plusieurs fichiers JavaScript afin de séparer
les différentes responsabilités.

- `homepage.js` : gestion de l'interface, des projets, des filtres et de la modale
- `project.js` : communication avec l'API pour récupérer, ajouter et supprimer les projets
- `category.js` : récupération et gestion des catégories
- `auth.js` : gestion de l'authentification et du token JWT
- `login.js` : gestion du formulaire de connexion

## API

Les projets sont récupérés depuis l'API à l'aide de requêtes HTTP `fetch`.

Les données reçues au format JSON sont ensuite utilisées pour générer
dynamiquement la galerie des projets.

L'ajout d'un projet utilise `FormData` afin de transmettre à l'API
l'image, le titre et la catégorie.

## Accessibilité

Plusieurs améliorations ont été apportées afin de rendre l'interface
plus accessible :

- Utilisation d'attributs `aria-label`
- Ajout de textes alternatifs sur les images
- Utilisation de `aria-live` pour certains messages
- Limitation des fichiers sélectionnables aux images avec `accept="image/*"`

## Compétences développées

Ce projet m'a permis d'approfondir :

- JavaScript
- Manipulation dynamique du DOM
- Communication avec une API REST
- Authentification avec JWT
- Gestion de formulaires avec FormData
- Organisation et séparation des responsabilités
- Accessibilité web

## Auteur

David Maron
