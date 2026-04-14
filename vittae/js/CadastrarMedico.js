document.addEventListener('DOMContentLoaded', () => {

    const formCadastro = document.getElementById('formCadastroCompleto');
    const selectEspecialidades = document.getElementById('especialidadesMedico');
    const btnCancelar = document.getElementById('btnCancelarCadastro');
    const cpfInput = document.getElementById('cpfMedico');

    // Máscara de CPF
    cpfInput.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, '');
        value = value
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        this.value = value;
    });

    // Limite de 3 especialidades
    selectEspecialidades.addEventListener('change', function () {
        const selecionados = Array.from(this.selectedOptions);
        if (selecionados.length > 3) {
            alert('Você pode selecionar no máximo 3 especialidades.');
            selecionados[selecionados.length - 1].selected = false;
        }
    });

    // Validação e envio
    formCadastro.addEventListener('submit', function (event) {
        event.preventDefault();

        let formularioValido = true;
        const camposObrigatorios = formCadastro.querySelectorAll('[required]');

        camposObrigatorios.forEach(campo => {
            const spanErro = campo.id === 'especialidadesMedico'
                ? document.getElementById('erro-especialidade')
                : campo.nextElementSibling;

            if (campo.multiple) {
                if (campo.selectedOptions.length === 0) {
                    marcarErro(campo, spanErro);
                    formularioValido = false;
                } else {
                    removerErro(campo, spanErro);
                }
            } else if (!campo.checkValidity() || campo.value.trim() === '') {
                marcarErro(campo, spanErro);
                formularioValido = false;
            } else {
                removerErro(campo, spanErro);
            }
        });

        if (!formularioValido) return;

        alert('Formulário válido! Pronto para enviar ao backend.');
        formCadastro.reset();
        // Futuramente: fetch para http://localhost:8082/api/medicos
    });

    // Cancelar limpa o formulário
    btnCancelar.addEventListener('click', () => {
        formCadastro.reset();
        formCadastro.querySelectorAll('.input-invalido').forEach(c => {
            removerErro(c, c.nextElementSibling);
        });
    });

    function marcarErro(campo, spanMsg) {
        campo.classList.add('input-invalido');
        if (spanMsg) spanMsg.style.display = 'block';
    }

    function removerErro(campo, spanMsg) {
        campo.classList.remove('input-invalido');
        if (spanMsg) spanMsg.style.display = 'none';
    }
});