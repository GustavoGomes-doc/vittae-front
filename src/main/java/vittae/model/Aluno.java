package vittae.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
@Entity
public class Aluno implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@EqualsAndHashCode.Include
	@ToString.Include
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;	
	private String prontuario;
	private String nome;
	private Boolean ativo;
	private Date dataNascimento;
	private Float salario;
	private String telefone;


	//relacionando aluno com professor, n para 1, muitos alunos pra 1 professor, neste caso. E estabelecendo professor como chave primaria estrangeira.
	@ManyToOne
	private Professor professor;
	private Curso curso;
}
