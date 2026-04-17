# Analise Estrutural - AcademiaFit

## Documento explicativo passo a passo: Frontend React + Backend Java

---

## 1. Visao Geral da Arquitetura

O AcademiaFit e um sistema fullstack dividido em duas aplicacoes independentes que se comunicam via HTTP/JSON:

```
+-------------------+         HTTP/JSON          +-------------------+         SQL          +----------+
|                   |  ----------------------->  |                   |  -----------------> |          |
|  FRONTEND (React) |    Axios + JWT Token       |  BACKEND (Java)   |    Hibernate/JPA    |  MySQL   |
|  Porta 3000       |  <-----------------------  |  Porta 8080       |  <----------------- |  3306    |
|                   |       JSON Response        |                   |      Resultados     |          |
+-------------------+                            +-------------------+                     +----------+
```

**Principio fundamental**: O React NUNCA acessa o banco de dados diretamente. Toda comunicacao passa pelo Java, que funciona como intermediario (API REST).

---

## 2. Estrutura Completa de Pastas

```
ProjetoRenomado/
|
|-- pom.xml                                  # Configuracao Maven (dependencias Java)
|
|-- src/main/java/                           # === BACKEND JAVA ===
|   |-- model/                               # Camada 1: Entidades (tabelas do banco)
|   |   |-- Aluno.java                       #   Aluno da academia
|   |   |-- Plano.java                       #   Plano de assinatura
|   |   |-- Matricula.java                   #   Vinculo aluno + plano
|   |   |-- Treino.java                      #   Programa de treino
|   |   |-- Exercicio.java                   #   Exercicio individual
|   |   |-- TreinoExercicio.java             #   Relacao treino-exercicio
|   |   |-- TreinoExercicioId.java           #   Chave composta da relacao
|   |   |-- Usuario.java                     #   Usuario do sistema (admin)
|   |   |-- StatusMatricula.java             #   Enum: ATIVA, CANCELADA, EXPIRADA
|   |   |-- NivelTreino.java                 #   Enum: INICIANTE, INTERMEDIARIO, AVANCADO
|   |   |-- GrupoMuscular.java              #   Enum: PEITORAL, COSTAS, BICEPS, etc.
|   |
|   |-- dao/                                 # Camada 2: Acesso ao banco de dados
|   |   |-- GenericDAO.java                  #   DAO generico com CRUD basico
|   |   |-- AlunoDAO.java                   #   Consultas especificas de aluno
|   |   |-- PlanoDAO.java                   #   Consultas de plano
|   |   |-- MatriculaDAO.java              #   Consultas de matricula
|   |   |-- TreinoDAO.java                 #   Consultas de treino
|   |   |-- ExercicioDAO.java              #   Consultas de exercicio
|   |   |-- TreinoExercicioDAO.java        #   Consultas treino-exercicio
|   |   |-- UsuarioDAO.java               #   Consultas de usuario
|   |
|   |-- service/                             # Camada 3: Regras de negocio
|   |   |-- AlunoService.java
|   |   |-- PlanoService.java
|   |   |-- MatriculaService.java
|   |   |-- TreinoService.java
|   |   |-- ExercicioService.java
|   |   |-- TreinoExercicioService.java
|   |   |-- UsuarioService.java
|   |
|   |-- rest/                                # Camada 4: Endpoints REST (controllers)
|   |   |-- RestApplication.java             #   Registra o caminho base /api
|   |   |-- AuthResource.java               #   POST /api/auth/login
|   |   |-- AlunoResource.java              #   CRUD /api/alunos
|   |   |-- PlanoResource.java              #   CRUD /api/planos
|   |   |-- MatriculaResource.java          #   CRUD /api/matriculas
|   |   |-- TreinoResource.java             #   CRUD /api/treinos
|   |   |-- ExercicioResource.java          #   CRUD /api/exercicios
|   |   |-- UsuarioResource.java            #   CRUD /api/usuarios
|   |   |-- DashboardResource.java          #   GET /api/dashboard
|   |   |-- AuthFilter.java                 #   Filtro: valida JWT em cada requisicao
|   |   |-- CorsFilter.java                 #   Filtro: libera requisicoes do React
|   |   |-- dto/                             #   Objetos de transferencia
|   |       |-- LoginRequest.java            #     {login, senha}
|   |       |-- LoginResponse.java           #     {token, nome, login}
|   |       |-- ErrorResponse.java           #     {message}
|   |       |-- DashboardResponse.java       #     {totais e estatisticas}
|   |
|   |-- util/                                # Utilitarios
|       |-- JPAUtil.java                     #   Fabrica de EntityManager (conexao BD)
|       |-- JwtUtil.java                     #   Gerar e validar tokens JWT
|       |-- AppInitializer.java              #   Cria usuario admin na inicializacao
|
|-- src/main/resources/
|   |-- META-INF/persistence.xml             # Config do banco (URL, usuario, senha)
|
|-- src/main/webapp/WEB-INF/
|   |-- web.xml                              # Config do servlet container
|
|-- frontend/                                # === FRONTEND REACT ===
|   |-- package.json                         # Dependencias Node (React, Axios, etc.)
|   |-- public/
|   |   |-- index.html                       # HTML raiz com <div id="root">
|   |
|   |-- src/
|   |   |-- index.js                         # Ponto de entrada: renderiza <App/>
|   |   |-- App.js                           # Rotas e estrutura principal
|   |   |-- App.css                          # Estilos globais
|   |   |
|   |   |-- services/
|   |   |   |-- api.js                       # Axios configurado (URL base + interceptors)
|   |   |
|   |   |-- context/
|   |   |   |-- AuthContext.js               # Gerencia login/logout/token
|   |   |
|   |   |-- components/
|   |   |   |-- Layout.js                    # Header + menu + footer (estrutura visual)
|   |   |   |-- Toast.js                     # Notificacoes (sucesso/erro)
|   |   |   |-- Loading.js                   # Spinner de carregamento
|   |   |   |-- ConfirmDialog.js             # Modal de confirmacao (excluir)
|   |   |
|   |   |-- pages/
|   |   |   |-- Login.js                     # Tela de login
|   |   |   |-- Dashboard.js                 # Painel com estatisticas
|   |   |   |-- Alunos.js                    # Cadastro/listagem de alunos
|   |   |   |-- Planos.js                    # Cadastro/listagem de planos
|   |   |   |-- Matriculas.js               # Cadastro/listagem de matriculas
|   |   |   |-- Exercicios.js               # Cadastro/listagem de exercicios
|   |   |   |-- Treinos.js                  # Cadastro/listagem de treinos
|   |   |   |-- Usuarios.js                 # Gerenciamento de usuarios
|   |   |
|   |   |-- utils/
|   |       |-- masks.js                     # Mascaras CPF, telefone, validacao
|   |
|   |-- build/                               # Versao compilada para producao
```

