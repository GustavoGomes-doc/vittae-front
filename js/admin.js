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