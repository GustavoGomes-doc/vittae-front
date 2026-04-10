document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    const switchTab = (targetId) => {
        const targetSection = document.getElementById(targetId);

        if (!targetSection) {
            console.error(`Erro: Seção com ID "${targetId}" não encontrada.`);
            return;
        }

        sections.forEach(section => {
            section.classList.remove('active');
        });

        targetSection.classList.add('active');
    };
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('data-target');

            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            switchTab(targetId);

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

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