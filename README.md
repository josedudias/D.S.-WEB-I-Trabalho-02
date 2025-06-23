# 🏪 Sistema de Gerenciamento de Produtos - API REST

> **Desenvolvido por:** José Eduardo Dias Rufino  
> **Versão:** 2.0.0  
> **Tecnologias:** Node.js, Express.js, MongoDB Atlas, Swagger UI

## 📋 Sobre o Projeto

Este sistema é uma **API REST completa** desenvolvida para gerenciamento de produtos em lojas de departamentos. A solução oferece operações CRUD (Create, Read, Update, Delete) com validações robustas, documentação interativa e arquitetura escalável.

### 🎯 Principais Características

- ✅ **Arquitetura Moderna**: Estrutura MVC com separação clara de responsabilidades
- ✅ **Validações Robustas**: Sistema completo de validação de dados com Mongoose
- ✅ **Documentação Interativa**: Swagger UI integrado para testes e documentação
- ✅ **Tratamento de Erros**: Sistema abrangente de tratamento e logging de erros
- ✅ **Soft Delete**: Remoção lógica de produtos mantendo histórico
- ✅ **Health Check**: Monitoramento de saúde da aplicação
- ✅ **Busca Flexível**: Busca por ID ou nome com regex case-insensitive

## � Links Importantes

