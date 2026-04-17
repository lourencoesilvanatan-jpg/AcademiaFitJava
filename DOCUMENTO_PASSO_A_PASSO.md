# AcademiaFit - Documento Explicativo Passo a Passo

## Introducao

O **AcademiaFit** e um sistema completo de gerenciamento de academia, construido com **Java (backend)**, **React (frontend)** e **MySQL (banco de dados)**. Este documento explica passo a passo como o projeto foi estruturado e, principalmente, como as tabelas do banco de dados foram criadas e se relacionam.

---

## PARTE 1 - Estrutura Geral do Projeto

### 1.1 Arquitetura em Camadas

O projeto segue uma arquitetura em camadas bem definida. Cada camada tem uma responsabilidade unica:

```
[React - Frontend]        Interface visual (formularios, tabelas, botoes)
        |
        | HTTP/JSON (Axios)
        v
[Jersey - REST API]        Recebe requisicoes e retorna respostas JSON
        |
        v
[Service - Regras]         Aplica validacoes e regras de negocio
        |
        v
[DAO - Acesso a Dados]     Executa operacoes no banco (salvar, buscar, etc.)
        |
        v
[Hibernate/JPA]            Converte objetos Java em SQL automaticamente
        |
        v
[MySQL - Banco de Dados]   Armazena os dados permanentemente
```

### 1.2 Tecnologias Utilizadas

| Camada     | Tecnologia          | Versao  | Funcao                                      |
|------------|----------------------|---------|----------------------------------------------|
| Backend    | Java                 | 11      | Linguagem principal do servidor              |
| Backend    | Jersey (JAX-RS)      | 2.41    | Framework para criar a API REST              |
| Backend    | Hibernate (JPA)      | 5.6.15  | ORM - mapeia objetos Java para tabelas MySQL |
| Backend    | HikariCP             | 5.0.1   | Pool de conexoes com o banco                 |
| Backend    | JJWT                 | 0.11.5  | Geracao e validacao de tokens JWT            |
| Frontend   | React                | 19      | Biblioteca para construir a interface        |
| Frontend   | React Router         | 6       | Navegacao entre paginas (SPA)                |
| Frontend   | Axios                | 1.13    | Cliente HTTP para chamar a API               |
| Banco      | MySQL                | 8.x     | Banco de dados relacional                    |
| Servidor   | Apache Tomcat        | 9.x     | Servidor de aplicacao Java                   |

### 1.3 Estrutura de Pastas

