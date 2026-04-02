/**
 * Vittae Dashboard Engine
 * Gerencia a navegação entre abas de forma robusta
 */

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    // Função de Troca de Aba
    const switchTab = (targetId) => {
        // Encontra a seção alvo
        const targetSection = document.getElementById(targetId);

        if (!targetSection) {
            console.error(`Erro: Seção com ID "${targetId}" não encontrada.`);
            return;
        }

        // Esconde todas as seções
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Mostra a seção clicada
        targetSection.classList.add('active');
    };

    // Adiciona evento em todos os itens da sidebar
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // Pega o ID do alvo através do atributo data-target
            const targetId = this.getAttribute('data-target');

            // Atualiza visual da Sidebar
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Executa a troca
            switchTab(targetId);

            // Scroll para o topo suave ao trocar
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Feedback visual nos botões de atendimento
    document.querySelectorAll('.btn-main-small, .btn-main').forEach(btn => {
        btn.addEventListener('click', function () {
            const originalText = this.innerText;
            if (originalText === "Atender") {
                this.innerText = "Iniciando...";
                this.style.opacity = "0.7";
                setTimeout(() => {
                    alert("Abrindo Prontuário Eletrônico...");
                    this.innerText = originalText;
                    this.style.opacity = "1";
                }, 800);
            }
        });
    });
});