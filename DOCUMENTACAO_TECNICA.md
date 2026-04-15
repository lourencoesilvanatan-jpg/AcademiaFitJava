# Documentacao Tecnica - AcademiaFit
## Integracao Java (Backend) + React (Frontend)

---

## 1. Visao Geral da Arquitetura

O sistema AcademiaFit utiliza uma arquitetura **cliente-servidor** separada em dois projetos independentes que se comunicam via **API REST (HTTP/JSON)**.

```
+---------------------+         HTTP/JSON          +---------------------+
|                     |  <--------------------->   |                     |
|   FRONTEND (React)  |    GET, POST, PUT, DELETE  |   BACKEND (Java)    |
|   Porta 3000        |                            |   Porta 8080        |
|                     |    Authorization: Bearer   |                     |
+---------------------+         JWT Token          +---------------------+
        |                                                   |
        |                                                   |
   Navegador                                           MySQL 3306
   do Usuario                                        (academia_db)
```

**Frontend (React):** Interface do usuario, roda no navegador na porta 3000.
**Backend (Java/Jersey):** API REST, roda no Apache Tomcat na porta 8080.
**Banco de Dados:** MySQL, porta 3306.

A conexao entre os dois **nao e direta** - o React faz chamadas HTTP para os endpoints REST do Java, que processa a logica e retorna dados em formato JSON.

---

## 2. Estrutura de Pastas do Projeto

```
ProjetoRenomado/
|
|-- pom.xml                          # Configuracao Maven (dependencias Java)
|
|-- src/main/java/                   # CODIGO JAVA (Backend)
|   |-- dao/                         # Camada de Acesso a Dados
|   |   |-- GenericDAO.java          #   DAO generico com CRUD base
|   |   |-- AlunoDAO.java           #   Consultas especificas de Aluno
|   |   |-- PlanoDAO.java
|   |   |-- MatriculaDAO.java
|   |   |-- TreinoDAO.java
|   |   |-- ExercicioDAO.java
|   |   |-- TreinoExercicioDAO.java
|   |   |-- UsuarioDAO.java
|   |
|   |-- model/                       # Entidades JPA (tabelas do banco)
|   |   |-- Aluno.java               #   @Entity - mapeada para tabela "aluno"
|   |   |-- Plano.java
|   |   |-- Matricula.java
|   |   |-- Treino.java
|   |   |-- Exercicio.java
|   |   |-- TreinoExercicio.java     #   Tabela associativa treino-exercicio
|   |   |-- TreinoExercicioId.java   #   Chave composta
|   |   |-- Usuario.java
|   |   |-- GrupoMuscular.java       #   Enum (PEITORAL, COSTAS, etc.)
|   |   |-- NivelTreino.java         #   Enum (INICIANTE, INTERMEDIARIO, AVANCADO)
|   |   |-- StatusMatricula.java     #   Enum (ATIVA, CANCELADA, EXPIRADA)
|   |   |-- GrupoMuscularConverter.java  # Conversor JPA para enum
|   |   |-- NivelTreinoConverter.java
|   |
|   |-- service/                     # Camada de Logica de Negocio
|   |   |-- AlunoService.java
|   |   |-- PlanoService.java
|   |   |-- MatriculaService.java    #   Calcula data fim automaticamente
|   |   |-- TreinoService.java
|   |   |-- ExercicioService.java
|   |   |-- TreinoExercicioService.java
|   |   |-- UsuarioService.java      #   Hash SHA-256 de senhas
|   |
|   |-- rest/                        # Endpoints REST (Controllers)
|   |   |-- RestApplication.java     #   @ApplicationPath("/api")
|   |   |-- AuthResource.java        #   POST /api/auth/login
|   |   |-- AlunoResource.java       #   CRUD /api/alunos
|   |   |-- PlanoResource.java       #   CRUD /api/planos
|   |   |-- MatriculaResource.java   #   CRUD /api/matriculas
|   |   |-- TreinoResource.java      #   CRUD /api/treinos + exercicios
|   |   |-- ExercicioResource.java   #   CRUD /api/exercicios
|   |   |-- DashboardResource.java   #   GET  /api/dashboard
|   |   |-- UsuarioResource.java     #   CRUD /api/usuarios
|   |   |-- CorsFilter.java          #   Filtro CORS (permite requisicoes do React)
|   |   |-- AuthFilter.java          #   Filtro JWT (protege endpoints)
|   |   |-- JacksonConfig.java       #   Configuracao JSON (datas, enums)
|   |   |-- dto/                     #   Objetos de transferencia
|   |       |-- LoginRequest.java
|   |       |-- LoginResponse.java
|   |       |-- DashboardResponse.java
|   |       |-- ErrorResponse.java
|   |
|   |-- util/                        # Utilitarios
|       |-- JPAUtil.java             #   Fabrica de EntityManager
|       |-- JwtUtil.java             #   Gerar/validar tokens JWT
|       |-- AppInitializer.java      #   Cria usuario admin no startup
|
|-- src/main/resources/
|   |-- META-INF/
|       |-- persistence.xml          # Config JPA/Hibernate (conexao MySQL)
|
|-- src/main/webapp/
|   |-- WEB-INF/
|       |-- web.xml                  # Config minima do servlet container
|
|-- frontend/                        # CODIGO REACT (Frontend)
    |-- package.json                 # Dependencias NPM (React, Axios, etc.)
    |-- public/
    |   |-- index.html               # HTML base (div id="root")
    |
    |-- src/
        |-- index.js                 # Ponto de entrada React
        |-- App.js                   # Rotas da aplicacao (React Router)
        |-- App.css                  # Estilos globais (1300+ linhas)
        |
        |-- context/
        |   |-- AuthContext.js       # Contexto de autenticacao (login/logout)
        |
        |-- services/
        |   |-- api.js               # Instancia Axios (baseURL + interceptors)
        |
        |-- components/
        |   |-- Layout.js            # Header + Nav + Footer
        |   |-- Loading.js           # Spinner de carregamento
        |   |-- Toast.js             # Notificacoes flutuantes
        |   |-- ConfirmDialog.js     # Modal de confirmacao
        |
        |-- pages/
        |   |-- Login.js             # Tela de login
        |   |-- Dashboard.js         # Painel com estatisticas
        |   |-- Alunos.js            # CRUD de alunos
        |   |-- Planos.js            # CRUD de planos
        |   |-- Matriculas.js        # CRUD de matriculas
        |   |-- Exercicios.js        # CRUD de exercicios
        |   |-- Treinos.js           # CRUD de treinos + exercicios vinculados
        |   |-- Usuarios.js          # CRUD de usuarios do sistema
        |
        |-- utils/
            |-- masks.js             # Mascaras CPF, telefone e validacao
```