```
ProjetoRenomado/
|
|-- pom.xml                              # Configuracao Maven (dependencias)
|
|-- src/main/java/
|   |-- model/                           # Entidades JPA (mapeiam as tabelas)
|   |   |-- Aluno.java                   #   Tabela: aluno
|   |   |-- Usuario.java                 #   Tabela: usuario
|   |   |-- Plano.java                   #   Tabela: plano
|   |   |-- Matricula.java              #   Tabela: matricula
|   |   |-- Treino.java                  #   Tabela: treino
|   |   |-- Exercicio.java              #   Tabela: exercicio
|   |   |-- TreinoExercicio.java        #   Tabela: treino_exercicio
|   |   |-- TreinoExercicioId.java      #   Chave composta da tabela acima
|   |   |-- GrupoMuscular.java          #   Enum: grupos musculares
|   |   |-- NivelTreino.java            #   Enum: niveis de treino
|   |   |-- StatusMatricula.java        #   Enum: status da matricula
|   |   |-- GrupoMuscularConverter.java #   Conversor enum <-> banco
|   |   |-- NivelTreinoConverter.java   #   Conversor enum <-> banco
|   |
|   |-- dao/                             # Data Access Objects (acesso ao banco)
|   |   |-- GenericDAO.java              #   CRUD generico reutilizavel
|   |   |-- AlunoDAO.java               #   Consultas especificas de alunos
|   |   |-- UsuarioDAO.java             #   Consultas especificas de usuarios
|   |   |-- MatriculaDAO.java           #   Consultas especificas de matriculas
|   |   |-- PlanoDAO.java               #   Consultas especificas de planos
|   |   |-- TreinoDAO.java              #   Consultas especificas de treinos
|   |   |-- ExercicioDAO.java           #   Consultas especificas de exercicios
|   |   |-- TreinoExercicioDAO.java     #   Consultas de exercicios no treino
|   |
|   |-- service/                         # Regras de negocio
|   |   |-- AlunoService.java
|   |   |-- UsuarioService.java          #   Hash de senha com SHA-256
|   |   |-- MatriculaService.java        #   Calculo automatico da data fim
|   |   |-- PlanoService.java
|   |   |-- TreinoService.java
|   |   |-- ExercicioService.java
|   |   |-- TreinoExercicioService.java
|   |
|   |-- rest/                            # Endpoints da API REST
|   |   |-- RestApplication.java         #   Configura caminho base: /api
|   |   |-- AuthResource.java            #   Login e autenticacao
|   |   |-- AlunoResource.java           #   CRUD de alunos
|   |   |-- UsuarioResource.java         #   CRUD de usuarios
|   |   |-- PlanoResource.java           #   CRUD de planos
|   |   |-- MatriculaResource.java       #   CRUD de matriculas
|   |   |-- TreinoResource.java          #   CRUD de treinos
|   |   |-- ExercicioResource.java       #   CRUD de exercicios
|   |   |-- DashboardResource.java       #   Estatisticas do dashboard
|   |   |-- CorsFilter.java             #   Libera acesso do React
|   |   |-- AuthFilter.java             #   Protege rotas com JWT
|   |   |-- JacksonConfig.java          #   Configuracao de JSON
|   |   |-- dto/                         #   Objetos de transferencia
|   |       |-- LoginRequest.java
|   |       |-- LoginResponse.java
|   |       |-- DashboardResponse.java
|   |       |-- ErrorResponse.java
|   |
|   |-- util/                            # Utilitarios
|       |-- JPAUtil.java                 #   Fabrica de EntityManager
|       |-- JwtUtil.java                 #   Gerar/validar tokens JWT
|       |-- AppInitializer.java          #   Cria usuario admin padrao
|
|-- src/main/resources/META-INF/
|   |-- persistence.xml                  # Configuracao JPA/Hibernate/MySQL
|
|-- frontend/                            # Aplicacao React
    |-- src/
        |-- App.js                       # Rotas e estrutura principal
        |-- context/AuthContext.js       # Gerenciamento de autenticacao
        |-- services/api.js             # Conexao Axios com backend
        |-- pages/                       # Telas do sistema
        |-- components/                  # Componentes reutilizaveis
```

---

## PARTE 2 - As Tabelas do Banco de Dados (Passo a Passo)

### Como as tabelas sao criadas?

**Importante:** Neste projeto, **nao existem scripts SQL manuais** para criar as tabelas. O Hibernate (JPA) cria e atualiza as tabelas **automaticamente** a partir das classes Java do pacote `model/`.

Isso e configurado no arquivo `persistence.xml`:

```xml
<property name="hibernate.hbm2ddl.auto" value="update"/>
```

O valor `update` faz o Hibernate:
- Criar tabelas que ainda nao existem
- Adicionar colunas novas que foram definidas no codigo
- **Nunca** remover tabelas ou colunas existentes

O unico pre-requisito manual e **criar o banco de dados** no MySQL:

```sql
CREATE DATABASE academia_db;
```

Apos isso, ao iniciar o Tomcat, o Hibernate le as classes `@Entity` e gera todas as tabelas.

---

### 2.1 Tabela `aluno` (Alunos da academia)

**Classe Java:** `model/Aluno.java`

#### O que armazena?
Dados pessoais dos alunos matriculados na academia.

#### Estrutura da tabela:

| Coluna            | Tipo         | Restricoes                    | Descricao              |
|-------------------|--------------|-------------------------------|------------------------|
| id_aluno          | BIGINT       | PRIMARY KEY, AUTO_INCREMENT   | Identificador unico    |
| nome              | VARCHAR(255) | NOT NULL                      | Nome completo          |
| cpf               | VARCHAR(14)  | NOT NULL, UNIQUE              | CPF (999.999.999-99)   |
| email             | VARCHAR(255) | UNIQUE                        | E-mail                 |
| data_nascimento   | DATE         | -                             | Data de nascimento     |
| telefone          | VARCHAR(20)  | -                             | Telefone de contato    |

#### Como foi criada no Java:

```java
@Entity                                    // Marca como tabela do banco
@Table(name = "aluno")                     // Nome da tabela no MySQL
public class Aluno {

    @Id                                    // Define como chave primaria
    @GeneratedValue(strategy = IDENTITY)   // Auto incremento no MySQL
    @Column(name = "id_aluno")             // Nome da coluna no banco
    private Long id;

    @NotBlank                              // Validacao: nao pode ser vazio
    @Size(min = 3, max = 255)             // Validacao: entre 3 e 255 caracteres
    @Column(nullable = false)              // NOT NULL no banco
    private String nome;

    @NotBlank
    @Pattern(regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}")  // Formato: 999.999.999-99
    @Column(length = 14, nullable = false, unique = true)  // UNIQUE no banco
    private String cpf;

    @Email                                 // Validacao de formato de e-mail
    @Column(unique = true)                 // UNIQUE no banco
    private String email;

    @Past                                  // Validacao: deve ser data no passado
    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(length = 20)
    private String telefone;

    // Relacionamento: um aluno pode ter varias matriculas
    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore                            // Evita loop infinito no JSON
    private List<Matricula> matriculas;
}
```

#### Explicacao passo a passo:

1. `@Entity` diz ao Hibernate: "esta classe representa uma tabela"
2. `@Table(name = "aluno")` define que no MySQL a tabela se chama `aluno`
3. `@Id` + `@GeneratedValue(IDENTITY)` cria a coluna `id_aluno` como chave primaria auto incrementada
4. `@Column(nullable = false)` faz o Hibernate gerar `NOT NULL` na coluna
5. `@Column(unique = true)` faz o Hibernate gerar uma constraint `UNIQUE`
6. `@Column(length = 14)` define o tamanho maximo como `VARCHAR(14)`
7. `@OneToMany` nao cria uma coluna nesta tabela - indica que os registros relacionados estao na tabela `matricula`
8. `@JsonIgnore` impede que ao retornar um aluno como JSON, todas as matriculas sejam incluidas (evita loop infinito)

---

### 2.2 Tabela `usuario` (Usuarios do sistema)

**Classe Java:** `model/Usuario.java`

#### O que armazena?
Usuarios que podem acessar o sistema (login e senha).

#### Estrutura da tabela:

| Coluna      | Tipo         | Restricoes                  | Descricao                     |
|-------------|--------------|------------------------------|-------------------------------|
| id_usuario  | BIGINT       | PRIMARY KEY, AUTO_INCREMENT  | Identificador unico           |
| nome        | VARCHAR(255) | NOT NULL                     | Nome completo                 |
| login       | VARCHAR(100) | NOT NULL, UNIQUE             | Nome de usuario para login    |
| senha       | VARCHAR(255) | NOT NULL                     | Senha criptografada (SHA-256) |
| ativo       | BOOLEAN      | DEFAULT true                 | Se o usuario esta ativo       |

#### Como foi criada no Java:

```java
@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nome;

    @NotBlank
    @Column(length = 100, nullable = false, unique = true)
    private String login;

    @NotBlank
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)  // Senha nunca retorna no JSON
    private String senha;

    @Column(nullable = false)
    private boolean ativo = true;  // Valor padrao: true
}
```

#### Detalhes importantes:

- **A senha nunca e salva em texto puro.** O `UsuarioService` aplica hash SHA-256 antes de salvar:
  ```java
  MessageDigest md = MessageDigest.getInstance("SHA-256");
  byte[] hash = md.digest(senha.getBytes(StandardCharsets.UTF_8));
  // Converte para hexadecimal e salva no banco
  ```
- **`@JsonProperty(WRITE_ONLY)`** garante que a senha nunca e retornada nas respostas JSON da API
- **Usuario admin padrao:** Ao iniciar o sistema pela primeira vez, o `AppInitializer` cria automaticamente um usuario com login `admin` e senha `admin123`

---

### 2.3 Tabela `plano` (Planos de assinatura)

**Classe Java:** `model/Plano.java`

#### O que armazena?
Os planos disponiveis para matricula na academia (mensal, trimestral, anual, etc.).

#### Estrutura da tabela:

| Coluna        | Tipo           | Restricoes                  | Descricao                   |
|---------------|----------------|-----------------------------|-----------------------------|
| id_plano      | BIGINT         | PRIMARY KEY, AUTO_INCREMENT | Identificador unico         |
| nome          | VARCHAR(255)   | NOT NULL                    | Nome do plano               |
| valor         | DECIMAL(10,2)  | NOT NULL                    | Preco do plano (R$)         |
| duracao_dias  | INT            | NOT NULL                    | Duracao em dias             |
| descricao     | VARCHAR(500)   | -                           | Descricao do plano          |

#### Como foi criada no Java:

```java
@Entity
@Table(name = "plano")
public class Plano {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id_plano")
    private Long id;

    @NotBlank
    @Size(min = 2, max = 255)
    @Column(nullable = false)
    private String nome;

    @NotNull
    @DecimalMin(value = "0.01")                    // Valor minimo: R$ 0.01
    @Column(nullable = false, precision = 10, scale = 2)  // DECIMAL(10,2)
    private BigDecimal valor;

    @NotNull
    @Min(1)                                         // Minimo: 1 dia
    @Column(name = "duracao_dias", nullable = false)
    private Integer duracaoDias;

    @Size(max = 500)
    @Column(length = 500)
    private String descricao;

    // Um plano pode ter varias matriculas vinculadas
    @OneToMany(mappedBy = "plano", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Matricula> matriculas;
}
```

#### Explicacao:

- `BigDecimal` e usado ao inves de `double` para valores monetarios (evita problemas de arredondamento)
- `precision = 10, scale = 2` significa ate 10 digitos no total, sendo 2 casas decimais (ex: 99999999.99)
- `@DecimalMin("0.01")` garante que ninguem cadastre um plano com valor zero ou negativo
- `duracaoDias` e usado na tabela `matricula` para calcular automaticamente a data de termino

---

### 2.4 Tabela `matricula` (Matriculas dos alunos)

**Classe Java:** `model/Matricula.java`

#### O que armazena?
O vinculo entre um aluno e um plano, com datas de inicio/fim e status.

#### Estrutura da tabela:

| Coluna        | Tipo         | Restricoes                  | Descricao                         |
|---------------|--------------|-----------------------------|------------------------------------|
| id_matricula  | BIGINT       | PRIMARY KEY, AUTO_INCREMENT | Identificador unico                |
| id_aluno      | BIGINT       | NOT NULL, FOREIGN KEY       | Referencia ao aluno                |
| id_plano      | BIGINT       | NOT NULL, FOREIGN KEY       | Referencia ao plano                |
| data_inicio   | DATE         | NOT NULL                    | Data de inicio da matricula        |
| data_fim      | DATE         | -                           | Data de termino (calculada)        |
| status        | VARCHAR(255) | NOT NULL, DEFAULT 'ATIVA'   | Status: ATIVA, CANCELADA, EXPIRADA |

#### Como foi criada no Java:

```java
@Entity
@Table(name = "matricula")
public class Matricula {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id_matricula")
    private Long id;

    // CHAVE ESTRANGEIRA: referencia a tabela aluno
    @ManyToOne(fetch = FetchType.EAGER)          // Carrega o aluno junto
    @JoinColumn(name = "id_aluno", nullable = false)  // Cria coluna id_aluno como FK
    @NotNull
    private Aluno aluno;

    // CHAVE ESTRANGEIRA: referencia a tabela plano
    @ManyToOne(fetch = FetchType.EAGER)          // Carrega o plano junto
    @JoinColumn(name = "id_plano", nullable = false)  // Cria coluna id_plano como FK
    @NotNull
    private Plano plano;

    @NotNull
    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @NotNull
    @Enumerated(EnumType.STRING)                 // Salva como texto no banco
    @Column(nullable = false)
    private StatusMatricula status = StatusMatricula.ATIVA;

    // CALCULO AUTOMATICO: executado antes de salvar no banco
    @PrePersist
    public void calcularDataFim() {
        if (this.dataInicio != null && this.plano != null && this.plano.getDuracaoDias() != null) {
            this.dataFim = this.dataInicio.plusDays(this.plano.getDuracaoDias());
        }
    }
}
```

#### Explicacao passo a passo:

1. **`@ManyToOne`** indica que muitas matriculas podem pertencer a um mesmo aluno (ou plano)
2. **`@JoinColumn(name = "id_aluno")`** cria a coluna de chave estrangeira no banco. O Hibernate gera automaticamente:
   ```sql
   FOREIGN KEY (id_aluno) REFERENCES aluno(id_aluno)
   ```
3. **`FetchType.EAGER`** significa que ao buscar uma matricula, o aluno e o plano associados sao carregados automaticamente
4. **`@Enumerated(EnumType.STRING)`** salva o status como texto no banco ("ATIVA", "CANCELADA", "EXPIRADA"), nao como numero
5. **`@PrePersist`** e um evento do JPA: o metodo `calcularDataFim()` e chamado **automaticamente** antes de salvar a matricula. Ele soma a `dataInicio` + `duracaoDias` do plano para obter a `dataFim`

