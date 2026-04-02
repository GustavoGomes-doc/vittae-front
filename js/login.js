// 1. Seleção dos elementos de transição (Sliding)
const container = document.getElementById('mainContainer');
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');

// Troca para o modo Cadastro
signUpBtn.addEventListener('click', () => {
    container.classList.add("register-active");
});

// Troca para o modo Login
signInBtn.addEventListener('click', () => {
    container.classList.remove("register-active");
});

// 2. Lógica de Redirecionamento de Login
// Vamos selecionar o formulário de login (o primeiro do HTML)
const loginForm = document.querySelector('.sign-in-form form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede a página de recarregar

    // Pega o valor selecionado no "Entrar como..."
    const userType = document.getElementById('userType').value;

    if (userType === "paciente") {
        window.location.href = "paciente.html"; // Redireciona para o painel do paciente
    } else if (userType === "medico") {
        window.location.href = "medico.html"; // Redireciona para o painel do médico
    } else {
        alert("Por favor, selecione se você é Médico ou Paciente antes de entrar.");
    }
});

// 3. (Opcional) Máscara simples para o CPF
const cpfInput = document.querySelector('input[placeholder*="CPF"]');
cpfInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
    if (value.length <= 11) {
        value = value.replace(/(\={3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    e.target.value = value;
});