---

## 3. Como o Java se Conecta ao React

### 3.1 O React faz requisicoes HTTP para o Java

O React **NAO** acessa o banco de dados diretamente. Ele faz requisicoes HTTP para os endpoints REST do backend Java.

**Arquivo chave: `frontend/src/services/api.js`**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/academia/api',  // URL do backend Java
});

// Adiciona o token JWT em toda requisicao
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Exemplo de uso em uma pagina React (Alunos.js):**
```javascript
// Buscar todos os alunos
api.get('/alunos').then((r) => setAlunos(r.data));

// Cadastrar novo aluno
api.post('/alunos', { nome: 'Joao', cpf: '123.456.789-00' });

// Atualizar aluno
api.put('/alunos/1', { nome: 'Joao Silva' });

// Excluir aluno
api.delete('/alunos/1');
```

### 3.2 O Java recebe e responde em JSON

**Arquivo chave: `src/main/java/rest/AlunoResource.java`**
```java
@Path("/alunos")
@Produces(MediaType.APPLICATION_JSON)   // Retorna JSON
@Consumes(MediaType.APPLICATION_JSON)   // Recebe JSON
public class AlunoResource {

    @GET                                // Responde a GET /api/alunos
    public Response listar() {
        List<Aluno> alunos = alunoService.listarTodos();
        return Response.ok(alunos).build();  // Converte para JSON automaticamente
    }

    @POST                               // Responde a POST /api/alunos
    public Response criar(Aluno aluno) { // Jackson converte JSON -> Aluno
        Aluno salvo = alunoService.salvar(aluno);
        return Response.status(201).entity(salvo).build();
    }
}
```

