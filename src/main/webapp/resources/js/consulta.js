(function() {
    "use strict";

    // Dados dos médicos
    const doctors = [
        { id: 1, name: "Dr. Carlos Silva", specialty: "Clínico Geral", location: "Av. Nove de Julho - Salto, SP", rating: 4.9, initials: "CS" },
        { id: 2, name: "Dra. Ana Costa", specialty: "Cardiologia", location: "Rio de Janeiro - RJ", rating: 4.8, initials: "AC" },
        { id: 3, name: "Dr. Pedro Santos", specialty: "Dermatologia", location: "São Paulo - SP", rating: 4.7, initials: "PS" },
        { id: 4, name: "Dra. Maria Oliveira", specialty: "Pediatria", location: "Belo Horizonte - MG", rating: 5.0, initials: "MO" },
    ];

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

    // Inicialização quando o DOM estiver pronto
    function init() {
        setupEventListeners();
        renderDoctors(doctors);
        setMinDate();
        updateProgressBar();
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
            radioPresencial.addEventListener("click", function() {
                radioPresencial.classList.add("active");
                if (radioTeleconsulta) radioTeleconsulta.classList.remove("active");
                formData.modalidade = "presencial";
            });
        }
        
        if (radioTeleconsulta) {
            radioTeleconsulta.addEventListener("click", function() {
                radioTeleconsulta.classList.add("active");
                if (radioPresencial) radioPresencial.classList.remove("active");
                formData.modalidade = "teleconsulta";
            });
        }

        // Auto-format CPF
        if (cpfInput) {
            cpfInput.addEventListener("input", function(e) {
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
            phoneInput.addEventListener("input", function(e) {
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
        allSteps.forEach(function(el) {
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
        
        doctorsArray.forEach(function(doctor) {
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
            
            card.addEventListener("click", function() {
                selectDoctor(doctor);
            });
            
            list.appendChild(card);
        });
    }

    // Selecionar médico
    function selectDoctor(doctor) {
        selectedDoctor = doctor;
        
        const allCards = document.querySelectorAll(".doctor-card");
        allCards.forEach(function(card) {
            card.classList.remove("selected");
        });
        
        // Encontrar e selecionar o card clicado
        allCards.forEach(function(card) {
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
        
        const filtered = doctors.filter(function(doctor) {
            return doctor.name.toLowerCase().includes(query) ||
                   doctor.specialty.toLowerCase().includes(query) ||
                   doctor.location.toLowerCase().includes(query);
        });
        
        renderDoctors(filtered);
    }

    // Submeter formulário
    function submitForm() {
        if (!validateCurrentStep()) return;
        
        console.log("=== AGENDAMENTO CONFIRMADO ===");
        console.log("Dados:", formData);
        console.log("Médico:", selectedDoctor);
        
        // Preencher resumo
        const summaryDoctor = document.getElementById("summaryDoctor");
        const summaryDate = document.getElementById("summaryDate");
        const summaryMode = document.getElementById("summaryMode");
        const summaryLoc = document.getElementById("summaryLoc");
                
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
        
        const successModal = document.getElementById("successModal");
        if (successModal) {
            successModal.classList.add("show");
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
        
        Object.keys(elements).forEach(function(key) {
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