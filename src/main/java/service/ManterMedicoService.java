package service;

import java.io.Serializable;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import model.JsonUtils;
import model.Medico;

@ApplicationScoped
public class ManterMedicoService implements Serializable {
    private static final long serialVersionUID = 1L;

    public List<Medico> buscarTodos() {
        try {
            HttpClient httpClient = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder(URI.create(JsonUtils.MEDICO_API)).GET().build();
            
            
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                ObjectMapper mapper = new ObjectMapper();
                return mapper.readValue(response.body(), new TypeReference<List<Medico>>(){});
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }
    
    public boolean salvar(Medico medico) {
        try {
            //jsonutil converter medico
            String jsonRequest = JsonUtils.toJson(medico);

            HttpClient httpClient = HttpClient.newHttpClient();
            
            HttpRequest request = HttpRequest.newBuilder(URI.create(JsonUtils.MEDICO_API))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonRequest))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            return response.statusCode() == 200 || response.statusCode() == 201;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean excluir(Long id) {
        try {
            HttpClient httpClient = HttpClient.newHttpClient();
            
            String urlComId = JsonUtils.MEDICO_API + "/" + id;
            
            HttpRequest request = HttpRequest.newBuilder(URI.create(urlComId))
                    .DELETE()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    
            return response.statusCode() == 204 || response.statusCode() == 200;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

 //medicoService.java
    public List<Medico> listarTodos() {
        return buscarTodos(); 
    }
}