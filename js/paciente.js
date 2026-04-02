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

            // 3. SE CLICAR NA ABA DE AGENDAR, CARREGA OS MÉDICOS DO BANCO
            if (target === 'agendar') {
                carregarMedicos();
            }
        });
    });
});

// FUNÇÃO QUE BUSCA OS MÉDICOS NO SEU JAVA
async function carregarMedicos() {
    try {
        // Bate na porta 8081 do seu Spring Boot
        const resposta = await fetch('http://localhost:8081/api/medicos');
        const medicos = await resposta.json();
        
        // Pega a div do seu HTML que tem os cards dos médicos
        const grid = document.querySelector('.doctors-grid');
        grid.innerHTML = ''; // Limpa os médicos ilustrativos (Carlos e Ana)

        if (medicos.length === 0) {
            grid.innerHTML = '<p>Nenhum médico cadastrado no sistema ainda.</p>';
            return;
        }

        // Para cada médico do banco, cria um card com o SEU HTML E CSS
        medicos.forEach(medico => {
            // Dica: Usei uma API gratuita de avatares para gerar imagens com as iniciais do médico!
            const card = `
                <div class="doctor-card">
                    <img src="https://ui-avatars.com/api/?name=${medico.nome}&background=random&color=fff" alt="Médico">
                    <h3>Dr(a). ${medico.nome}</h3>
                    <p>${medico.especialidade}</p>
                    <div class="rating"><i class="fas fa-star"></i> 5.0</div>
                    <button class="btn-main" onclick="abrirAgendamento('${medico.nome}')">Agendar</button>
                </div>
            `;
            grid.innerHTML += card;
        });

    } catch (erro) {
        console.error("Erro ao buscar os médicos. O servidor Java está ligado?", erro);
    }
}

function abrirAgendamento(medico) {
    alert(`Abrindo calendário para agendar com: Dr(a). ${medico}`);
    // No futuro, ao invés de um alert, isso vai abrir a sua tela de etapas!
}