#### Exemplo pratico do calculo automatico:

```
Aluno: Joao Silva
Plano: Mensal (30 dias)
Data inicio: 2026-01-15

-> @PrePersist calcula: 2026-01-15 + 30 dias = 2026-02-14
-> data_fim salva automaticamente como: 2026-02-14
```

#### Relacionamentos desta tabela:

```
aluno (1) ----< (N) matricula (N) >---- (1) plano

Um aluno pode ter VARIAS matriculas
Um plano pode estar em VARIAS matriculas
Cada matricula pertence a UM aluno e UM plano
```

---

### 2.5 Tabela `treino` (Treinos)

**Classe Java:** `model/Treino.java`

#### O que armazena?
Fichas de treino da academia (Treino A, Treino B, etc.).

#### Estrutura da tabela:

| Coluna    | Tipo         | Restricoes                  | Descricao                              |
|-----------|--------------|-----------------------------|-----------------------------------------|
| id_treino | BIGINT       | PRIMARY KEY, AUTO_INCREMENT | Identificador unico                     |
| nome      | VARCHAR(255) | NOT NULL                    | Nome do treino                          |
| objetivo  | VARCHAR(255) | -                           | Objetivo (hipertrofia, emagrecimento)   |
| nivel     | VARCHAR(20)  | -                           | INICIANTE, INTERMEDIARIO ou AVANCADO    |

#### Como foi criada no Java:

```java
@Entity
@Table(name = "treino")
public class Treino {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id_treino")
    private Long id;

    @NotBlank
    @Size(min = 2, max = 255)
    @Column(nullable = false)
    private String nome;

    @Size(max = 255)
    private String objetivo;

    @Convert(converter = NivelTreinoConverter.class)  // Converte enum <-> String
    @Column(length = 20)
    private NivelTreino nivel;

    // Um treino tem varios exercicios vinculados
    @OneToMany(mappedBy = "treino", cascade = CascadeType.ALL,
               orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<TreinoExercicio> treinoExercicios;
}
```

#### Detalhes:

- **`@Convert(converter = NivelTreinoConverter.class)`** converte automaticamente entre o enum Java (`NivelTreino.INICIANTE`) e a string salva no banco (`"Iniciante"`)
- **`cascade = CascadeType.ALL`** significa que ao deletar um treino, todos os exercicios vinculados a ele (na tabela `treino_exercicio`) sao deletados automaticamente
- **`orphanRemoval = true`** remove automaticamente registros de `treino_exercicio` que foram desvinculados do treino

---

### 2.6 Tabela `exercicio` (Exercicios)

**Classe Java:** `model/Exercicio.java`

#### O que armazena?
Catalogo de exercicios disponiveis na academia.

#### Estrutura da tabela:

| Coluna          | Tipo         | Restricoes                  | Descricao                  |
|-----------------|--------------|-----------------------------|-----------------------------|
| id_exercicio    | BIGINT       | PRIMARY KEY, AUTO_INCREMENT | Identificador unico         |
| nome            | VARCHAR(255) | NOT NULL                    | Nome do exercicio           |
| grupo_muscular  | VARCHAR(30)  | -                           | Grupo muscular trabalhado   |
| descricao       | VARCHAR(500) | -                           | Descricao do exercicio      |

#### Como foi criada no Java:

```java
@Entity
@Table(name = "exercicio")
public class Exercicio {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id_exercicio")
    private Long id;

    @NotBlank
    @Size(min = 2, max = 255)
    @Column(nullable = false)
    private String nome;

    @Convert(converter = GrupoMuscularConverter.class)
    @Column(name = "grupo_muscular", length = 30)
    private GrupoMuscular grupoMuscular;

    @Size(max = 500)
    @Column(length = 500)
    private String descricao;
}
```

#### Grupos musculares disponiveis (enum `GrupoMuscular`):

| Valor enum    | Salvo no banco |
|---------------|----------------|
| PEITORAL      | Peitoral       |
| COSTAS        | Costas         |
| OMBROS        | Ombros         |
| BICEPS        | Biceps         |
| TRICEPS       | Triceps        |
| QUADRICEPS    | Quadriceps     |
| POSTERIOR     | Posterior      |
| GLUTEOS       | Gluteos        |
| PANTURRILHA   | Panturrilha    |
| ABDOMEN       | Abdomen        |
| ANTEBRACO     | Antebraco      |
| TRAPEZIO      | Trapezio       |
| CORPO_INTEIRO | Corpo Inteiro  |
| CARDIO        | Cardio         |

