// ==========================================
// 1. Efeitos Visuais e Transições
// ==========================================
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

// ==========================================
// 2. Máscara de CPF Corrigida
// ==========================================
// Aplica a máscara em todos os inputs que tenham "CPF" no placeholder
const cpfInputs = document.querySelectorAll('input[placeholder*="CPF"]');
cpfInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
        
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        }
        e.target.value = value;
    });
});

// ==========================================
// 3. Integração com a API (Spring Boot)
// ==========================================
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const btnLogar = document.getElementById('btnLogar');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o reload da página

    // Pega os valores e limpa a formatação do CPF (manda só os números para o banco)
    const cpfSujo = document.getElementById('loginCpf').value;
    const cpfLimpo = cpfSujo.replace(/\D/g, ""); 
    const senha = document.getElementById('loginSenha').value;

    // Monta o objeto que o Java espera receber
    const credenciais = {
        cpf: cpfLimpo,
        senha: senha
    };

    try {
        // Feedback de carregamento na tela
        btnLogar.innerText = "Autenticando...";
        btnLogar.disabled = true;
        loginError.style.display = "none";

        // Faz o POST para o seu back-end (Verifique se essa é a URL correta no Java)
        const resposta = await fetch('http://localhost:8081/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credenciais)
        });

        if (resposta.ok) {
            const dados = await resposta.json();
            
            // Salva o token de segurança no navegador
            localStorage.setItem('vittae_token', dados.token);

            // Redireciona para a tela de agendamento principal
            window.location.href = "consulta.html";
            
        } else {
            // Se o Java retornar erro (Ex: 401 Unauthorized)
            loginError.innerText = "CPF ou senha incorretos.";
            loginError.style.display = "block";
        }

    } catch (erro) {
        console.error("Erro de conexão:", erro);
        loginError.innerText = "Erro ao conectar com o servidor. Verifique se o Spring Boot está rodando.";
        loginError.style.display = "block";
    } finally {
        // Volta o botão ao normal se der erro
        btnLogar.innerText = "Entrar";
        btnLogar.disabled = false;
    }
});