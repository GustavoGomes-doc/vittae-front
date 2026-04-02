document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 1. Remove classes ativas do menu
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // 2. Troca a seção visível
            const target = this.getAttribute('data-target');
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === target) {
                    section.classList.add('active');
                }
            });
        });
    });
});

function abrirAgendamento(medico) {
    alert(`Abrindo calendário para agendar com: Dr(a). ${medico}`);
    // Aqui você pode abrir um Modal de data e hora
}