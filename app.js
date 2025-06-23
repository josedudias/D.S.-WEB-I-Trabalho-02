/**
 * Sistema de Gerenciamento de Produtos - API REST
 * Desenvolvido por: José Eduardo Dias Rufino
 * Descrição: API completa para gerenciamento de produtos em loja de departamentos
 * Tecnologias: Node.js, Express.js, MongoDB Atlas, Swagger
 * Data: Junho 2025
 */

// Importações e configurações iniciais
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Configuração do Swagger
const swaggerUi = require("swagger-ui-express");
const apiDocumentation = require("./docs/swagger-config.json");

// Importação das rotas
const productRoutes = require("./controllers/ProductController");

// Inicialização da aplicação
const app = express();
const APPLICATION_PORT = process.env.PORT || 8080;

// Configuração de middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware de log personalizado
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// Configuração das rotas
app.use("/v1/products", productRoutes);
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(apiDocumentation));

// Rota de health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Sistema de Produtos API - Online",
    author: "José Eduardo Dias Rufino",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Rota raiz
app.get("/", (req, res) => {
  res.status(200).json({
    api: "Sistema de Gerenciamento de Produtos",
    version: "2.0.0",
    developer: "José Eduardo Dias Rufino",
    documentation: "/documentation",
    health: "/health",
    endpoints: {
      products: "/v1/products",
    },
  });
});

// Configuração do banco de dados
const connectToDatabase = async () => {
  try {
    const DB_CONNECTION_STRING =
      process.env.DATABASE_URL ||
      "mongodb+srv://joseeduardo:SistemasProdutos2025@cluster-produtos.mongodb.net/produtos-db?retryWrites=true&w=majority";

    await mongoose.connect(DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ Conexão com MongoDB estabelecida com sucesso!");

    // Iniciar servidor após conexão bem-sucedida
    app.listen(APPLICATION_PORT, () => {
      console.log(`🚀 Servidor iniciado na porta ${APPLICATION_PORT}`);
      console.log(
        `📚 Documentação disponível em: http://localhost:${APPLICATION_PORT}/documentation`
      );
      console.log(
        `🏥 Health check disponível em: http://localhost:${APPLICATION_PORT}/health`
      );
      console.log(`👨‍💻 Desenvolvido por: José Eduardo Dias Rufino`);
    });
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:", error.message);
    process.exit(1);
  }
};

// Tratamento de erros não capturados
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Inicialização da aplicação
connectToDatabase();

module.exports = app;
