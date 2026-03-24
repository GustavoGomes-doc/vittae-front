package service;

import java.io.Serializable;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.enterprise.context.ApplicationScoped;
import model.JsonUtils;
import model.Medico;
// import JsonUtils...

@ApplicationScoped
public class MedicoService implements Serializable {
    private static final long serialVersionUID = 1L;

    public List<Medico> buscarTodos() {
        try {
            HttpClient httpClient = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder(URI.create(JsonUtils.MEDICO_API)).GET().build();
            
            
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                // FALTAVA ISSO: Converter o JSON da API para List<Medico>
                ObjectMapper mapper = new ObjectMapper();
                return mapper.readValue(response.body(), new TypeReference<List<Medico>>(){});
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ArrayList<>(); // Retorna lista vazia em caso de erro
    }
}