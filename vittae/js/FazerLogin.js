
const container = document.getElementById('mainContainer');
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');


signUpBtn.addEventListener('click', () => {
    container.classList.add("register-active");
});

signInBtn.addEventListener('click', () => {
    container.classList.remove("register-active");
});

const cpfInputs = document.querySelectorAll('input[placeholder*="CPF"]');
cpfInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ""); 
        
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        }
        e.target.value = value;
    });
});


const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const btnLogar = document.getElementById('btnLogar');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const cpfSujo = document.getElementById('loginCpf').value;
    const cpfLimpo = cpfSujo.replace(/\D/g, ""); 
    const senha = document.getElementById('loginSenha').value;

  
    const credenciais = {
        cpf: cpfLimpo,
        senha: senha
    };

    try {

        btnLogar.innerText = "Autenticando...";
        btnLogar.disabled = true;
        loginError.style.display = "none";


        const resposta = await fetch('http://localhost:8081/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credenciais)
        });

        if (resposta.ok) {
            const dados = await resposta.json();
            
            localStorage.setItem('vittae_token', dados.token);

            window.location.href = "vittae.html";
            
        } else {
            loginError.innerText = "CPF ou senha incorretos.";
            loginError.style.display = "block";
        }

    } catch (erro) {
        console.error("Erro de conexão:", erro);
        loginError.innerText = "Erro ao conectar com o servidor. Verifique se o Spring Boot está rodando.";
        loginError.style.display = "block";
    } finally {
        btnLogar.innerText = "Entrar";
        btnLogar.disabled = false;
    }
});