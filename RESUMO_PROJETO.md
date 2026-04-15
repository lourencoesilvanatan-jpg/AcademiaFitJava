# Resumo - Projeto AcademiaFit

## O que e?
Sistema de gerenciamento de academia com **backend em Java** e **frontend em React**, rodando separados e se comunicando por API REST.

## Como funciona a conexao Java + React?

```
React (porta 3000)  ---HTTP/JSON--->  Java (porta 8080)  --->  MySQL (porta 3306)
```

- O React **nao acessa o banco** diretamente
- O React usa **Axios** para fazer requisicoes HTTP (GET, POST, PUT, DELETE) para o Java
- O Java recebe, processa e retorna **JSON**
- Um **filtro CORS** no Java libera o React (porta 3000) a fazer requisicoes
- A autenticacao usa **JWT** (token enviado no header de cada requisicao)

## Estrutura resumida

```
ProjetoRenomado/
|-- src/main/java/          # BACKEND JAVA
|   |-- model/              #   Entidades (Aluno, Plano, Treino, etc.)
|   |-- dao/                #   Acesso ao banco (GenericDAO + especificos)
|   |-- service/            #   Regras de negocio
|   |-- rest/               #   Endpoints REST (controllers)
|   |-- util/               #   JWT, JPA, inicializacao
|
|-- frontend/src/            # FRONTEND REACT
|   |-- services/api.js     #   Conexao com o backend (Axios)
|   |-- context/            #   Autenticacao (login/logout)
|   |-- pages/              #   Telas (Alunos, Planos, Treinos, etc.)
|   |-- components/         #   Componentes reutilizaveis (Layout, Toast, etc.)
```

## Fluxo de uma requisicao (exemplo: cadastrar aluno)

1. Usuario preenche o formulario no React e clica "Salvar"
2. React envia `POST http://localhost:8080/academia/api/alunos` com JSON
3. CorsFilter libera a requisicao (origem localhost:3000)
4. AuthFilter valida o token JWT
5. AlunoResource recebe o JSON e converte para objeto Java
6. AlunoService aplica regras de negocio
7. AlunoDAO persiste no MySQL via Hibernate
8. Java retorna o aluno salvo como JSON
9. React atualiza a tela

## Tecnologias principais

| Backend             | Frontend            | Banco       |
|---------------------|---------------------|-------------|
| Java 11             | React 19            | MySQL 8     |
| Jersey (JAX-RS)     | React Router 6      |             |
| Hibernate (JPA)     | Axios               |             |
| JWT (JJWT)          | Context API         |             |
| Tomcat 9            | Create React App    |             |

## Como rodar

1. Subir o **MySQL** com banco `academia_db` criado
2. Rodar o **backend** no Tomcat (Eclipse: Run on Server)
3. Rodar o **frontend**: `cd frontend && npm start`
4. Acessar `http://localhost:3000` - Login: `admin` / `admin123`
