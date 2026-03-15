let card = document.querySelector(".card");
let loginButton = document.querySelector(".loginButton");
let cadastroButton = document.querySelector(".cadastroButton");

loginButton.onclick = () => {
    card.classList.remove("cadastroActive");
    card.classList.add("LoginActive");
}

cadastroButton.onclick = () => {
    card.classList.remove("LoginActive");
    card.classList.add("cadastroActive");
}

