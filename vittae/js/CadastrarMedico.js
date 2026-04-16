document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('formCadastroCompleto');
    const btnCancelar = document.getElementById('btnCancelarCadastro');
    const cpfInput = document.getElementById('cpfMedico');
    const cepInput = document.getElementById('cepMedico');
    const fotoInput = document.getElementById('fotoMedico');
    const fotoCirculo = document.getElementById('fotoCirculo');
    const fotoPreview = document.getElementById('fotoPreview');
    const fotoIcone = document.getElementById('fotoIcone');

    const ESPECIALIDADES = [
        'Cardiologia', 'Dermatologia', 'Pediatria', 'Ortopedia',
        'Ginecologia', 'Oftalmologia', 'Neurologia', 'Psiquiatria',
        'Endocrinologia', 'Urologia', 'Otorrinolaringologia',
        'Gastroenterologia', 'Clínico Geral', 'Oncologia',
        'Reumatologia', 'Infectologia'
    ];

    const DIAS_SEMANA = [
        { id: 'SEGUNDA', label: 'Segunda-feira' },
        { id: 'TERCA', label: 'Terça-feira' },
        { id: 'QUARTA', label: 'Quarta-feira' },
        { id: 'QUINTA', label: 'Quinta-feira' },
        { id: 'SEXTA', label: 'Sexta-feira' },
        { id: 'SABADO', label: 'Sábado' },
    ];

    let especialidadesSelecionadas = [];
    fotoCirculo.addEventListener('click', () => fotoInput.click());

    fotoInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            mostrarToast('Foto maior que 5 MB. Escolha outra.', 'erro');
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            fotoPreview.src = e.target.result;
            fotoPreview.style.display = 'block';
            fotoIcone.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });

    //MASCARA
    cpfInput.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '').slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        this.value = v;
    });

    cepInput.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '').slice(0, 8);
        if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
        this.value = v;
    });

    //CHIPS

    function inicializarChips() {
        const container = document.getElementById('chipsContainer');
        ESPECIALIDADES.forEach(nome => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = nome;
            chip.dataset.nome = nome;
            chip.addEventListener('click', () => toggleChip(chip, nome));
            container.appendChild(chip);
        });
    }

    function toggleChip(chip, nome) {
        if (chip.classList.contains('bloqueado')) return;

        if (chip.classList.contains('ativo')) {
            chip.classList.remove('ativo');
            especialidadesSelecionadas = especialidadesSelecionadas.filter(e => e !== nome);
        } else {
            if (especialidadesSelecionadas.length >= 3) {
                mostrarToast('Máximo de 3 especialidades permitidas.', 'erro');
                return;
            }
            chip.classList.add('ativo');
            especialidadesSelecionadas.push(nome);
        }

        atualizarChips();
        if (especialidadesSelecionadas.length > 0) ocultarErro('especialidade');
    }

    function atualizarChips() {
        const max = especialidadesSelecionadas.length >= 3;
        document.querySelectorAll('.chip').forEach(c => {
            if (!c.classList.contains('ativo')) {
                c.classList.toggle('bloqueado', max);
            }
        });
        document.getElementById('chipsContador').textContent =
            `${especialidadesSelecionadas.length}/3 selecionadas`;
    }

    //disp
    function inicializarDisponibilidade() {
        const container = document.getElementById('dispContainer');

        DIAS_SEMANA.forEach(({ id, label }) => {
            const row = document.createElement('div');
            row.className = 'disp-row';
            row.id = `disp-row-${id}`;
            row.innerHTML = `
                <label class="disp-check">
                    <input type="checkbox" id="disp-chk-${id}" data-dia="${id}">
                    ${label}
                </label>
                <div class="disp-time-wrap">
                    <span class="disp-time-label">Início</span>
                    <input type="time" id="disp-ini-${id}" value="08:00">
                </div>
                <div class="disp-time-wrap">
                    <span class="disp-time-label">Fim</span>
                    <input type="time" id="disp-fim-${id}" value="18:00">
                </div>
            `;
            container.appendChild(row);

            row.querySelector(`#disp-chk-${id}`).addEventListener('change', function () {
                row.classList.toggle('ativa', this.checked);
                if (diasAtivos().length > 0) ocultarErro('disp');
            });
        });
    }

    function diasAtivos() {
        return DIAS_SEMANA.filter(({ id }) => {
            const chk = document.getElementById(`disp-chk-${id}`);
            return chk && chk.checked;
        });
    }

    function getDisponibilidades() {
        return diasAtivos().map(({ id }) => ({
            diaSemana: id,
            horaInicio: document.getElementById(`disp-ini-${id}`).value,
            horaFim: document.getElementById(`disp-fim-${id}`).value,
        }));
    }

   //validacao
    function marcarErro(id, mensagem) {
        const input = document.getElementById(id);
        const span = document.getElementById(`err-${id.replace('Medico', '').replace('medico', '')}`);
        if (input) input.classList.add('input-invalido');
        if (span) { span.textContent = mensagem || span.textContent; span.classList.add('visivel'); }
    }

    // helper direto por sufixo do erro
    function exibirErro(sufixo, msg) {
        const span = document.getElementById(`err-${sufixo}`);
        if (span) { if (msg) span.textContent = msg; span.classList.add('visivel'); }
    }
    function ocultarErro(sufixo) {
        const span = document.getElementById(`err-${sufixo}`);
        if (span) span.classList.remove('visivel');
    }
    function marcarInputErro(inputId, temErro) {
        const el = document.getElementById(inputId);
        if (el) el.classList.toggle('input-invalido', temErro);
    }

    function validarFormulario() {
        let valido = true;

        // Nome
        const nome = document.getElementById('nomeMedico').value.trim();
        marcarInputErro('nomeMedico', !nome);
        if (!nome) { exibirErro('nome'); valido = false; } else ocultarErro('nome');

        // CPF
        const cpf = cpfInput.value.replace(/\D/g, '');
        marcarInputErro('cpfMedico', cpf.length !== 11);
        if (cpf.length !== 11) { exibirErro('cpf'); valido = false; } else ocultarErro('cpf');

        // Data de Nascimento
        const nasc = document.getElementById('dataNascimento').value;
        marcarInputErro('dataNascimento', !nasc);
        if (!nasc) { exibirErro('nasc'); valido = false; } else ocultarErro('nasc');

        // CRM
        const crm = document.getElementById('crmMedico').value.trim();
        marcarInputErro('crmMedico', !crm);
        if (!crm) { exibirErro('crm'); valido = false; } else ocultarErro('crm');

        // UF CRM
        const uf = document.getElementById('ufCrm').value;
        marcarInputErro('ufCrm', !uf);
        if (!uf) { exibirErro('uf'); valido = false; } else ocultarErro('uf');

        // CEP
        const cep = cepInput.value.replace(/\D/g, '');
        marcarInputErro('cepMedico', cep.length !== 8);
        if (cep.length !== 8) { exibirErro('cep'); valido = false; } else ocultarErro('cep');

        // Valor Consulta
        const valor = parseFloat(document.getElementById('valorConsulta').value);
        marcarInputErro('valorConsulta', isNaN(valor) || valor <= 0);
        if (isNaN(valor) || valor <= 0) { exibirErro('valor'); valido = false; } else ocultarErro('valor');

        // Tempo Consulta
        const tempo = parseInt(document.getElementById('tempoConsulta').value);
        marcarInputErro('tempoConsulta', isNaN(tempo) || tempo < 5);
        if (isNaN(tempo) || tempo < 5) { exibirErro('tempo'); valido = false; } else ocultarErro('tempo');

        // Especialidades
        if (especialidadesSelecionadas.length === 0) {
            exibirErro('especialidade'); valido = false;
        } else ocultarErro('especialidade');

        // Disponibilidade
        if (diasAtivos().length === 0) {
            exibirErro('disp'); valido = false;
        } else ocultarErro('disp');

        // E-mail
        const email = document.getElementById('emailMedico').value.trim();
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        marcarInputErro('emailMedico', !emailValido);
        if (!emailValido) { exibirErro('email'); valido = false; } else ocultarErro('email');

        // Senha
        const senha = document.getElementById('senhaMedico').value;
        marcarInputErro('senhaMedico', senha.length < 6);
        if (senha.length < 6) { exibirErro('senha'); valido = false; } else ocultarErro('senha');

        return valido;
    }

