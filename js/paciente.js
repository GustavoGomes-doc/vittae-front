// Aguarda o HTML carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    // 1. Lógica para trocar de abas
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            const target = this.getAttribute('data-target');

            // Remove 'active' de tudo
            navItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Ativa o item e a seção correta
            this.classList.add('active');
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Se clicar em agendar, recarrega a lista para garantir dados novos
            if (target === 'agendar') {
                carregarMedicos();
            }
        });
    });

    // 2. Carregamento inicial (executa assim que a página abre)
    carregarMedicos();
});

// 3. Função para buscar médicos no Back-end
async function carregarMedicos() {
    const container = document.getElementById('lista-medicos');
    if (!container) return; // Segurança caso a div não exista

    try {
        const response = await fetch('http://localhost:8080/api/medicos');
        const medicos = await response.json();

        console.log("Médicos recebidos do Java:", medicos);

        container.innerHTML = ''; // Limpa o que tinha antes

        medicos.forEach(medico => {
            // Garante que o nome e a especialidade tenham um texto padrão
            const nomeMedico = medico.nome || "Médico Indisponível";
            const especialidade = (medico.especialidades && medico.especialidades.length > 0) 
                                  ? medico.especialidades[0].nome 
                                  : "Clínico Geral";
        
            const cardHTML = `
                <div class="doctor-card" style="border: 2px solid purple;"> <img src="https://i.pravatar.cc/150?u=${medico.id}" alt="Médico">
                    <h3>${nomeMedico}</h3>
                    <p>${especialidade}</p> 
                    <div class="rating"><i class="fas fa-star"></i> 5.0</div>
                    <button class="btn-main">Agendar</button>
                </div>
            `;
            container.innerHTML += cardHTML;
        });

    } catch (erro) {
        console.error("Erro ao carregar médicos:", erro);
    }
}

function abrirAgendamento(medico) {
    alert(`Abrindo calendário para agendar com: Dr(a). ${medico}`);
}

