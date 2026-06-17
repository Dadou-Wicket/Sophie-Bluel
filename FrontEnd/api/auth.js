import { BASE_API } from "../utils/const.js";

export async function login(email, password) {
  try {
    const response = await fetch(BASE_API + "/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      let data = await response.json();
      localStorage.setItem("token", data.token);
      return true;
    } else {
      //   alert("Mot de passe ou email introuvable");
      return false;
    }
  } catch (e) {
    return false;
  }
}

export async function logout() {
  localStorage.removeItem("token");
}

export function getUserData() {
  return localStorage.getItem("token");
}

export function isLogged() {
  return localStorage.getItem("token") !== null;
}

const form = document.querySelector("#login-form");

function handleLogin(e) {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  login(email, password).then(function (success) {
    if (success) {
      window.location.href = "index.html";
    } else {
      document.querySelector(".error").textContent =
        "Email ou mot de passe incorrect";
    }
  });
}

if (form) {
  form.addEventListener("submit", handleLogin);
}