---

### 2.7 Tabela `treino_exercicio` (Relacionamento Treino x Exercicio)

**Classe Java:** `model/TreinoExercicio.java` + `model/TreinoExercicioId.java`

#### O que armazena?
A relacao entre treinos e exercicios, com detalhes de series, repeticoes, carga e descanso. Esta e a tabela mais complexa do projeto por usar **chave composta**.

#### Estrutura da tabela:

| Coluna            | Tipo          | Restricoes                         | Descricao                        |
|-------------------|---------------|-------------------------------------|----------------------------------|
| id_treino         | BIGINT        | PRIMARY KEY (parte 1), FOREIGN KEY | Referencia ao treino             |
| id_exercicio      | BIGINT        | PRIMARY KEY (parte 2), FOREIGN KEY | Referencia ao exercicio          |
| series            | INT           | NOT NULL                           | Numero de series                 |
| repeticoes        | INT           | NOT NULL                           | Repeticoes por serie             |
| carga_sugerida    | DECIMAL(10,2) | -                                  | Carga sugerida em kg             |
| descanso_segundos | INT           | -                                  | Tempo de descanso em segundos    |
| ordem             | INT           | -                                  | Ordem do exercicio no treino     |

#### Chave composta (`TreinoExercicioId.java`):

```java
@Embeddable    // Indica que esta classe sera usada como chave composta
public class TreinoExercicioId implements Serializable {

    @Column(name = "id_treino")
    private Long idTreino;

    @Column(name = "id_exercicio")
    private Long idExercicio;

    // hashCode() e equals() sao obrigatorios para chaves compostas
    // O JPA precisa comparar chaves para saber se dois registros sao iguais
}
```

#### Entidade principal (`TreinoExercicio.java`):

```java
@Entity
@Table(name = "treino_exercicio")
public class TreinoExercicio {

    @EmbeddedId    // Usa a chave composta definida acima
    private TreinoExercicioId id;

    // Referencia ao treino (usa a mesma coluna da chave composta)
    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("idTreino")                    // Mapeia para o campo idTreino da chave
    @JoinColumn(name = "id_treino")
    private Treino treino;

    // Referencia ao exercicio (usa a mesma coluna da chave composta)
    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("idExercicio")                 // Mapeia para o campo idExercicio da chave
    @JoinColumn(name = "id_exercicio")
    private Exercicio exercicio;

    @NotNull @Min(1)
    @Column(nullable = false)
    private Integer series;

    @NotNull @Min(1)
    @Column(nullable = false)
    private Integer repeticoes;

    @DecimalMin("0")
    @Column(name = "carga_sugerida", precision = 10, scale = 2)
    private BigDecimal cargaSugerida;

    @Min(0)
    @Column(name = "descanso_segundos")
    private Integer descansoSegundos;

    @Min(1)
    private Integer ordem;
}
```

#### Por que chave composta?

A chave primaria desta tabela e formada por **duas colunas juntas**: `id_treino` + `id_exercicio`. Isso significa:
- Um mesmo exercicio so pode aparecer **uma vez** em cada treino
- A combinacao (treino 1, exercicio 5) e unica
- Mas o exercicio 5 pode aparecer em treinos diferentes

#### Relacionamento visual:

```
treino (1) ----< (N) treino_exercicio (N) >---- (1) exercicio

Treino A:
  |-- Supino Reto:       4 series x 12 reps, 40kg, 60s descanso, ordem 1
  |-- Crucifixo:         3 series x 15 reps, 12kg, 45s descanso, ordem 2
  |-- Desenvolvimento:   4 series x 10 reps, 20kg, 90s descanso, ordem 3
```

---

## PARTE 3 - Diagrama Completo de Relacionamentos

