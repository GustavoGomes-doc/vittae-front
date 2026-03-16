package demojsf.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.faces.view.ViewScoped;
import javax.inject.Inject;
import javax.inject.Named;

import demojsf.model.Aluno;
import demojsf.model.JsonUtils;
import demojsf.service.AlunoService;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;



@Log4j2
@Getter
@Setter
@Named
@ViewScoped
public class ManterAlunoBean implements Serializable {

	private static final long serialVersionUID = 1L;

	private List<Aluno> alunos = new ArrayList<>();
	private Aluno aluno;

	@Inject
	private AlunoService alunoService;
	
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
	    log.info("Listing users using Java HttpClient:");  

	    HttpClient httpClient = HttpClient.newHttpClient();  
	    HttpRequest request = HttpRequest.newBuilder(URI.create(JsonUtils.ALUNO_API)).GET().build();  

	    try {  
	        HttpResponse<InputStream> response = httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());  

	        int statusCode = response.statusCode();  
	        log.info("HTTP status: " + statusCode);  

	        log.info("Users returned in request: ");  
	        this.alunos = JsonUtils.toList(response.body());
	       
	    }  
	    catch (IOException | InterruptedException e) {  
	        throw new RuntimeException(e);  
	    }  
	}
	
	public void limpar() {
		log.info("limpar");
		this.aluno = new Aluno();
	}	
	
}