//submit

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validarFormulario()) return;

        // Monta payload conforme modelo de objetos
        const payload = {
            nome: document.getElementById('nomeMedico').value.trim(),
            cpf: cpfInput.value.replace(/\D/g, ''),
            dataNascimento: document.getElementById('dataNascimento').value,
            crm: document.getElementById('crmMedico').value.trim(),
            ufCrm: document.getElementById('ufCrm').value,
            rqe: document.getElementById('rqeMedico').value.trim() || null,
            cep: cepInput.value.replace(/\D/g, ''),
            valorConsulta: parseFloat(document.getElementById('valorConsulta').value),
            tempoConsultaMinutos: parseInt(document.getElementById('tempoConsulta').value),
            biografia: document.getElementById('biografia').value.trim() || null,
            email: document.getElementById('emailMedico').value.trim(),
            senha: document.getElementById('senhaMedico').value,
            especialidades: especialidadesSelecionadas,
            disponibilidades: getDisponibilidades(),
        };

        console.log('Payload para o backend:', payload);
        mostrarToast('Médico cadastrado com sucesso!', 'sucesso');
        resetarFormulario();


        fetch('http://localhost:8082/api/medicos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => { throw err; });
                }
                return res.json();
            })
            .then(data => {
                console.log('Médico cadastrado:', data);
                mostrarToast('Médico cadastrado com sucesso!', 'sucesso');
                resetarFormulario();
            })
            .catch(err => {
                console.error('Erro ao cadastrar médico:', err);
                mostrarToast('Erro ao cadastrar. Tente novamente.', 'erro');
            });
    });

    

    //cancelar /rest
    btnCancelar.addEventListener('click', resetarFormulario);

    function resetarFormulario() {
        form.reset();

        // Limpa erros visuais
        document.querySelectorAll('.input-invalido').forEach(el => el.classList.remove('input-invalido'));
        document.querySelectorAll('.erro-msg.visivel').forEach(el => el.classList.remove('visivel'));

        // Reseta foto
        fotoPreview.src = '';
        fotoPreview.style.display = 'none';
        fotoIcone.style.display = '';

        // Reseta chips
        especialidadesSelecionadas = [];
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('ativo', 'bloqueado'));
        document.getElementById('chipsContador').textContent = '0/3 selecionadas';

        // Reseta disponibilidade
        DIAS_SEMANA.forEach(({ id }) => {
            const chk = document.getElementById(`disp-chk-${id}`);
            const row = document.getElementById(`disp-row-${id}`);
            if (chk) chk.checked = false;
            if (row) row.classList.remove('ativa');
        });
    }

    //toast
    function mostrarToast(mensagem, tipo = 'sucesso') {
        const toast = document.getElementById('toast');
        toast.textContent = mensagem;
        toast.className = `toast ${tipo} visivel`;
        setTimeout(() => toast.classList.remove('visivel'), 3000);
    }

    //INIT
    inicializarChips();
    inicializarDisponibilidade();
});