### 3.3 Fluxo completo de uma requisicao

```
1. Usuario clica "Salvar" no formulario React
              |
2. React chama: api.post('/alunos', { nome: 'Joao', cpf: '...' })
              |
3. Axios envia: POST http://localhost:8080/academia/api/alunos
                Headers: Content-Type: application/json
                         Authorization: Bearer eyJhbGci...
                Body: {"nome":"Joao","cpf":"123.456.789-00"}
              |
4. CorsFilter libera a requisicao (origem localhost:3000)
              |
5. AuthFilter valida o token JWT
              |
6. AlunoResource.criar() recebe o JSON convertido em objeto Aluno
              |
7. AlunoService.salvar() aplica regras de negocio
              |
8. AlunoDAO.salvar() persiste no banco via JPA/Hibernate
              |
9. MySQL insere o registro na tabela "aluno"
              |
10. Resposta volta: 201 Created + JSON do aluno salvo
              |
11. React recebe a resposta e atualiza a tela
```

---

## 4. CORS - Como o React (porta 3000) acessa o Java (porta 8080)

Como o React roda em `localhost:3000` e o Java em `localhost:8080`, o navegador bloqueia requisicoes entre origens diferentes (politica de Same-Origin). O **CorsFilter** resolve isso.

**Arquivo: `src/main/java/rest/CorsFilter.java`**
```java
@WebFilter(urlPatterns = {"/api/*"})
public class CorsFilter implements Filter {
    public void doFilter(...) {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        // Requisicoes preflight (OPTIONS) sao respondidas imediatamente
        if ("OPTIONS".equals(req.getMethod())) {
            res.setStatus(200);
            return;
        }
        chain.doFilter(request, response);
    }
}
```

**O que acontece:**
1. O navegador envia primeiro uma requisicao OPTIONS (preflight)
2. O CorsFilter responde com os headers permitidos
3. O navegador confirma que a origem e permitida
4. So entao envia a requisicao real (GET, POST, etc.)

---

## 5. Autenticacao JWT

### 5.1 Fluxo de Login

```
React (Login.js)                    Java (AuthResource)
     |                                    |
     |-- POST /api/auth/login ----------->|
     |   { login: "admin",               |
     |     senha: "admin123" }            |
     |                                    |-- UsuarioService.autenticar()
     |                                    |-- Hash SHA-256 da senha
     |                                    |-- Compara com banco
     |                                    |-- JwtUtil.gerarToken()
     |                                    |
     |<--- { token: "eyJhbG...",  --------|
     |       nome: "Administrador",       |
     |       login: "admin" }             |
     |                                    |
     |-- localStorage.setItem('token')    |
     |-- Redireciona para Dashboard       |
```

### 5.2 Protecao dos Endpoints

**AuthFilter.java** intercepta TODAS as requisicoes (exceto `/auth/*`):
```java
public void filter(ContainerRequestContext ctx) {
    String path = ctx.getUriInfo().getPath();

    if (path.startsWith("auth/")) return;     // Login e publico

    String authHeader = ctx.getHeaderString("Authorization");
    String token = authHeader.substring(7);   // Remove "Bearer "

    if (!JwtUtil.isTokenValido(token)) {
        ctx.abortWith(Response.status(401).build()); // Nao autorizado
    }
}
```

### 5.3 React envia o token automaticamente

O interceptor do Axios adiciona o token em toda requisicao:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 6. Camada de Dados (JPA/Hibernate)

### 6.1 Conexao com o MySQL

**Arquivo: `persistence.xml`**
```xml
<property name="javax.persistence.jdbc.url"
          value="jdbc:mysql://localhost:3306/academia_db"/>
<property name="javax.persistence.jdbc.user"     value="root"/>
<property name="javax.persistence.jdbc.password" value=""/>
<property name="hibernate.hbm2ddl.auto"          value="update"/>
```

