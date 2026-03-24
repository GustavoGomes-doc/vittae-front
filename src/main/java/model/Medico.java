package model;


import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class Medico {

	private Long id;
	private String nome;
	private String crm;
	private String email;
	private String cpf;
	private String cep;
	private LocalDate dataNascimento;
	private String senha;
	private BigDecimal valorConsulta;
	
	public Medico() {
		// TODO Auto-generated constructor stub
	}

	public Medico(Long id, String nome, String crm, String email, String cpf, String cep, LocalDate dataNascimento, BigDecimal valorConsulta) {
		this.id = id;
		this.nome = nome;
		this.crm = crm;
		this.cpf = cpf;
		this.cep = cep;
		this.dataNascimento = dataNascimento;
		this.email = email;
		this.setValorConsulta(valorConsulta);
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getCrm() {
		return crm;
	}

	public void setCrm(String crm) {
		this.crm = crm;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getCep() {
		return cep;
	}

	public void setCep(String cep) {
		this.cep = cep;
	}

	public LocalDate getDataNascimento() {
		return dataNascimento;
	}

	public void setDataNascimento(LocalDate dataNascimento) {
		this.dataNascimento = dataNascimento;
	}

	public BigDecimal getValorConsulta() {
		return valorConsulta;
	}

	public void setValorConsulta(BigDecimal valorConsulta) {
		this.valorConsulta = valorConsulta;
	}

}
