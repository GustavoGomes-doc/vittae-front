package controller;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;
import javax.faces.view.ViewScoped;
import javax.inject.Inject;
import javax.inject.Named;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import model.Medico;
import service.ManterMedicoService;


@Log4j2
@Getter
@Setter
@Named
@ViewScoped
public class ManterMedicoBean implements Serializable {

	private static final long serialVersionUID = 1L;

	private List<Medico> medicos = new ArrayList<>();
	private Medico medico;

	@Inject
	private ManterMedicoService medicoService;

	@PostConstruct
	public void inicializar() {
		log.info("init pesquisa");
		buscarTodos();
	}

	//ManterMedicoBean.java
	public void salvar() {
		try {
			log.info("Salvando médico: " + medico.getNome());

			boolean salvou = medicoService.salvar(this.medico); //pega o retorno do service

			if (salvou) {
				FacesContext.getCurrentInstance().addMessage(null, new FacesMessage("Médico salvo com sucesso!"));
				limpar();
				this.medicos = medicoService.listarTodos();
			} else {
				FacesContext.getCurrentInstance().addMessage(null,
						new FacesMessage(FacesMessage.SEVERITY_ERROR, "Erro", "A API recusou o cadastro."));
			}
		} catch (Exception e) {
			log.error("Erro ao salvar", e);
			FacesContext.getCurrentInstance().addMessage(null,
					new FacesMessage(FacesMessage.SEVERITY_ERROR, "Erro fatal", e.getMessage()));
		}
	}

	public void excluir(Medico medicoSelecionado) {
	    try {
	        log.info("Excluindo ID: " + medicoSelecionado.getId());
	        
	        // API
	        boolean ok = medicoService.excluir(medicoSelecionado.getId());
	        
	        if (ok) {
	            //aviso
	            FacesContext.getCurrentInstance().addMessage(null, 
	                new FacesMessage("Médico removido!"));
	                
	            //att
	            this.medicos = medicoService.listarTodos(); 
	        }
	    } catch (Exception e) {
	        log.error("Erro ao excluir", e);
	    }
	}
	
	public void prepararEdicao(Medico medicoSelecionado) {
	    log.info("Preparando edição do médico: " + medicoSelecionado.getNome());
	    this.medico = medicoSelecionado; 
	}

	public void buscarTodos() {
		log.info("Buscando médicos através do Service...");
		// bean pedidno lista para o service
		this.medicos = medicoService.buscarTodos();

		log.info("Busca concluída. Médicos encontrados: " + (this.medicos != null ? this.medicos.size() : 0));
	}

	public void limpar() {
		log.info("limpar");
		this.medico = new Medico();
	}

}