- `hbm2ddl.auto=update`: O Hibernate **cria/atualiza as tabelas automaticamente** baseado nas classes `@Entity`.
- Pool de conexoes: HikariCP (5 a 20 conexoes).

### 6.2 Fluxo DAO -> Banco

```
Resource (REST)  -->  Service (regras)  -->  DAO (persistencia)  -->  MySQL
                                              |
                                         GenericDAO.java
                                         (salvar, atualizar,
                                          remover, buscarTodos,
                                          buscarPorId, contarTodos)
```

**GenericDAO** usa generics para evitar repeticao:
```java
public class GenericDAO<T> {
    public void salvar(T entidade) {
        executarDentroTransacao(em -> em.persist(entidade));
    }
    public T atualizar(T entidade) {
        return executarDentroTransacaoComRetorno(em -> em.merge(entidade));
    }
}
```

Os DAOs especificos (AlunoDAO, PlanoDAO, etc.) estendem o GenericDAO e adicionam consultas customizadas.

---

## 7. Endpoints da API REST

| Metodo | Endpoint                          | Descricao                      |
|--------|-----------------------------------|--------------------------------|
| POST   | /api/auth/login                   | Autenticar e receber token JWT |
| GET    | /api/dashboard                    | Estatisticas do sistema        |
| GET    | /api/alunos                       | Listar alunos                  |
| GET    | /api/alunos?nome=joao             | Buscar aluno por nome          |
| POST   | /api/alunos                       | Cadastrar aluno                |
| PUT    | /api/alunos/{id}                  | Atualizar aluno                |
| DELETE | /api/alunos/{id}                  | Excluir aluno                  |
| GET    | /api/planos                       | Listar planos                  |
| POST   | /api/planos                       | Cadastrar plano                |
| PUT    | /api/planos/{id}                  | Atualizar plano                |
| DELETE | /api/planos/{id}                  | Excluir plano                  |
| GET    | /api/matriculas                   | Listar matriculas              |
| POST   | /api/matriculas                   | Cadastrar matricula            |
| PUT    | /api/matriculas/{id}              | Atualizar matricula            |
| DELETE | /api/matriculas/{id}              | Excluir matricula              |
| GET    | /api/exercicios                   | Listar exercicios              |
| POST   | /api/exercicios                   | Cadastrar exercicio            |
| PUT    | /api/exercicios/{id}              | Atualizar exercicio            |
| DELETE | /api/exercicios/{id}              | Excluir exercicio              |
| GET    | /api/treinos                      | Listar treinos                 |
| POST   | /api/treinos                      | Cadastrar treino               |
| PUT    | /api/treinos/{id}                 | Atualizar treino               |
| DELETE | /api/treinos/{id}                 | Excluir treino                 |
| GET    | /api/treinos/{id}/exercicios      | Listar exercicios do treino    |
| POST   | /api/treinos/{id}/exercicios      | Adicionar exercicio ao treino  |
| DELETE | /api/treinos/{id}/exercicios/{eid}| Remover exercicio do treino    |
| GET    | /api/usuarios                     | Listar usuarios                |
| POST   | /api/usuarios                     | Cadastrar usuario              |
| PUT    | /api/usuarios/{id}                | Atualizar usuario              |
| PUT    | /api/usuarios/{id}/toggle         | Ativar/desativar usuario       |

---

## 8. Tecnologias Utilizadas

### Backend
| Tecnologia        | Versao  | Funcao                              |
|-------------------|---------|-------------------------------------|
| Java              | 11+     | Linguagem principal                 |
| Jersey (JAX-RS)   | 2.41    | Framework REST                      |
| Hibernate (JPA)   | 5.6.15  | ORM (mapeamento objeto-relacional)  |
| MySQL Connector   | 8.0.33  | Driver do banco de dados            |
| HikariCP          | 5.0.1   | Pool de conexoes                    |
| JJWT              | 0.11.5  | Geracao/validacao de tokens JWT     |
| Jackson           | 2.15.3  | Serializacao JSON                   |
| Apache Tomcat     | 9.x     | Servidor de aplicacao               |
| Maven             | -       | Gerenciador de dependencias         |

