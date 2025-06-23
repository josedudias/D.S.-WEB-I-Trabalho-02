/**
 * Controller de Produtos - Sistema de Gerenciamento
 * Desenvolvido por: José Eduardo Dias Rufino
 * Descrição: Controlador principal para operações CRUD de produtos
 */

const express = require("express");
const router = express.Router();
const ProductModel = require("../schemas/ProductSchema");

// Classe de serviços para produtos
class ProductService {
  /**
   * Buscar todos os produtos ativos
   */
  static async getAllActiveProducts() {
    try {
      const products = await ProductModel.findActiveProducts();
      return {
        success: true,
        data: products,
        count: products.length,
        message: "Produtos carregados com sucesso",
      };
    } catch (error) {
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }
  }

  /**
   * Buscar produto por ID ou nome
   */
  static async findProductByIdOrName(searchParameter) {
    try {
      const product = await ProductModel.findByNameOrId(searchParameter);

      if (!product) {
        return {
          success: false,
          data: null,
          message: "Produto não encontrado no sistema",
        };
      }

      return {
        success: true,
        data: product,
        message: "Produto encontrado com sucesso",
      };
    } catch (error) {
      throw new Error(`Erro ao buscar produto: ${error.message}`);
    }
  }

  /**
   * Criar novo produto
   */
  static async createNewProduct(productData) {
    try {
      // Verificar se já existe produto com o mesmo nome
      const existingProduct = await ProductModel.findOne({
        productName: {
          $regex: new RegExp(`^${productData.productName}$`, "i"),
        },
        isActive: true,
      });

      if (existingProduct) {
        return {
          success: false,
          data: null,
          message: "Já existe um produto com este nome",
        };
      }

      const newProduct = new ProductModel(productData);
      const savedProduct = await newProduct.save();

      return {
        success: true,
        data: savedProduct,
        message: "Produto criado com sucesso",
        productId: savedProduct._id,
      };
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        );
        throw new Error(`Erro de validação: ${validationErrors.join(", ")}`);
      }
      throw new Error(`Erro ao criar produto: ${error.message}`);
    }
  }

  /**
   * Atualizar produto existente
   */
  static async updateExistingProduct(productId, updateData) {
    try {
      // Remover campos que não devem ser atualizados
      delete updateData.registrationDate;
      delete updateData._id;

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        { ...updateData, lastUpdate: new Date() },
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      );

      if (!updatedProduct) {
        return {
          success: false,
          data: null,
          message: "Produto não encontrado para atualização",
        };
      }

      return {
        success: true,
        data: updatedProduct,
        message: "Produto atualizado com sucesso",
      };
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        );
        throw new Error(`Erro de validação: ${validationErrors.join(", ")}`);
      }
      throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }
  }

  /**
   * Remover produto (soft delete)
   */
  static async deactivateProduct(productId) {
    try {
      const deactivatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        {
          isActive: false,
          lastUpdate: new Date(),
        },
        { new: true }
      );

      if (!deactivatedProduct) {
        return {
          success: false,
          data: null,
          message: "Produto não encontrado para remoção",
        };
      }

      return {
        success: true,
        data: deactivatedProduct,
        message: "Produto removido com sucesso",
      };
    } catch (error) {
      throw new Error(`Erro ao remover produto: ${error.message}`);
    }
  }
}

// ========== ROTAS DO CONTROLADOR ==========

/**
 * GET /v1/products
 * Listar todos os produtos ativos
 */
router.get("/", async (req, res) => {
  try {
    const result = await ProductService.getAllActiveProducts();

    res.status(200).json({
      status: "success",
      timestamp: new Date().toISOString(),
      developer: "José Eduardo Dias Rufino",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString(),
      developer: "José Eduardo Dias Rufino",
    });
  }
});

/**
 * GET /v1/products/:searchParam
 * Buscar produto por ID ou nome
 */
router.get("/:searchParam", async (req, res) => {
  try {
    const { searchParam } = req.params;
    const result = await ProductService.findProductByIdOrName(searchParam);

    const statusCode = result.success ? 200 : 404;

    res.status(statusCode).json({
      status: result.success ? "success" : "not_found",
      timestamp: new Date().toISOString(),
      developer: "José Eduardo Dias Rufino",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString(),
      developer: "José Eduardo Dias Rufino",
    });
  }
});

/**
 * POST /v1/products
 * Criar novo produto
 */
router.post("/", async (req, res) => {
  try {
    const productData = req.body;

    // Validação básica de campos obrigatórios
    const requiredFields = [
      "productName",
      "description",
      "color",
      "weight",
      "category",
      "price",
    ];
    const missingFields = requiredFields.filter((field) => !productData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "validation_error",
        message: `Campos obrigatórios faltando: ${missingFields.join(", ")}`,
        missingFields,
        timestamp: new Date().toISOString(),
        developer: "José Eduardo Dias Rufino",
      });
    }

    const result = await ProductService.createNewProduct(productData);

    const statusCode = result.success ? 201 : 409;

    res.status(statusCode).json({
      status: result.success ? "created" : "conflict",
      timestamp: new Date().toISOString(),
      developer: "José Eduardo Dias Rufino",
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString(),
      developer: "José Eduardo Dias Rufino",
    });
  }
});

/**
 * PUT /v1/products/:id
 * Atualizar produto existente
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: "validation_error",
        message: "Nenhum dado fornecido para atualização",
        timestamp: new Date().toISOString(),
        developer: "José Eduardo Dias Rufino",
      });
    }

    const result = await ProductService.updateExistingProduct(id, updateData);

    const statusCode = result.success ? 200 : 404;

    res.status(statusCode).json({
      status: result.success ? "updated" : "not_found",
      timestamp: new Date().toISOString(),
      developer: "José Eduardo Dias Rufino",
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString(),
      developer: "José Eduardo Dias Rufino",
    });
  }
});

/**
 * DELETE /v1/products/:id
 * Remover produto (soft delete)
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductService.deactivateProduct(id);

    const statusCode = result.success ? 200 : 404;

    res.status(statusCode).json({
      status: result.success ? "deleted" : "not_found",
      timestamp: new Date().toISOString(),
      developer: "José Eduardo Dias Rufino",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString(),
      developer: "José Eduardo Dias Rufino",
    });
  }
});

module.exports = router;