```
+------------------+         +------------------+         +------------------+
|     aluno        |         |    matricula     |         |      plano       |
+------------------+         +------------------+         +------------------+
| PK id_aluno      |----+    | PK id_matricula  |    +---| PK id_plano      |
| nome             |    |    | FK id_aluno    --+----+   | nome             |
| cpf (UNIQUE)     |    +----+-- FK id_plano     |       | valor            |
| email (UNIQUE)   |         | data_inicio      |       | duracao_dias     |
| data_nascimento  |         | data_fim (auto)  |       | descricao        |
| telefone         |         | status           |       +------------------+
+------------------+         +------------------+

+------------------+         +---------------------+     +------------------+
|     treino       |         |  treino_exercicio   |     |    exercicio     |
+------------------+         +---------------------+     +------------------+
| PK id_treino     |----+    | PK,FK id_treino  --+--+  | PK id_exercicio  |
| nome             |    +----+-- PK,FK id_exercicio|  +--| nome             |
| objetivo         |         | series             |     | grupo_muscular   |
| nivel            |         | repeticoes         |     | descricao        |
+------------------+         | carga_sugerida     |     +------------------+
                             | descanso_segundos  |
                             | ordem              |
                             +---------------------+

+------------------+
|    usuario       |
+------------------+
| PK id_usuario    |  (tabela independente - sem FK)
| nome             |
| login (UNIQUE)   |
| senha (SHA-256)  |
| ativo            |
+------------------+
```

### Resumo dos relacionamentos:

| Relacao                         | Tipo          | Descricao                                   |
|---------------------------------|---------------|----------------------------------------------|
| Aluno -> Matricula              | 1 para N      | Um aluno pode ter varias matriculas          |
| Plano -> Matricula              | 1 para N      | Um plano pode estar em varias matriculas     |
| Treino -> TreinoExercicio       | 1 para N      | Um treino pode ter varios exercicios         |
| Exercicio -> TreinoExercicio    | 1 para N      | Um exercicio pode estar em varios treinos    |
| Treino <-> Exercicio            | N para N      | Relacao muitos-para-muitos via tabela ponte  |
| Usuario                        | Independente  | Nao possui relacionamento com outras tabelas |

---

## PARTE 4 - Como os Dados Fluem (Camada por Camada)

### Exemplo: Cadastrar uma nova matricula

**Passo 1 - Frontend (React):**
O usuario seleciona um aluno e um plano no formulario e clica "Salvar".

```javascript
// Matriculas.js
const matriculaData = {
    aluno: { id: 1 },         // ID do aluno selecionado
    plano: { id: 2 },         // ID do plano selecionado
    dataInicio: "2026-01-15",  // Data escolhida
    status: "ATIVA"
};
await api.post('/matriculas', matriculaData);
```

**Passo 2 - API REST (MatriculaResource.java):**
O Jersey recebe o JSON e converte para um objeto `Matricula`.

```java
@POST
public Response criar(Matricula matricula) {
    Matricula salva = matriculaService.salvar(matricula);
    return Response.status(201).entity(salva).build();
}
```

**Passo 3 - Service (MatriculaService.java):**
A camada de servico carrega o aluno e plano completos do banco.

```java
public Matricula salvar(Matricula matricula) {
    Aluno aluno = alunoDAO.buscarPorId(matricula.getAluno().getId());
    Plano plano = planoDAO.buscarPorId(matricula.getPlano().getId());
    matricula.setAluno(aluno);
    matricula.setPlano(plano);
    return matriculaDAO.salvar(matricula);
}
```

**Passo 4 - JPA (@PrePersist):**
Antes de salvar, o Hibernate chama automaticamente `calcularDataFim()`:

```java
dataFim = dataInicio.plusDays(plano.getDuracaoDias());
// 2026-01-15 + 30 dias = 2026-02-14
```

**Passo 5 - DAO (GenericDAO.java):**
O DAO abre uma transacao e persiste no banco.

```java
public T salvar(T entidade) {
    EntityManager em = JPAUtil.getEntityManager();
    em.getTransaction().begin();
    em.persist(entidade);          // Hibernate gera o INSERT SQL
    em.getTransaction().commit();
    return entidade;
}
```

**Passo 6 - Hibernate gera o SQL:**
```sql
INSERT INTO matricula (id_aluno, id_plano, data_inicio, data_fim, status)
VALUES (1, 2, '2026-01-15', '2026-02-14', 'ATIVA');
```

**Passo 7 - Resposta:**
O objeto salvo (com `id_matricula` gerado e `data_fim` calculada) retorna como JSON para o React, que atualiza a tela.

---

## PARTE 5 - Enums (Valores Fixos)

O projeto usa 3 enums para padronizar valores que possuem opcoes fixas:

### StatusMatricula
```java
public enum StatusMatricula {
    ATIVA,       // Matricula vigente
    CANCELADA,   // Matricula cancelada pelo aluno
    EXPIRADA     // Matricula vencida (passou da data_fim)
}
```
Salvo no banco como texto (`@Enumerated(EnumType.STRING)`).