### Frontend
| Tecnologia        | Versao  | Funcao                              |
|-------------------|---------|-------------------------------------|
| React             | 19.x    | Biblioteca de interface             |
| React Router DOM  | 6.30    | Roteamento SPA (Single Page App)    |
| Axios             | 1.13    | Cliente HTTP para chamadas REST     |
| Create React App  | 5.0.1   | Ferramenta de build                 |

### Banco de Dados
| Tecnologia        | Versao  | Funcao                              |
|-------------------|---------|-------------------------------------|
| MySQL             | 8.x     | Banco de dados relacional           |

---

## 9. Como Executar o Projeto

### Pre-requisitos
- Java 11 ou superior
- Apache Tomcat 9.x
- MySQL 8.x
- Node.js 18+ e npm
- Maven (ou Eclipse com m2e)

### Passo 1 - Banco de Dados
```sql
CREATE DATABASE IF NOT EXISTS academia_db;
```
O Hibernate cria as tabelas automaticamente no primeiro startup.

### Passo 2 - Backend
No Eclipse:
1. Importar como projeto Maven
2. Configurar o Tomcat 9 em Servers
3. Properties > Deployment Assembly > Adicionar Maven Dependencies -> /WEB-INF/lib
4. Run As > Run on Server

O backend ficara disponivel em: `http://localhost:8080/academia/api`

### Passo 3 - Frontend
```bash
cd frontend
npm install       # Instalar dependencias (so na primeira vez)
npm start         # Iniciar servidor de desenvolvimento
```
O frontend ficara disponivel em: `http://localhost:3000`

### Passo 4 - Acessar
- Abrir `http://localhost:3000` no navegador
- Login: `admin` / Senha: `admin123`

---

## 10. Diagrama de Relacionamento das Entidades

```
+-------------+       +-------------+       +-------------+
|   Usuario   |       |    Aluno    |       |    Plano    |
|-------------|       |-------------|       |-------------|
| idUsuario   |       | idAluno     |       | idPlano     |
| nome        |       | nome        |       | nome        |
| login       |       | cpf         |       | valor       |
| senha (hash)|       | email       |       | duracaoDias |
| ativo       |       | telefone    |       | descricao   |
+-------------+       | dataNasc.   |       +------+------+
                       +------+------+              |
                              |                     |
                              |    +----------------+
                              |    |
                       +------+----+----+
                       |   Matricula    |
                       |----------------|
                       | idMatricula    |
                       | aluno (FK)     |
                       | plano (FK)     |
                       | dataInicio     |
                       | dataFim (auto) |
                       | status         |
                       +----------------+

+-------------+       +------------------+       +-------------+
|   Treino    |       | TreinoExercicio  |       |  Exercicio  |
|-------------|       |------------------|       |-------------|
| idTreino    +-------+ idTreino (FK)    +-------+ idExercicio |
| nome        |       | idExercicio (FK) |       | nome        |
| objetivo    |       | series           |       | grupoMucs.  |
| nivel       |       | repeticoes       |       | descricao   |
+-------------+       | cargaSugerida    |       +-------------+
                       | descansoSegundos |
                       | ordem            |
                       +------------------+
```

---

## 11. Resumo: Java vs React - Quem faz o que?

| Responsabilidade            | Java (Backend)          | React (Frontend)           |
|-----------------------------|-------------------------|----------------------------|
| Interface do usuario        |                         | Formularios, tabelas, etc. |
| Navegacao entre paginas     |                         | React Router               |
| Chamadas HTTP               |                         | Axios                      |
| Armazenar token no browser  |                         | localStorage               |
| Validacao de formularios    |                         | masks.js + validacao inline|
| Receber requisicoes REST    | Jersey (JAX-RS)         |                            |
| Logica de negocio           | Services                |                            |
| Acesso ao banco de dados    | DAOs + Hibernate        |                            |
| Autenticacao (gerar token)  | JwtUtil                 |                            |
| Proteger endpoints          | AuthFilter              |                            |
| Liberar CORS                | CorsFilter              |                            |
| Serializar/deserializar JSON| Jackson                 | Axios (automatico)         |
| Criar tabelas no banco      | Hibernate (auto)        |                            |