---

## 3. Como o Frontend (React) Funciona - Passo a Passo

### 3.1 Ponto de Entrada

Tudo comeca no arquivo `frontend/src/index.js`:

```javascript
// index.js - Ponto de entrada da aplicacao
import App from './App';
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

Ele renderiza o componente `<App />` dentro da `<div id="root">` que esta no `public/index.html`.

### 3.2 Roteamento (App.js)

O `App.js` define TODAS as rotas da aplicacao:

```
/login        -> Login.js         (publica - qualquer um acessa)
/             -> Dashboard.js     (protegida - precisa estar logado)
/alunos       -> Alunos.js        (protegida)
/planos       -> Planos.js        (protegida)
/matriculas   -> Matriculas.js    (protegida)
/exercicios   -> Exercicios.js    (protegida)
/treinos      -> Treinos.js       (protegida)
/usuarios     -> Usuarios.js      (protegida)
```

Rotas protegidas usam o componente `PrivateRoute`, que verifica se o usuario esta logado (tem token). Se nao estiver, redireciona para `/login`.

### 3.3 Autenticacao (AuthContext.js)

O `AuthContext` e um contexto React que gerencia o estado de autenticacao globalmente:

```
1. Usuario digita login e senha na tela Login.js
2. React envia POST para /api/auth/login com {login, senha}
3. Java valida as credenciais e retorna {token, nome, login}
4. React salva o token no localStorage do navegador
5. Todas as proximas requisicoes incluem esse token no header
6. Se o token expirar (8 horas), o Java retorna 401
7. O interceptor do Axios detecta o 401, limpa o localStorage e redireciona para /login
```

### 3.4 Comunicacao com o Backend (api.js)

O arquivo `services/api.js` e o CORACAO da conexao frontend-backend:

```javascript
// Cria instancia do Axios apontando para o Java
const api = axios.create({
    baseURL: 'http://localhost:8080/academia/api'
});

