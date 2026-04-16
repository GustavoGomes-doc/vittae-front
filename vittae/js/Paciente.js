(function () {
    "use strict";

    let doctors = [];
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
        patientPhone: "",
        patientBirthDate: "",
        patientSex: "",
        observations: ""
    };
    async function init() {
        setupEventListeners();
        setMinDate();
        updateProgressBar();
        await fetchDoctors();
    }

    //NAVEGACAO BARRAS

    window.irParaHistorico = function () {
        const modal = document.getElementById('modalSucesso');
        if (modal) modal.style.display = 'none';
        window.location.href = 'VerConsultas.html'; // ← navega por arquivo
    };

    window.novoAgendamento = function () {
        const modal = document.getElementById('modalSucesso');
        if (modal) modal.style.display = 'none';
        resetForm();
    };

    
    //FORM AGEND
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
        const birthDateInput = document.getElementById("patientBirthDate");

        if (prevBtn) prevBtn.addEventListener("click", previousStep);
        if (nextBtn) nextBtn.addEventListener("click", nextStep);
        if (submitBtn) submitBtn.addEventListener("click", submitForm);
        if (resetBtn) resetBtn.addEventListener("click", resetForm);
        if (searchInput) searchInput.addEventListener("input", searchDoctors);

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

        //MASK CPF
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

        //MASC TELE
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

        //MASC DATANASC
        if (birthDateInput) {
            birthDateInput.addEventListener("input", function (e) {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length <= 8) {
                    value = value.replace(/(\d{2})(\d)/, "$1/$2")
                        .replace(/(\d{2})(\d)/, "$1/$2");
                    e.target.value = value;
                }
            });
        }
    }

    function setMinDate() {
        const dateInput = document.getElementById("consultaDate");
        if (dateInput) {
            const today = new Date().toISOString().split("T")[0];
            dateInput.setAttribute("min", today);
        }
    }

    //BUSCAR E REND MED
    async function fetchDoctors() {
        const list = document.getElementById("doctorsList");
        if (list) list.innerHTML = '<p style="text-align:center;color:#718096;padding:40px;">Carregando médicos...</p>';

        try {
            const response = await fetch("http://localhost:8082/api/medicos");
            if (!response.ok) throw new Error('Falha ao carregar médicos');

            const data = await response.json();

            doctors = data.map(function (medico) {
                return {
                    id: medico.id,
                    name: medico.nome || "Médico Indisponível",
                    specialty: (medico.especialidades && medico.especialidades.length > 0) ? medico.especialidades[0].nome : "Clínico Geral",
                    location: medico.localizacao || "Clínica Principal",
                    rating: medico.avaliacao || 5.0,
                    initials: getInitials(medico.nome)
                };
            });

            renderDoctors(doctors);
        } catch (error) {
            console.error("Erro ao buscar médicos:", error);
            if (list) list.innerHTML = '<p style="text-align:center;color:#e53e3e;padding:40px;">Não foi possível carregar os médicos.</p>';
        }
    }

    function getInitials(nome) {
        if (!nome) return "MD";
        const cleanName = nome.replace(/Dr\.|Dra\./g, "").trim();
        const parts = cleanName.split(" ");
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return cleanName.substring(0, 2).toUpperCase();
    }

    function renderDoctors(doctorsArray) {
        const list = document.getElementById("doctorsList");
        if (!list) return;

        list.innerHTML = "";
        if (doctorsArray.length === 0) {
            list.innerHTML = '<p style="text-align:center;color:#718096;padding:40px;">Nenhum médico encontrado.</p>';
            return;
        }

        doctorsArray.forEach(function (doctor) {
            const card = document.createElement("div");
            card.className = "doctor-card";
            if (selectedDoctor && selectedDoctor.id === doctor.id) card.classList.add("selected");

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
            card.addEventListener("click", function () { selectDoctor(doctor); });
            list.appendChild(card);
        });
    }

    function selectDoctor(doctor) {
        selectedDoctor = doctor;
        const allCards = document.querySelectorAll(".doctor-card");
        allCards.forEach(card => {
            const h4 = card.querySelector("h4");
            if (h4 && h4.textContent === doctor.name) card.classList.add("selected");
            else card.classList.remove("selected");
        });
    }

    function searchDoctors() {
        const searchInput = document.getElementById("searchInput");
        if (!searchInput) return;

        const query = searchInput.value.toLowerCase().trim();
        if (query === "") {
            renderDoctors(doctors);
            return;
        }

        const filtered = doctors.filter(doctor =>
            doctor.name.toLowerCase().includes(query) ||
            doctor.specialty.toLowerCase().includes(query)
        );
        renderDoctors(filtered);
    }

    //ETAPAS CONSULTA E NAVEG
    function updateProgressBar() {
        const progress = ((currentStep - 1) / 2) * 100;
        const progressBar = document.getElementById("progressBar");
        if (progressBar) progressBar.style.width = progress + "%";

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

    function showStep(step) {
        document.querySelectorAll(".form-step").forEach(el => el.classList.remove("active"));
        const currentStepEl = document.getElementById("step" + step);
        if (currentStepEl) currentStepEl.classList.add("active");

        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        const submitBtn = document.getElementById("submitBtn");

        if (prevBtn) prevBtn.disabled = step === 1;

        if (step === 3) {
            if (nextBtn) nextBtn.style.display = "none";
            if (submitBtn) submitBtn.style.display = "inline-block";
        } else {
            if (nextBtn) nextBtn.style.display = "inline-block";
            if (submitBtn) submitBtn.style.display = "none";
        }

        updateProgressBar();
    }

    function nextStep() {
        if (validateCurrentStep() && currentStep < 3) {
            currentStep++;
            showStep(currentStep);
        }
    }

    function previousStep() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    }


    function validateCurrentStep() {
        if (currentStep === 1) {
            const typeEl = document.getElementById("consultaType");
            const dateEl = document.getElementById("consultaDate");
            const timeEl = document.getElementById("consultaTime");

            if (!typeEl || !dateEl || !timeEl) return false;
            if (!typeEl.value || !dateEl.value || !timeEl.value) {
                alert("Preencha todos os campos da consulta!");
                return false;
            }

            formData.consultaType = typeEl.value;
            formData.date = dateEl.value;
            formData.time = timeEl.value;
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
            const phoneEl = document.getElementById("patientPhone");
            const birthDateEl = document.getElementById("patientBirthDate");
            const sexEl = document.getElementById("patientSex");

            if (!nameEl || !cpfEl || !phoneEl || !birthDateEl || !sexEl) {
                console.error("Campos HTML faltando. Verifique os IDs no seu index.html.");
                return false;
            }

            const name = nameEl.value.trim();
            const cpf = cpfEl.value.trim();
            const phone = phoneEl.value.trim();
            const birthDate = birthDateEl.value.trim();
            const sex = sexEl.value.trim();

            if (!name || !cpf || !phone || !birthDate || !sex) {
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
            formData.patientPhone = phone;
            formData.patientBirthDate = birthDate;
            formData.patientSex = sex;
            formData.observations = observationsEl ? observationsEl.value.trim() : "";

            return true;
        }
        return true;
    }

    //envio p back
    async function submitForm() {
        if (!validateCurrentStep()) return;

        const submitBtn = document.getElementById("submitBtn");
        const originalBtnText = submitBtn ? submitBtn.innerText : "Prosseguir";

        try {
            if (submitBtn) {
                submitBtn.innerText = "Enviando...";
                submitBtn.disabled = true;
            }

            
            //form data
            let dataNascFormatada = null;
            if (formData.patientBirthDate) {
                dataNascFormatada = formData.patientBirthDate.split('/').reverse().join('-');
            }

            //montagem do objeto
            const agendamentoDTO = {
                tipoConsulta: formData.consultaType,
                especialidade: selectedDoctor.specialty,
                dataAgendado: new Date().toISOString().split('T')[0],
                dataConsulta: formData.date,
                hora: formData.time,
                valorconsulta: 0,
                medicoId: selectedDoctor.id,
                paciente: {
                    nome: formData.patientName,
                    cpf: formData.patientCPF.replace(/\D/g, ""),
                    telefone: formData.patientPhone.replace(/\D/g, ""),
                    dataNascimento: dataNascFormatada,
                    sexo: formData.patientSex
                },
                observacoes: formData.observations
            };

            const response = await fetch("http://localhost:8082/api/agendamentos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(agendamentoDTO)
            });

            if (response.ok) {
                //modal
                const resPaciente = document.getElementById('resumoPaciente');
                const resMedico = document.getElementById('resumoMedico');
                const resData = document.getElementById('resumoData');
                const resHora = document.getElementById('resumoHora');

                if (resPaciente) resPaciente.innerText = formData.patientName;
                if (resMedico) resMedico.innerText = selectedDoctor.name;

                //foratacao de data
                if (resData) {
                    const dataBr = formData.date.split('-').reverse().join('/');
                    resData.innerText = dataBr;
                }

                if (resHora) resHora.innerText = formData.time;

                //abre o modal)
                const successModal = document.getElementById("modalSucesso");
                if (successModal) {
                    successModal.style.display = 'flex'; // Garante que aparece
                    successModal.classList.add("show");
                }

            } else {
                const erro = await response.json();
                alert("Erro ao agendar: " + (erro.mensagem || "Verifique os dados."));
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro de conexão com o servidor.");
        } finally {
            if (submitBtn) {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        }
    }

    function resetForm() {
        currentStep = 1;
        selectedDoctor = null;

        const elements = [
            "consultaType", "consultaDate", "consultaTime", "patientName",
            "patientCPF", "patientPhone", "patientBirthDate", "patientSex",
            "observations", "searchInput"
        ];

        elements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });

        const radioPresencial = document.getElementById("radioPresencial");
        if (radioPresencial) radioPresencial.classList.add("active");

        renderDoctors(doctors);
        showStep(1);

        const successModal = document.getElementById("successModal");
        if (successModal) successModal.classList.remove("show");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }


    ///////////////////////////////////////////
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    window.irParaHistorico = function () {
        // Esconde o modal
        const modal = document.getElementById('modalSucesso');
        if (modal) modal.style.display = 'none';

        // Tira a seleção de todas as abas
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));

        // Ativa a aba do Histórico
        const tabHistorico = document.querySelector('[data-target="historico"]');
        const sectionHistorico = document.getElementById('historico');

        if (tabHistorico) tabHistorico.classList.add('active');
        if (sectionHistorico) sectionHistorico.classList.add('active');
    };

    window.novoAgendamento = function () {
        const modal = document.getElementById('modalSucesso');
        if (modal) modal.style.display = 'none';

        if (typeof resetForm === "function") {
            resetForm();
        } else {
            location.reload();
        }
    };

})();