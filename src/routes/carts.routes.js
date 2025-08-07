// src/routes/carts.routes.js
import { Router } from 'express';
import CartController from '../controllers/cart.controller.js';
import { purchaseCart } from '../controllers/purchase.controller.js';
import { passportCall } from '../middlewares/passportCall.js';

const router = Router();

// Obtener carrito por ID
router.get('/:cid', CartController.getCartById);

// Agregar producto al carrito
router.post('/:cid/products/:pid', passportCall('jwt'), CartController.addProductToCart);

// Eliminar producto del carrito
router.delete('/:cid/products/:pid', passportCall('jwt'), CartController.removeProductFromCart);

// Vaciar carrito
router.delete('/:cid', passportCall('jwt'), CartController.clearCart);

// Finalizar compra (checkout)
router.post('/:cid/purchase', passportCall('jwt'), purchaseCart);

export default router;
