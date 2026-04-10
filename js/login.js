
const container = document.getElementById('mainContainer');
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');


signUpBtn.addEventListener('click', () => {
    container.classList.add("register-active");
});

signInBtn.addEventListener('click', () => {
    container.classList.remove("register-active");
});

const formatCPF = (value) => {
    // 1. Remove tudo que não é número e limita a 11 dígitos
    let num = value.replace(/\D/g, '').slice(0, 11);
    
    // 2. Aplica a máscara passo a passo para não ter erro
    if (num.length > 9) {
        num = num.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (num.length > 6) {
        num = num.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (num.length > 3) {
        num = num.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }
    
    return num;
};

// Aplicação (mantendo o seu seletor)
document.querySelectorAll('input[placeholder*="CPF"]').forEach(input => {
    input.addEventListener('input', ({ target }) => {
        target.value = formatCPF(target.value);
    });
});

const telInput = document.getElementById('telefone');

telInput.addEventListener('input', (e) => {
    let value = e.target.value;
    
    // Remove tudo o que não for número
    value = value.replace(/\D/g, "");
    
    // Aplica a formatação (Máscara)
    if (value.length > 0) {
        value = "(" + value;
    }
    if (value.length > 3) {
        value = value.slice(0, 3) + ") " + value.slice(3);
    }
    if (value.length > 10) {
        value = value.slice(0, 10) + "-" + value.slice(10);
    }
    
    // Limita o máximo de caracteres para (99) 99999-9999 (15 caracteres)
    e.target.value = value.slice(0, 15);
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