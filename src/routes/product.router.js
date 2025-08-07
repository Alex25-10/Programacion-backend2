import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';

const router = express.Router();

// GET - listar todos los productos
router.get('/', getAllProducts);

// GET - obtener un producto por ID
router.get('/:pid', getProductById);

// POST - crear un nuevo producto
router.post('/', createProduct);

// PUT - actualizar un producto por ID
router.put('/:pid', updateProduct);

// DELETE - eliminar un producto por ID
router.delete('/:pid', deleteProduct);

export default router;
