package model;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public class JsonUtils {


	    public static final String MEDICO_API = "http://localhost:8081/vittae/medico/all";  
	    public static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();  

	    public static List<Medico> toList(InputStream inputStream) throws IOException {  
	        try {  
	            return OBJECT_MAPPER.readValue(inputStream, new TypeReference<>() {});  
	        }  
	        catch (JacksonException exc) {  
	            throw new IOException(exc);  
	        }  
	    }  

	    public static Medico toObject(InputStream inputStream) throws IOException {  
	        try {  
	            return OBJECT_MAPPER.readValue(inputStream, Medico.class);  
	        }  
	        catch (JacksonException exc) {  
	            throw new IOException(exc);  
	        }  
	    }  

	    public static String toJson(Medico a) throws IOException {  
	        try {  
	            return OBJECT_MAPPER.writeValueAsString(a);  
	        }  
	        catch (JacksonException exc) {  
	            throw new IOException(exc);  
	        }
	    }

	    public static Medico buildMedico() {  	        

	       Medico a = new Medico();
	       a.setEmail("mura@arum.com");
	       a.setNome("Murakami");
	         
	       return a;
	    }

	}