| Recurso                     | URL                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 📚 **Documentação Swagger** | [sistemas-produtos-api.onrender.com/documentation](https://sistemas-produtos-api.onrender.com/documentation) |
| 🏥 **Health Check**         | [sistemas-produtos-api.onrender.com/health](https://sistemas-produtos-api.onrender.com/health)               |
| 🔗 **API Base**             | [sistemas-produtos-api.onrender.com](https://sistemas-produtos-api.onrender.com)                             |

## 🛠️ Stack Tecnológica

```json
{
  "backend": "Node.js v18+",
  "framework": "Express.js v5.1.0",
  "database": "MongoDB Atlas",
  "odm": "Mongoose v8.16.0",
  "documentation": "Swagger UI Express v5.0.1",
  "cors": "CORS v2.8.5",
  "environment": "dotenv v16.5.0"
}
```

## 📁 Estrutura do Projeto

```
Sistema-Produtos-API/
├── app.js                      # Arquivo principal da aplicação
├── package.json                # Dependências e scripts
├── README.md                   # Documentação do projeto
├── .env                        # Variáveis de ambiente
├── .gitignore                  # Arquivos ignorados pelo Git
├── controllers/                # Controladores da aplicação
│   └── ProductController.js    # Controller de produtos
├── schemas/                    # Modelos de dados
│   └── ProductSchema.js        # Schema do produto com validações
└── docs/                       # Documentação
    └── swagger-config.json     # Configuração do Swagger
```

## 🎮 Endpoints da API

### 📊 Sistema

| Método | Endpoint  | Descrição                  |
| ------ | --------- | -------------------------- |
| `GET`  | `/`       | Informações da API         |
| `GET`  | `/health` | Status de saúde do sistema |

### 📦 Produtos

| Método   | Endpoint                     | Descrição                       |
| -------- | ---------------------------- | ------------------------------- |
| `GET`    | `/v1/products`               | Listar todos os produtos ativos |
| `GET`    | `/v1/products/{searchParam}` | Buscar produto por ID ou nome   |
| `POST`   | `/v1/products`               | Criar novo produto              |
| `PUT`    | `/v1/products/{id}`          | Atualizar produto existente     |
| `DELETE` | `/v1/products/{id}`          | Remover produto (soft delete)   |

## 📝 Modelo de Dados

### Produto (Product)

```javascript
{
  "_id": "ObjectId único",
  "productName": "String (2-100 chars, obrigatório)",
  "description": "String (5-500 chars, obrigatório)",
  "color": "Enum específico (obrigatório)",
  "weight": "Number (0.001-1000 kg, obrigatório)",
  "category": "Enum específico (obrigatório)",
  "price": "Number (0.01-999999.99, obrigatório)",
  "registrationDate": "Date (automático)",
  "lastUpdate": "Date (automático)",
  "isActive": "Boolean (default: true)",
  "stockQuantity": "Number (default: 0)",
  "formattedPrice": "String (calculado, formato BRL)"
}
```

### Categorias Aceitas

```javascript
[
  "vestuario",
  "calcado",
  "acessorio",
  "eletronico",
  "casa",
  "beleza",
  "esporte",
  "livro",
  "brinquedo",
  "outros",
];
```

### Cores Aceitas

```javascript
[
  "branco",
  "preto",
  "azul",
  "vermelho",
  "verde",
  "amarelo",
  "rosa",
  "roxo",
  "laranja",
  "marrom",
  "cinza",
  "bege",
  "multicolor",
];
```

## 🧪 Exemplos de Uso

### 1. Criar Produto

```bash
POST /v1/products
Content-Type: application/json

{
  "productName": "Notebook Gamer Legion 5",
  "description": "Notebook gamer com AMD Ryzen 7, RTX 3060, 16GB RAM e SSD 512GB",
  "color": "preto",
  "weight": 2.4,
  "category": "eletronico",
  "price": 4599.99,
  "stockQuantity": 5
}
```

### 2. Buscar Produto

```bash
# Por ID
GET /v1/products/60d5ec49f14a2c001c8e4b8a

# Por Nome
GET /v1/products/Notebook Gamer Legion 5
```

### 3. Atualizar Produto

```bash
PUT /v1/products/60d5ec49f14a2c001c8e4b8a
Content-Type: application/json

{
  "price": 4299.99,
  "stockQuantity": 8
}
```

### 4. Listar Produtos

```bash
GET /v1/products
```

### 5. Remover Produto

```bash
DELETE /v1/products/60d5ec49f14a2c001c8e4b8a
```

## ⚡ Instalação e Desenvolvimento

### Pré-requisitos

- Node.js 18+
- MongoDB Atlas (ou instância local)
- Git

### Configuração Local

1. **Clone o repositório**

```bash
git clone <seu-repositorio>
cd Sistema-Produtos-API
```

2. **Instale dependências**

```bash
npm install
```

3. **Configure variáveis de ambiente**

```bash
# Crie arquivo .env na raiz
DATABASE_URL=sua_connection_string_mongodb
PORT=8080
NODE_ENV=development
```

4. **Execute a aplicação**

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start

# Produção otimizada
npm run production
```

5. **Acesse a aplicação**

- API: http://localhost:8080
- Documentação: http://localhost:8080/documentation
- Health Check: http://localhost:8080/health

## 🔒 Variáveis de Ambiente

```bash
# Database
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/database

# Server
PORT=8080
NODE_ENV=production

# Optional
LOG_LEVEL=info
```

## 📊 Respostas da API

### Estrutura Padrão de Resposta

```javascript
{
  "status": "success|error|not_found|created|updated|deleted",
  "success": true|false,
  "data": "dados da resposta ou null",
  "message": "mensagem descritiva",
  "timestamp": "2025-06-22T10:30:00.000Z",
  "developer": "José Eduardo Dias Rufino"
}
```

### Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `404` - Não encontrado
- `409` - Conflito (duplicata)
- `500` - Erro interno do servidor

## 🧩 Recursos Avançados

### Validações Implementadas

- ✅ Campos obrigatórios
- ✅ Tipos de dados corretos
- ✅ Limites de tamanho (min/max)
- ✅ Enums para categorias e cores
- ✅ Validação de preço (até 2 casas decimais)
- ✅ Validação de peso
- ✅ Prevenção de produtos duplicados

### Funcionalidades Especiais

- � **Busca Inteligente**: Por ID ou nome (case-insensitive)
- 💰 **Formatação de Preço**: Automática em BRL
- 📅 **Timestamps**: Criação e atualização automáticas
- 🗑️ **Soft Delete**: Produtos ficam inativos, não são removidos
- 📈 **Controle de Estoque**: Campo opcional para quantidade
- 🏷️ **Índices**: Otimizados para performance

## 🎨 Interface de Documentação

A documentação Swagger oferece:

- 📖 Descrição completa de todos os endpoints
- 🧪 Interface para testes interativos
- 📋 Exemplos de requisições e respostas
- 🔧 Schemas detalhados dos modelos
- 🏷️ Tags organizadas por funcionalidade

## 🏗️ Arquitetura

```
Cliente (Postman/Browser)
         ↓
   Express Middleware
         ↓
   Product Controller
         ↓
   Product Service
         ↓
   Product Schema (Mongoose)
         ↓
   MongoDB Atlas
```

## 👨‍💻 Desenvolvimento

### Scripts Disponíveis

```bash
npm start          # Produção
npm run dev        # Desenvolvimento com nodemon
npm run production # Produção otimizada
npm test          # Testes (configurar)
```

### Padrões de Código

- 📝 **Comentários**: JSDoc em português
- 🏗️ **Arquitetura**: MVC com Service Layer
- 🎯 **Nomeação**: camelCase para variáveis, PascalCase para classes
- 🔧 **Configuração**: Ambiente via .env
- 📊 **Logging**: Console estruturado com timestamps

---

## 📞 Suporte e Contato

**Desenvolvedor:** José Eduardo Dias Rufino  
**Email:** joseeduardo@email.com  
**Projeto:** Sistema de Gerenciamento de Produtos v2.0  
**Licença:** MIT

---

> 💡 **Dica:** Utilize a documentação interativa em `/documentation` para explorar todos os recursos da API de forma prática!
