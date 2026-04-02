(function () {
    "use strict";

    // Dados dos médicos
    let doctors = [];

    // Estado da aplicação
    let currentStep = 1;
    let selectedDoctor = null;
    const formData = {
        consultaType: "",
        modalidade: "presencial",
        date: "",
        time: "",
        doctorId: null,
        patientName: "",
        patientCPF: "",
        patientEmail: "",
        patientPhone: "",
        observations: ""
    };

    // Buscar médicos no Spring Boot
    async function fetchDoctors() {
        const list = document.getElementById("doctorsList");

        // Mostra uma mensagem de carregamento enquanto aguarda o Java
        if (list) {
            list.innerHTML = '<p style="text-align:center;color:#718096;padding:40px;grid-column:1/-1;">Carregando lista de médicos...</p>';
        }

        try {
            // Altere para a rota correta da sua API
            const response = await fetch("http://localhost:8080/api/medicos");

            if (!response.ok) {
                throw new Error('Falha ao carregar médicos');
            }

            const data = await response.json();

            // Mapeando os dados do Java para o formato que seu frontend já entende.
            // Dica: ajuste "medico.nome", "medico.especialidade" de acordo com os atributos da sua classe Java.
            doctors = data.map(function (medico) {
                return {
                    id: medico.id,
                    name: medico.nome, // ou medico.name, dependendo do Java
                    specialty: medico.especialidade,
                    location: medico.localizacao || "Consultório Vittae", // Valor padrão se não vier do banco
                    rating: medico.avaliacao || 5.0,
                    // Cria as iniciais dinamicamente
                    initials: getInitials(medico.nome)
                };
            });

            // Renderiza os médicos na tela
            renderDoctors(doctors);

        } catch (error) {
            console.error("Erro ao buscar médicos:", error);
            if (list) {
                list.innerHTML = '<p style="text-align:center;color:#e53e3e;padding:40px;grid-column:1/-1;">Não foi possível carregar os médicos. Verifique a conexão com o servidor.</p>';
            }
        }
    }

    // Função para gerar as bolinhas com as letras do nome (ex: "Dr. Carlos Silva" -> "CS")
    function getInitials(nome) {
        if (!nome) return "MD";
        // Remove os prefixos Dr. ou Dra.
        const cleanName = nome.replace(/Dr\.|Dra\./g, "").trim();
        const parts = cleanName.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return cleanName.substring(0, 2).toUpperCase();
    }

    // Inicialização quando o DOM estiver pronto
    async function init() {
        setupEventListeners();
        setMinDate();
        updateProgressBar();

        // Busca os médicos do backend e já renderiza na tela
        await fetchDoctors();
    }

    // Configurar todos os event listeners
    function setupEventListeners() {
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        const submitBtn = document.getElementById("submitBtn");
        const resetBtn = document.getElementById("resetBtn");
        const searchInput = document.getElementById("searchInput");
        const radioPresencial = document.getElementById("radioPresencial");
        const radioTeleconsulta = document.getElementById("radioTeleconsulta");
        const cpfInput = document.getElementById("patientCPF");
        const phoneInput = document.getElementById("patientPhone");

        if (prevBtn) prevBtn.addEventListener("click", previousStep);
        if (nextBtn) nextBtn.addEventListener("click", nextStep);
        if (submitBtn) submitBtn.addEventListener("click", submitForm);
        if (resetBtn) resetBtn.addEventListener("click", resetForm);
        if (searchInput) searchInput.addEventListener("input", searchDoctors);

        // Radio buttons modalidade
        if (radioPresencial) {
            radioPresencial.addEventListener("click", function () {
                radioPresencial.classList.add("active");
                if (radioTeleconsulta) radioTeleconsulta.classList.remove("active");
                formData.modalidade = "presencial";
            });
        }

        if (radioTeleconsulta) {
            radioTeleconsulta.addEventListener("click", function () {
                radioTeleconsulta.classList.add("active");
                if (radioPresencial) radioPresencial.classList.remove("active");
                formData.modalidade = "teleconsulta";
            });
        }

        // Auto-format CPF
        if (cpfInput) {
            cpfInput.addEventListener("input", function (e) {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length <= 11) {
                    value = value.replace(/(\d{3})(\d)/, "$1.$2")
                        .replace(/(\d{3})(\d)/, "$1.$2")
                        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                    e.target.value = value;
                }
            });
        }

        // Auto-format Telefone
        if (phoneInput) {
            phoneInput.addEventListener("input", function (e) {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length <= 11) {
                    value = value.replace(/(\d{2})(\d)/, "($1) $2")
                        .replace(/(\d{5})(\d)/, "$1-$2");
                    e.target.value = value;
                }
            });
        }
    }

    // Definir data mínima como hoje
    function setMinDate() {
        const dateInput = document.getElementById("consultaDate");
        if (dateInput) {
            const today = new Date().toISOString().split("T")[0];
            dateInput.setAttribute("min", today);
        }
    }

    // Atualizar barra de progresso
    function updateProgressBar() {
        const progress = ((currentStep - 1) / 2) * 100;
        const progressBar = document.getElementById("progressBar");
        if (progressBar) {
            progressBar.style.width = progress + "%";
        }

        // Atualizar círculos
        for (let i = 1; i <= 3; i++) {
            const circle = document.getElementById("circle" + i);
            if (!circle) continue;

            if (i < currentStep) {
                circle.classList.add("completed");
                circle.classList.remove("active");
                circle.innerHTML = "✓";
            } else if (i === currentStep) {
                circle.classList.add("active");
                circle.classList.remove("completed");
                circle.innerHTML = "<span>" + i + "</span>";
            } else {
                circle.classList.remove("active", "completed");
                circle.innerHTML = "<span>" + i + "</span>";
            }
        }
    }

    // Mostrar step específico
    function showStep(step) {
        const allSteps = document.querySelectorAll(".form-step");
        allSteps.forEach(function (el) {
            el.classList.remove("active");
        });

        const currentStepEl = document.getElementById("step" + step);
        if (currentStepEl) {
            currentStepEl.classList.add("active");
        }

        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        const submitBtn = document.getElementById("submitBtn");

        // Atualizar botões
        if (prevBtn) {
            prevBtn.disabled = step === 1;
        }

        if (step === 3) {
            if (nextBtn) nextBtn.style.display = "none";
            if (submitBtn) submitBtn.style.display = "inline-block";
        } else {
            if (nextBtn) nextBtn.style.display = "inline-block";
            if (submitBtn) submitBtn.style.display = "none";
        }

        updateProgressBar();
    }

    // Validar step atual
    function validateCurrentStep() {
        if (currentStep === 1) {
            const typeEl = document.getElementById("consultaType");
            const dateEl = document.getElementById("consultaDate");
            const timeEl = document.getElementById("consultaTime");

            if (!typeEl || !dateEl || !timeEl) {
                alert("Erro: Elementos do formulário não encontrados!");
                return false;
            }

            const type = typeEl.value;
            const date = dateEl.value;
            const time = timeEl.value;

            if (!type || !date || !time) {
                alert("Preencha todos os campos!");
                return false;
            }

            formData.consultaType = type;
            formData.date = date;
            formData.time = time;
            return true;
        }

        if (currentStep === 2) {
            if (!selectedDoctor) {
                alert("Selecione um médico!");
                return false;
            }
            formData.doctorId = selectedDoctor.id;
            return true;
        }

        if (currentStep === 3) {
            const nameEl = document.getElementById("patientName");
            const cpfEl = document.getElementById("patientCPF");
            const emailEl = document.getElementById("patientEmail");
            const phoneEl = document.getElementById("patientPhone");

            if (!nameEl || !cpfEl || !emailEl || !phoneEl) {
                alert("Erro: Elementos do formulário não encontrados!");
                return false;
            }

            const name = nameEl.value.trim();
            const cpf = cpfEl.value.trim();
            const email = emailEl.value.trim();
            const phone = phoneEl.value.trim();

            if (!name || !cpf || !email || !phone) {
                alert("Preencha todos os campos obrigatórios!");
                return false;
            }

            if (cpf.replace(/\D/g, "").length !== 11) {
                alert("CPF inválido!");
                return false;
            }

            const observationsEl = document.getElementById("observations");

            formData.patientName = name;
            formData.patientCPF = cpf;
            formData.patientEmail = email;
            formData.patientPhone = phone;
            formData.observations = observationsEl ? observationsEl.value.trim() : "";
            return true;
        }

        return true;
    }

    // Próximo step
    function nextStep() {
        if (validateCurrentStep() && currentStep < 3) {
            currentStep++;
            showStep(currentStep);
        }
    }

    // Step anterior
    function previousStep() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    }

    // Renderizar lista de médicos
    function renderDoctors(doctorsArray) {
        const list = document.getElementById("doctorsList");
        if (!list) return;

        list.innerHTML = "";

        if (doctorsArray.length === 0) {
            list.innerHTML = '<p style="text-align:center;color:#718096;padding:40px;grid-column:1/-1;">Nenhum médico encontrado.</p>';
            return;
        }

        doctorsArray.forEach(function (doctor) {
            const card = document.createElement("div");
            card.className = "doctor-card";
            if (selectedDoctor && selectedDoctor.id === doctor.id) {
                card.classList.add("selected");
            }

            card.innerHTML = `
                <div class="doctor-header">
                    <div class="doctor-avatar">${doctor.initials}</div>
                    <div class="doctor-info">
                        <h4>${doctor.name}</h4>
                        <p class="doctor-specialty">${doctor.specialty}</p>
                    </div>
                </div>
                <div class="doctor-details">
                    <span>📍 ${doctor.location}</span>
                    <span>⭐ ${doctor.rating}</span>
                </div>
            `;

            card.addEventListener("click", function () {
                selectDoctor(doctor);
            });

            list.appendChild(card);
        });
    }

    // Selecionar médico
    function selectDoctor(doctor) {
        selectedDoctor = doctor;

        const allCards = document.querySelectorAll(".doctor-card");
        allCards.forEach(function (card) {
            card.classList.remove("selected");
        });

        // Encontrar e selecionar o card clicado
        allCards.forEach(function (card) {
            const h4 = card.querySelector("h4");
            if (h4 && h4.textContent === doctor.name) {
                card.classList.add("selected");
            }
        });
    }

    // Buscar médicos
    function searchDoctors() {
        const searchInput = document.getElementById("searchInput");
        if (!searchInput) return;

        const query = searchInput.value.toLowerCase().trim();

        if (query === "") {
            renderDoctors(doctors);
            return;
        }

        const filtered = doctors.filter(function (doctor) {
            return doctor.name.toLowerCase().includes(query) ||
                doctor.specialty.toLowerCase().includes(query) ||
                doctor.location.toLowerCase().includes(query);
        });

        renderDoctors(filtered);
    }


    // Submeter formulário integrado com Spring Boot
    async function submitForm() {
        if (!validateCurrentStep()) return;

        // Captura o botão para dar feedback visual (loading)
        const submitBtn = document.getElementById("submitBtn");
        const originalBtnText = submitBtn.innerText;

        try {
            // Desativa o botão temporariamente
            if (submitBtn) {
                submitBtn.innerText = "Enviando...";
                submitBtn.disabled = true;
            }

            // 1. Monta o objeto que o Spring Boot vai receber (Ajuste os nomes conforme sua classe Java)
            const agendamentoDTO = {
                tipoConsulta: formData.consultaType,
                modalidade: formData.modalidade,
                dataConsulta: formData.date, // Padrão 'YYYY-MM-DD'
                horarioConsulta: formData.time, // Padrão 'HH:MM'
                medicoId: selectedDoctor.id, // Envia apenas o ID do médico
                paciente: {
                    nome: formData.patientName,
                    // Remove pontos e traços para salvar limpo no banco
                    cpf: formData.patientCPF.replace(/\D/g, ""),
                    email: formData.patientEmail,
                    telefone: formData.patientPhone.replace(/\D/g, "")
                },
                observacoes: formData.observations
            };

            // 2. Define a URL do seu backend Spring Boot
            const apiUrl = "http://localhost:8080/api/agendamentos";

            // 3. Dispara a requisição HTTP POST
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(agendamentoDTO)
            });

            // 4. Analisa a resposta do Spring Boot
            if (response.ok) {
                // SUCESSO (Status 200 ou 201)

                // Preencher o resumo visual no modal (seu código original)
                const summaryDoctor = document.getElementById("summaryDoctor");
                const summaryDate = document.getElementById("summaryDate");
                const summaryMode = document.getElementById("summaryMode");

                if (summaryDoctor && selectedDoctor) {
                    summaryDoctor.textContent = selectedDoctor.name;
                }

                if (summaryDate && formData.date && formData.time) {
                    const dateObj = new Date(formData.date + "T00:00:00");
                    const dateFormatted = dateObj.toLocaleDateString("pt-BR");
                    summaryDate.textContent = dateFormatted + " às " + formData.time;
                }

                if (summaryMode) {
                    summaryMode.textContent = formData.modalidade.charAt(0).toUpperCase() + formData.modalidade.slice(1);
                }

                // Exibir o modal de sucesso
                const successModal = document.getElementById("successModal");
                if (successModal) {
                    successModal.classList.add("show");
                }

            } else {
                // ERRO (Status 400, 500, etc.)
                // Opcional: tentar extrair a mensagem de erro da API
                // const erro = await response.json(); 
                alert("Não foi possível realizar o agendamento. Verifique os dados.");
            }

        } catch (error) {
            // Cai aqui se o servidor estiver offline, etc.
            console.error("Erro na requisição:", error);
            alert("Erro de conexão com o servidor. O back-end está rodando?");
        } finally {
            // Restaura o botão ao normal indepentende de sucesso ou falha
            if (submitBtn) {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        }
    }

    // Resetar formulário
    function resetForm() {
        currentStep = 1;
        selectedDoctor = null;

        // Resetar objeto formData
        formData.consultaType = "";
        formData.modalidade = "presencial";
        formData.date = "";
        formData.time = "";
        formData.doctorId = null;
        formData.patientName = "";
        formData.patientCPF = "";
        formData.patientEmail = "";
        formData.patientPhone = "";
        formData.observations = "";

        // Resetar campos do formulário
        const elements = {
            consultaType: document.getElementById("consultaType"),
            consultaDate: document.getElementById("consultaDate"),
            consultaTime: document.getElementById("consultaTime"),
            patientName: document.getElementById("patientName"),
            patientCPF: document.getElementById("patientCPF"),
            patientEmail: document.getElementById("patientEmail"),
            patientPhone: document.getElementById("patientPhone"),
            observations: document.getElementById("observations"),
            searchInput: document.getElementById("searchInput")
        };

        Object.keys(elements).forEach(function (key) {
            if (elements[key]) elements[key].value = "";
        });

        // Resetar modalidade
        const radioPresencial = document.getElementById("radioPresencial");
        const radioTeleconsulta = document.getElementById("radioTeleconsulta");
        if (radioPresencial) radioPresencial.classList.add("active");
        if (radioTeleconsulta) radioTeleconsulta.classList.remove("active");

        renderDoctors(doctors);
        showStep(1);

        const successModal = document.getElementById("successModal");
        if (successModal) {
            successModal.classList.remove("show");
        }
    }

    // Inicializar quando o DOM estiver pronto
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();