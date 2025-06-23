/**
 * Schema de Produto - Sistema de Gerenciamento
 * Desenvolvido por: José Eduardo Dias Rufino
 * Descrição: Modelo de dados para produtos com validações completas
 */

const mongoose = require("mongoose");

// Schema personalizado para produtos
const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Nome do produto é obrigatório"],
      trim: true,
      minlength: [2, "Nome deve ter pelo menos 2 caracteres"],
      maxlength: [100, "Nome deve ter no máximo 100 caracteres"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Descrição é obrigatória"],
      trim: true,
      minlength: [5, "Descrição deve ter pelo menos 5 caracteres"],
      maxlength: [500, "Descrição deve ter no máximo 500 caracteres"],
    },
    color: {
      type: String,
      required: [true, "Cor é obrigatória"],
      trim: true,
      lowercase: true,
      enum: {
        values: [
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
        ],
        message: "Cor {VALUE} não é válida",
      },
    },
    weight: {
      type: Number,
      required: [true, "Peso é obrigatório"],
      min: [0.001, "Peso deve ser maior que 0"],
      max: [1000, "Peso deve ser menor que 1000kg"],
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "Peso deve ser um valor positivo",
      },
    },
    category: {
      type: String,
      required: [true, "Categoria é obrigatória"],
      trim: true,
      lowercase: true,
      enum: {
        values: [
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
        ],
        message: "Categoria {VALUE} não é válida",
      },
    },
    price: {
      type: Number,
      required: [true, "Preço é obrigatório"],
      min: [0.01, "Preço deve ser maior que R$ 0,01"],
      max: [999999.99, "Preço deve ser menor que R$ 999.999,99"],
      validate: {
        validator: function (value) {
          return Number(value.toFixed(2)) === value;
        },
        message: "Preço deve ter no máximo 2 casas decimais",
      },
    },
    registrationDate: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    lastUpdate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: [0, "Quantidade em estoque não pode ser negativa"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "products_catalog",
  }
);

// Middleware para atualizar lastUpdate
ProductSchema.pre("save", function (next) {
  if (this.isModified() && !this.isNew) {
    this.lastUpdate = new Date();
  }
  next();
});

// Índices para otimização
ProductSchema.index({ productName: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isActive: 1 });

// Métodos do schema
ProductSchema.methods.toJSON = function () {
  const product = this.toObject();

  // Formatar preço para BRL
  product.formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  return product;
};

// Métodos estáticos
ProductSchema.statics.findByNameOrId = function (searchTerm) {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(searchTerm);

  if (isValidObjectId) {
    return this.findOne({
      $or: [
        { _id: searchTerm },
        { productName: { $regex: searchTerm, $options: "i" } },
      ],
      isActive: true,
    });
  } else {
    return this.findOne({
      productName: { $regex: searchTerm, $options: "i" },
      isActive: true,
    });
  }
};

ProductSchema.statics.findActiveProducts = function () {
  return this.find({ isActive: true }).sort({ registrationDate: -1 });
};

// Criação do modelo
const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
