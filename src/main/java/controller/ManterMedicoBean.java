package controller;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.faces.view.ViewScoped;
import javax.inject.Inject;
import javax.inject.Named;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import model.Medico;
import service.MedicoService;

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
	private MedicoService medicoService;

	@PostConstruct
	public void inicializar() {
		log.info("init pesquisa");
		buscarTodos();
	}

	public void salvar() {
		log.info("salvando...");
	}

	public void excluir() {
		log.info("excluindo...");
	}

	public void buscarTodos() {
		log.info("Buscando médicos através do Service...");
		// O Bean apenas pede a lista para o Service!
		this.medicos = medicoService.buscarTodos();

		log.info("Busca concluída. Médicos encontrados: " + (this.medicos != null ? this.medicos.size() : 0));
	}

	public void limpar() {
		log.info("limpar");
		this.medico = new Medico();
	}

}