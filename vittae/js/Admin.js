// 1. Mapeando os elementos da tela
// ATENÇÃO: Verifique se o seu botão "Cadastrar Médico" no menu tem esse ID ou ajuste o seletor
const btnMenuCadastrar = document.getElementById('menuCadastrarMedico'); 
const modalMedico = document.getElementById('modalCadastroMedico');
const btnFecharModal = document.getElementById('btnFecharModal');

// 2. Evento para abrir o modal
btnMenuCadastrar.addEventListener('click', function(event) {
    event.preventDefault(); // Evita que o link recarregue a página
    modalMedico.style.display = 'flex'; // ou 'block', dependendo do seu CSS
});

// 3. Evento para fechar o modal no "X"
btnFecharModal.addEventListener('click', function() {
    modalMedico.style.display = 'none';
});

// 4. Fechar o modal ao clicar fora da caixa branca
window.addEventListener('click', function(event) {
    if (event.target === modalMedico) {
        modalMedico.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    
    // Agora o JS busca os dois botões pelo ID com 100% de certeza
    const btnMenuInicio = document.getElementById('menuInicio'); 
    const btnMenuCadastrar = document.getElementById('menuCadastrarMedico');
    
    // Agora o JS vai encontrar as duas caixas no HTML
    const paginaInicio = document.getElementById('pagina-inicio');
    const paginaCadastrar = document.getElementById('pagina-cadastrar-medico');

    // Ação ao clicar em "Início"
    if (btnMenuInicio) {
        btnMenuInicio.addEventListener('click', (event) => {
            event.preventDefault(); 
            paginaInicio.style.display = 'block';
            paginaCadastrar.style.display = 'none';
            btnMenuInicio.classList.add('active');
            btnMenuCadastrar.classList.remove('active');
        });
    }

    // Ação ao clicar em "Cadastrar Médico"
    if (btnMenuCadastrar) {
        btnMenuCadastrar.addEventListener('click', (event) => {
            event.preventDefault(); 
            paginaInicio.style.display = 'none';
            paginaCadastrar.style.display = 'block';
            btnMenuCadastrar.classList.add('active');
            btnMenuInicio.classList.remove('active');
        });
    }

    // ... (o resto do código do formulário que te passei antes continua igual) ...
});
//
document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.getElementById('formCadastroCompleto');
    const selectEspecialidades = document.getElementById('especialidadesMedico');
    const btnCancelar = document.getElementById('btnCancelarCadastro');

    // Lógica para limitar a seleção de até 3 especialidades
    selectEspecialidades.addEventListener('change', function() {
        let selecionados = 0;
        for (let i = 0; i < this.options.length; i++) {
            if (this.options[i].selected) selecionados++;
        }

        // Se passou de 3, desmarca o último selecionado e avisa
        if (selecionados > 3) {
            alert('Você pode selecionar no máximo 3 especialidades.');
            // Encontra a opção que acabou de ser clicada e desmarca
            const opcoesSelecionadas = Array.from(this.selectedOptions);
            opcoesSelecionadas[opcoesSelecionadas.length - 1].selected = false;
        }
    });

    // Lógica de Validação ao clicar em Salvar
    formCadastro.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão para podermos validar
        
        let formularioValido = true;
        
        // Pega todos os inputs e selects que têm o atributo 'required'
        const camposObrigatorios = formCadastro.querySelectorAll('[required]');

        camposObrigatorios.forEach(campo => {
            const spanErro = campo.nextElementSibling; // O span de erro fica logo abaixo do input
            
            // Tratamento especial para o select multiple
            if (campo.multiple) {
                if (campo.selectedOptions.length === 0) {
                    marcarErro(campo, document.getElementById('erro-especialidade'));
                    formularioValido = false;
                } else {
                    removerErro(campo, document.getElementById('erro-especialidade'));
                }
            } 
            // Validação padrão (vazio ou inválido)
            else if (!campo.checkValidity() || campo.value.trim() === '') {
                marcarErro(campo, spanErro);
                formularioValido = false;
            } else {
                removerErro(campo, spanErro);
            }
        });

        if (formularioValido) {
            alert('Formulário válido! Pronto para enviar os dados para o Java.');
            // Aqui futuramente entrará o código do 'fetch' para enviar pro Backend
            formCadastro.reset();
        }
    });

    // Funções auxiliares para pintar de vermelho ou limpar
    function marcarErro(campo, spanMsg) {
        campo.classList.add('input-invalido');
        if (spanMsg && spanMsg.classList.contains('erro-msg')) {
            spanMsg.style.display = 'block';
        }
    }

    function removerErro(campo, spanMsg) {
        campo.classList.remove('input-invalido');
        if (spanMsg && spanMsg.classList.contains('erro-msg')) {
            spanMsg.style.display = 'none';
        }
    }

    // Botão cancelar apenas limpa o form
    btnCancelar.addEventListener('click', () => {
        formCadastro.reset();
        const campos = formCadastro.querySelectorAll('.input-invalido');
        campos.forEach(c => removerErro(c, c.nextElementSibling));
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. LÓGICA DE NAVEGAÇÃO DO MENU ---
    
    // Pega os botões do menu lateral
    // Obs: Se o seu botão de Início tiver um ID diferente, ajuste aqui!
    const btnMenuInicio = document.querySelector('[data-target="inicio"]'); 
    const btnMenuCadastrar = document.getElementById('menuCadastrarMedico');
    
    // Pega as "Páginas" (divs) que vamos mostrar/esconder
    const paginaInicio = document.getElementById('pagina-inicio');
    const paginaCadastrar = document.getElementById('pagina-cadastrar-medico');

    // Ação ao clicar em "Início"
    if (btnMenuInicio) {
        btnMenuInicio.addEventListener('click', (event) => {
            event.preventDefault(); // Evita que a página recarregue
            
            // Mostra o Início, esconde o Cadastro
            paginaInicio.style.display = 'block';
            paginaCadastrar.style.display = 'none';
            
            // Muda a classe active para dar destaque no menu
            btnMenuInicio.classList.add('active');
            btnMenuCadastrar.classList.remove('active');
        });
    }

    // Ação ao clicar em "Cadastrar Médico"
    if (btnMenuCadastrar) {
        btnMenuCadastrar.addEventListener('click', (event) => {
            event.preventDefault(); // Evita que a página recarregue
            
            // Esconde o Início, mostra o Cadastro
            paginaInicio.style.display = 'none';
            paginaCadastrar.style.display = 'block';
            
            // Muda a classe active para dar destaque no menu
            btnMenuCadastrar.classList.add('active');
            btnMenuInicio.classList.remove('active');
        });
    }

    // --- 2. O RESTANTE DO CÓDIGO DO FORMULÁRIO CONTINUA AQUI PARA BAIXO ---
    // (Aquele código de validar limite de 3 especialidades, botões de salvar, etc, que passei na mensagem anterior)
});