// INTERCEPTOR DE REQUEST: adiciona o token JWT automaticamente
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// INTERCEPTOR DE RESPONSE: trata erros 401 (nao autorizado)
api.interceptors.response.use(
    response => response,          // sucesso: retorna normalmente
    error => {
        if (error.response?.status === 401) {
            localStorage.clear();  // limpa dados do usuario
            window.location = '/login';  // redireciona para login
        }
        return Promise.reject(error);
    }
);
```

**Como cada pagina usa o api.js**:
```javascript
// Em Alunos.js, por exemplo:
import api from '../services/api';

// Listar alunos
const response = await api.get('/alunos');

// Criar aluno
await api.post('/alunos', { nome: 'Joao', cpf: '123.456.789-00', ... });

// Atualizar aluno
await api.put(`/alunos/${id}`, dadosAtualizados);

// Excluir aluno
await api.delete(`/alunos/${id}`);
```

### 3.5 Estrutura Visual (Layout.js)

Todas as paginas protegidas sao envolvidas pelo componente `Layout`, que fornece:

```
+------------------------------------------------------+
|  HEADER: Logo "AcademiaFit" | Nome do usuario | Sair |
+------------------------------------------------------+
|  MENU: Dashboard | Alunos | Planos | Matriculas |    |
|        Exercicios | Treinos | Usuarios               |
+------------------------------------------------------+
|                                                      |
|              CONTEUDO DA PAGINA                      |
|         (renderizado por cada page/*.js)             |
|                                                      |
+------------------------------------------------------+
|  FOOTER: AcademiaFit 2025                            |
+------------------------------------------------------+
```

### 3.6 Componentes Reutilizaveis

| Componente      | O que faz                                              |
|-----------------|--------------------------------------------------------|
| Layout.js       | Estrutura visual (header, menu, footer)                |
| Toast.js        | Exibe mensagens de sucesso (verde) ou erro (vermelho)  |
| Loading.js      | Spinner animado enquanto dados carregam                |
| ConfirmDialog.js| Modal "Tem certeza?" antes de excluir algo             |

### 3.7 Utilitarios (masks.js)

Funcoes auxiliares para formatacao de dados no formulario:

- `maskCPF("12345678900")` -> `"123.456.789-00"`
- `maskPhone("11999998888")` -> `"(11) 99999-8888"`
- `validateCPF("123.456.789-00")` -> `true/false`

---

## 4. Como o Backend (Java) Funciona - Passo a Passo

### 4.1 Arquitetura em Camadas

O backend segue o padrao classico de camadas:

```
Requisicao HTTP
      |
      v
+------------------+
| REST (Resource)  |  Camada 4: Recebe HTTP, converte JSON, retorna resposta
+------------------+
      |
      v
+------------------+
| SERVICE          |  Camada 3: Regras de negocio e validacoes
+------------------+
      |
      v
+------------------+
| DAO              |  Camada 2: Acessa o banco de dados via JPA/Hibernate
+------------------+
      |
      v
+------------------+
| MODEL            |  Camada 1: Entidades JPA (representam tabelas)
+------------------+
      |
      v
   [MySQL]
```

### 4.2 Camada MODEL - Entidades

Cada classe em `model/` representa uma tabela no MySQL. O Hibernate cria as tabelas automaticamente.

**Entidades e seus relacionamentos**:

```
Usuario (usuarios do sistema - login)
   |
   |  (sem relacionamento direto com outras entidades)

Aluno ----< Matricula >---- Plano
  |            |
  |  1:N       |  N:1
  |            |
  | Um aluno pode ter varias matriculas
  | Cada matricula pertence a um plano

Treino ----< TreinoExercicio >---- Exercicio
  |              |
  |  1:N         |  N:1
  |              |
  | Um treino contem varios exercicios
  | Um exercicio pode estar em varios treinos
```

**Exemplo de entidade (Aluno.java)**:
```java
@Entity  // Indica que e uma tabela no banco
public class Aluno {
    @Id @GeneratedValue  // Chave primaria auto-incremento
    private Long idAluno;

    @NotBlank  // Validacao: nao pode ser vazio
    private String nome;

    @Pattern(regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}")  // Formato CPF
    private String cpf;

    @Email  // Validacao de email
    private String email;

    private String telefone;

    @Past  // Deve ser data no passado
    private LocalDate dataNascimento;

    @OneToMany(mappedBy = "aluno")  // Um aluno tem varias matriculas
    private List<Matricula> matriculas;
}
```

### 4.3 Camada DAO - Acesso ao Banco

O `GenericDAO<T>` fornece operacoes CRUD basicas que todos os DAOs herdam:

```java
public class GenericDAO<T> {
    // Metodos herdados por todos:
    salvar(entidade)           // INSERT no banco
    atualizar(entidade)        // UPDATE no banco
    remover(entidade)          // DELETE no banco
    buscarPorId(id)            // SELECT por ID
    buscarTodos()              // SELECT * (todos)
    buscarPaginado(pagina, qtd) // SELECT com LIMIT/OFFSET
    contarTodos()              // COUNT(*)

    // Gerenciamento de transacao:
    executarDentroTransacao(acao)  // Abre transacao, executa, faz commit
}
```

**DAOs especificos** adicionam consultas proprias:
- `AlunoDAO.buscarPorNome(nome)` - Busca alunos com filtro
- `UsuarioDAO.buscarPorLogin(login)` - Busca por login
- `MatriculaDAO.buscarPorAluno(idAluno)` - Matriculas de um aluno

### 4.4 Camada SERVICE - Regras de Negocio

Cada Service encapsula um DAO e adiciona logica de negocio:

```java
public class AlunoService {
    private AlunoDAO dao = new AlunoDAO();

    public Aluno salvar(Aluno aluno) {
        return dao.salvar(aluno);  // Delega ao DAO
    }

    public List<Aluno> listarTodos() {
        return dao.buscarTodos();
    }

    public List<Aluno> buscarPorNome(String nome) {
        return dao.buscarPorNome(nome);
    }
    // ... demais metodos
}
```

### 4.5 Camada REST - Endpoints (Controllers)

Cada Resource expoe endpoints HTTP que o React consome:

```java
@Path("/alunos")           // URL base: /api/alunos
@Produces(APPLICATION_JSON)
@Consumes(APPLICATION_JSON)
public class AlunoResource {

    private AlunoService service = new AlunoService();

    @GET                   // GET /api/alunos ou GET /api/alunos?nome=Joao
    public Response listar(@QueryParam("nome") String nome) {
        List<Aluno> alunos;
        if (nome != null) {
            alunos = service.buscarPorNome(nome);
        } else {
            alunos = service.listarTodos();
        }
        return Response.ok(alunos).build();
    }

    @POST                  // POST /api/alunos (body: JSON do aluno)
    public Response criar(Aluno aluno) {
        Aluno salvo = service.salvar(aluno);
        return Response.status(201).entity(salvo).build();
    }

    @PUT @Path("/{id}")    // PUT /api/alunos/5
    public Response atualizar(@PathParam("id") Long id, Aluno aluno) {
        aluno.setIdAluno(id);
        Aluno atualizado = service.atualizar(aluno);
        return Response.ok(atualizado).build();
    }

    @DELETE @Path("/{id}") // DELETE /api/alunos/5
    public Response excluir(@PathParam("id") Long id) {
        service.excluir(id);
        return Response.noContent().build();
    }
}
```

### 4.6 Filtros de Seguranca

Antes de qualquer requisicao chegar no Resource, ela passa por dois filtros:

```
Requisicao do React
       |
       v
+------------------+
| CorsFilter       |  1. Verifica se a origem (localhost:3000) e permitida
+------------------+     Adiciona headers Access-Control-Allow-*
       |
       v
+------------------+
| AuthFilter       |  2. Verifica se o token JWT e valido
+------------------+     Excecao: /auth/login nao precisa de token
       |
       v
+------------------+
| Resource         |  3. So chega aqui se passou pelos dois filtros
+------------------+
```

**CorsFilter**: Necessario porque React (porta 3000) e Java (porta 8080) estao em origens diferentes. Sem esse filtro, o navegador bloquearia as requisicoes.

**AuthFilter**: Extrai o token do header `Authorization: Bearer xxx`, valida com JwtUtil. Se invalido, retorna 401 e a requisicao para ali.

---

## 5. Tabela Completa de Endpoints da API

| Metodo | URL                                    | Descricao                      | Corpo (JSON)          |
|--------|----------------------------------------|--------------------------------|-----------------------|
| POST   | /api/auth/login                        | Fazer login                    | {login, senha}        |
| GET    | /api/dashboard                         | Estatisticas do sistema        | -                     |
| GET    | /api/alunos                            | Listar alunos                  | -                     |
| GET    | /api/alunos?nome=X                     | Buscar alunos por nome         | -                     |
| GET    | /api/alunos/{id}                       | Buscar aluno por ID            | -                     |
| POST   | /api/alunos                            | Cadastrar aluno                | {nome, cpf, email...} |
| PUT    | /api/alunos/{id}                       | Atualizar aluno                | {nome, cpf, email...} |
| DELETE | /api/alunos/{id}                       | Excluir aluno                  | -                     |
| GET    | /api/planos                            | Listar planos                  | -                     |
| GET    | /api/planos/{id}                       | Buscar plano por ID            | -                     |
| POST   | /api/planos                            | Cadastrar plano                | {nome, valor, ...}    |
| PUT    | /api/planos/{id}                       | Atualizar plano                | {nome, valor, ...}    |
| DELETE | /api/planos/{id}                       | Excluir plano                  | -                     |
| GET    | /api/matriculas                        | Listar matriculas              | -                     |
| GET    | /api/matriculas?idAluno=X              | Matriculas de um aluno         | -                     |
| POST   | /api/matriculas                        | Criar matricula                | {aluno, plano, ...}   |
| PUT    | /api/matriculas/{id}                   | Atualizar matricula            | {status, ...}         |
| DELETE | /api/matriculas/{id}                   | Excluir matricula              | -                     |
| GET    | /api/exercicios                        | Listar exercicios              | -                     |
| GET    | /api/exercicios/{id}                   | Buscar exercicio por ID        | -                     |
| GET    | /api/exercicios/grupos-musculares      | Listar grupos musculares       | -                     |
| POST   | /api/exercicios                        | Cadastrar exercicio            | {nome, grupo, ...}    |
| PUT    | /api/exercicios/{id}                   | Atualizar exercicio            | {nome, grupo, ...}    |
| DELETE | /api/exercicios/{id}                   | Excluir exercicio              | -                     |
| GET    | /api/treinos                           | Listar treinos                 | -                     |
| GET    | /api/treinos/{id}                      | Buscar treino por ID           | -                     |
| GET    | /api/treinos/niveis                    | Listar niveis de treino        | -                     |
| POST   | /api/treinos                           | Cadastrar treino               | {nome, nivel, ...}    |
| PUT    | /api/treinos/{id}                      | Atualizar treino               | {nome, nivel, ...}    |
| DELETE | /api/treinos/{id}                      | Excluir treino                 | -                     |
| GET    | /api/treinos/{id}/exercicios           | Exercicios de um treino        | -                     |
| POST   | /api/treinos/{id}/exercicios           | Adicionar exercicio ao treino  | {idExercicio}         |
| DELETE | /api/treinos/{idT}/exercicios/{idE}    | Remover exercicio do treino    | -                     |
| GET    | /api/usuarios                          | Listar usuarios                | -                     |
| POST   | /api/usuarios                          | Criar usuario                  | {nome, login, senha}  |
| PUT    | /api/usuarios/{id}                     | Atualizar usuario              | {nome, login, ...}    |
| PUT    | /api/usuarios/{id}/toggle              | Ativar/desativar usuario       | -                     |

---

## 6. Fluxo Completo Detalhado: Cadastrar um Aluno

Exemplo pratico de como todas as camadas interagem:

```
PASSO 1 - USUARIO
    O usuario acessa http://localhost:3000/alunos no navegador
    Preenche: Nome="Maria", CPF="123.456.789-00", Email="maria@email.com"
    Clica no botao "Salvar"

PASSO 2 - REACT (Alunos.js)
    A funcao handleSubmit() e chamada
    Aplica mascaras (maskCPF, maskPhone)
    Chama: api.post('/alunos', { nome: "Maria", cpf: "123.456.789-00", ... })

PASSO 3 - AXIOS (api.js)
    O interceptor de request adiciona o header:
    Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
    Envia: POST http://localhost:8080/academia/api/alunos

PASSO 4 - CORSFILTER (CorsFilter.java)
    Verifica que a origem e http://localhost:3000 -> PERMITIDA
    Adiciona headers CORS na resposta
    Passa a requisicao adiante

PASSO 5 - AUTHFILTER (AuthFilter.java)
    Extrai o token do header Authorization
    Chama JwtUtil.validarToken(token) -> Token VALIDO
    Passa a requisicao adiante

PASSO 6 - ALUNORESOURCE (AlunoResource.java)
    Metodo criar(@Valid Aluno aluno) e chamado
    Jersey converte o JSON automaticamente para objeto Aluno
    Bean Validation verifica: @NotBlank, @Pattern, @Email -> VALIDO
    Chama alunoService.salvar(aluno)

PASSO 7 - ALUNOSERVICE (AlunoService.java)
    Recebe o objeto Aluno
    Delega para alunoDAO.salvar(aluno)

PASSO 8 - ALUNODAO > GENERICDAO (GenericDAO.java)
    Abre uma transacao JPA
    Chama entityManager.persist(aluno)
    Hibernate gera: INSERT INTO Aluno (nome, cpf, email, ...) VALUES (...)
    Faz commit da transacao
    Retorna o aluno com ID gerado

PASSO 9 - RESPONSE
    AlunoResource retorna Response.status(201).entity(alunoSalvo)
    Jersey converte o objeto Aluno de volta para JSON
    HTTP Response: 201 Created + { "idAluno": 15, "nome": "Maria", ... }

PASSO 10 - REACT (Alunos.js)
    Recebe a resposta com sucesso
    Atualiza a lista de alunos na tela (re-fetch)
    Exibe Toast verde: "Aluno cadastrado com sucesso!"
    Limpa o formulario
```

---

## 7. Fluxo de Autenticacao (Login)

```
1. Usuario acessa http://localhost:3000 -> Redireciona para /login (nao tem token)

2. Digita: usuario="admin", senha="admin123" -> Clica "Entrar"

3. React envia POST /api/auth/login com { login: "admin", senha: "admin123" }
   (AuthFilter IGNORA essa rota - nao exige token)

4. AuthResource recebe a requisicao
   -> UsuarioService.buscarPorLogin("admin") encontra o usuario
   -> Compara a senha (texto plano)
   -> Verifica se usuario esta ativo
   -> JwtUtil.gerarToken(id, nome, login) cria token com validade de 8 horas
   -> Retorna { token: "eyJ...", nome: "Admin", login: "admin" }

5. React (AuthContext) recebe a resposta
   -> localStorage.setItem('token', 'eyJ...')
   -> localStorage.setItem('usuario', '{"nome":"Admin","login":"admin"}')
   -> Atualiza estado: isLogado = true

6. React redireciona para / (Dashboard)

7. Dashboard carrega e faz GET /api/dashboard
   -> Axios interceptor adiciona: Authorization: Bearer eyJ...
   -> AuthFilter valida o token -> OK
   -> DashboardResource retorna estatisticas

8. Apos 8 horas, o token expira
   -> Qualquer requisicao retorna 401
   -> Axios interceptor detecta 401
   -> Limpa localStorage, redireciona para /login
```

---

## 8. Banco de Dados - Estrutura das Tabelas

O Hibernate cria automaticamente as tabelas com base nas entidades (ddl-auto=update):

```sql
-- Tabelas criadas automaticamente:

Aluno (idAluno, nome, cpf, email, telefone, dataNascimento)
Plano (idPlano, nome, valor, duracaoDias, descricao)
Matricula (idMatricula, dataInicio, dataFim, status, aluno_id, plano_id)
Treino (idTreino, nome, objetivo, nivel)
Exercicio (idExercicio, nome, grupoMuscular, descricao)
TreinoExercicio (idTreino, idExercicio)  -- tabela de relacionamento N:N
Usuario (idUsuario, nome, login, senha, ativo)
```

**Configuracao** em `persistence.xml`:
- URL: `jdbc:mysql://localhost:3306/academia_db`
- Usuario: `root` (sem senha)
- Pool: minimo 5 conexoes, maximo 20 (HikariCP)

---

## 9. Tecnologias e Suas Funcoes

### Backend

| Tecnologia        | Versao  | Funcao                                            |
|-------------------|---------|---------------------------------------------------|
| Java              | 11      | Linguagem principal do backend                    |
| Jersey (JAX-RS)   | 2.41    | Framework REST (receber/responder HTTP)           |
| Hibernate (JPA)   | 5.6.15  | ORM - mapeia objetos Java para tabelas MySQL      |
| HikariCP          | 5.0.1   | Pool de conexoes com o banco (performance)        |
| JJWT              | 0.11.5  | Gerar e validar tokens JWT (autenticacao)         |
| Jackson           | 2.15    | Converter objetos Java <-> JSON automaticamente   |
| Hibernate Valid.   | 6.2.5   | Validar dados (@NotBlank, @Email, @Pattern, etc.) |
| MySQL Connector   | 8.0.33  | Driver de conexao com MySQL                       |
| Maven             | -       | Gerenciador de dependencias e build               |

### Frontend

| Tecnologia        | Versao  | Funcao                                            |
|-------------------|---------|---------------------------------------------------|
| React             | 19.2.5  | Biblioteca para construir a interface             |
| React Router DOM  | 6.30.1  | Navegacao entre paginas (SPA)                     |
| Axios             | 1.13.6  | Cliente HTTP para chamar a API Java               |
| Create React App  | 5.0.1   | Ferramenta de build (Webpack, Babel, etc.)        |

### Infraestrutura

| Tecnologia  | Funcao                                     |
|-------------|--------------------------------------------|
| MySQL 8     | Banco de dados relacional                  |
| Tomcat 9    | Servidor de aplicacao Java (roda o WAR)    |
| Node.js     | Runtime para o servidor de dev do React    |

---

## 10. Como Executar o Projeto

### Pre-requisitos
- Java 11+ instalado
- MySQL 8 instalado e rodando
- Node.js 18+ instalado
- Maven instalado (ou usar IDE como Eclipse)
- Tomcat 9 configurado

### Passo a passo

```bash
# 1. Criar o banco de dados no MySQL
mysql -u root -e "CREATE DATABASE academia_db"

# 2. Compilar e deployar o backend
mvn clean install
# Copiar target/academia-api.war para a pasta webapps/ do Tomcat
# Ou: no Eclipse, clicar com botao direito -> Run As -> Run on Server

# 3. Instalar dependencias e rodar o frontend
cd frontend
npm install
npm start

# 4. Acessar no navegador
# http://localhost:3000
# Login: admin / admin123
```

### Portas utilizadas

| Servico   | Porta | URL                                    |
|-----------|-------|----------------------------------------|
| React     | 3000  | http://localhost:3000                   |
| Tomcat    | 8080  | http://localhost:8080/academia          |
| API REST  | 8080  | http://localhost:8080/academia/api      |
| MySQL     | 3306  | localhost:3306/academia_db              |

---

## 11. Resumo Visual da Conexao Frontend-Backend

```
+------------------------------------------------------------------+
|                        NAVEGADOR                                  |
|                                                                   |
|  React App (localhost:3000)                                       |
|  +------------------------------------------------------------+  |
|  |  App.js (Rotas)                                             |  |
|  |    |                                                        |  |
|  |    +-> Pages (Alunos.js, Planos.js, ...)                   |  |
|  |          |                                                  |  |
|  |          +-> api.js (Axios)                                 |  |
|  |                |                                            |  |
|  |          [Adiciona token JWT no header]                     |  |
|  +------------|-----------------------------------------------+  |
|               |                                                   |
+---------------|---------------------------------------------------+
                | HTTP Request (JSON)
                v
+------------------------------------------------------------------+
|                     TOMCAT (localhost:8080)                        |
|                                                                   |
|  academia-api.war                                                 |
|  +------------------------------------------------------------+  |
|  |  CorsFilter -> AuthFilter -> Resource                       |  |
|  |                                 |                           |  |
|  |                            Service                          |  |
|  |                                 |                           |  |
|  |                              DAO                            |  |
|  |                                 |                           |  |
|  |                      Hibernate/JPA                          |  |
|  +----------------------------|-------------------------------+  |
|                                |                                  |
+--------------------------------|----------------------------------+
                                 | SQL
                                 v
                        +------------------+
                        |  MySQL (3306)    |
                        |  academia_db     |
                        +------------------+
```

---

*Documento gerado em 15/04/2026 - Analise estrutural do projeto AcademiaFit*