### NivelTreino
```java
public enum NivelTreino {
    INICIANTE("Iniciante"),
    INTERMEDIARIO("Intermediario"),
    AVANCADO("Avancado");
}
```
Usa converter customizado (`NivelTreinoConverter`) para salvar "Iniciante" ao inves de "INICIANTE" no banco.

### GrupoMuscular
```java
public enum GrupoMuscular {
    PEITORAL("Peitoral"),
    COSTAS("Costas"),
    // ... 14 valores no total
}
```
Tambem usa converter customizado para salvar o texto amigavel.

---

## PARTE 6 - Seguranca e Autenticacao

### Como funciona o login:

1. Usuario digita login e senha no React
2. React envia `POST /api/auth/login` com as credenciais
3. O `AuthResource` recebe, aplica hash SHA-256 na senha enviada
4. Compara com o hash salvo no banco de dados
5. Se bater, gera um **token JWT** com validade de 8 horas
6. React armazena o token no `localStorage`
7. Todas as proximas requisicoes incluem o token no header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
   ```
8. O `AuthFilter` valida o token em cada requisicao protegida

### Fluxo visual:

```
[Login] -> POST /api/auth/login {login, senha}
                    |
          Senha OK? -> Gera JWT -> Retorna token
                    |
          Senha errada? -> Retorna 401 (Nao autorizado)

[Todas as outras rotas]:
    Header tem JWT valido? -> Permite acesso
    Header sem JWT ou invalido? -> Retorna 401
```

---

## PARTE 7 - Configuracao do Banco (persistence.xml)

O arquivo `persistence.xml` configura toda a conexao com o MySQL:

```xml
<persistence-unit name="academiaPU">
    <!-- Provedor JPA -->
    <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>

    <!-- Todas as entidades registradas -->
    <class>model.Aluno</class>
    <class>model.Plano</class>
    <class>model.Matricula</class>
    <class>model.Treino</class>
    <class>model.Exercicio</class>
    <class>model.TreinoExercicio</class>
    <class>model.Usuario</class>

    <properties>
        <!-- Conexao MySQL -->
        <property name="javax.persistence.jdbc.url"
                  value="jdbc:mysql://localhost:3306/academia_db"/>
        <property name="javax.persistence.jdbc.user" value="root"/>
        <property name="javax.persistence.jdbc.password" value=""/>

        <!-- Dialeto SQL para MySQL 8 -->
        <property name="hibernate.dialect"
                  value="org.hibernate.dialect.MySQL8Dialect"/>

        <!-- CRIA/ATUALIZA tabelas automaticamente -->
        <property name="hibernate.hbm2ddl.auto" value="update"/>
    </properties>
</persistence-unit>
```

### O que cada propriedade faz:

| Propriedade                  | Valor                    | Funcao                                        |
|------------------------------|--------------------------|-----------------------------------------------|
| jdbc.url                     | localhost:3306/academia_db | Endereco do banco MySQL                      |
| jdbc.user                    | root                     | Usuario do MySQL                              |
| jdbc.password                | (vazio)                  | Senha do MySQL                                |
| hibernate.dialect            | MySQL8Dialect            | Gera SQL compativel com MySQL 8               |
| hibernate.hbm2ddl.auto       | update                   | Cria tabelas novas e adiciona colunas novas   |
| hibernate.show_sql           | true                     | Exibe os SQLs gerados no console (debug)      |

---

## Conclusao

O projeto AcademiaFit foi construido seguindo boas praticas de desenvolvimento:

1. **Separacao de responsabilidades**: cada camada (model, dao, service, rest) tem uma funcao clara
2. **Mapeamento ORM**: as tabelas sao definidas como classes Java com anotacoes JPA, sem necessidade de SQL manual
3. **Relacionamentos bem definidos**: chaves estrangeiras e cascatas configuradas via anotacoes
4. **Validacoes**: tanto no backend (Bean Validation) quanto no frontend (formularios React)
5. **Seguranca**: autenticacao JWT, senhas com hash SHA-256, filtro CORS
6. **Calculos automaticos**: data de termino da matricula calculada via `@PrePersist`
7. **Enums tipados**: valores fixos (status, nivel, grupo muscular) com conversores customizados

As 7 tabelas do banco cobrem todo o dominio de uma academia:
- **aluno** e **usuario**: pessoas do sistema
- **plano** e **matricula**: gestao financeira e de assinaturas
- **treino**, **exercicio** e **treino_exercicio**: gestao de fichas de treino
