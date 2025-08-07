import CartService from '../services/cart.service.js';

const cartService = new CartService();

export default {
  // Obtener carrito por ID
  getCartById: async (req, res) => {
    try {
      const cart = await cartService.getCartById(req.params.cid);
      if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
      res.json({ status: 'success', payload: cart });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Agregar producto al carrito
  addProductToCart: async (req, res) => {
    try {
      const cart = await cartService.addProductToCart(req.params.cid, req.params.pid, req.user);
      res.json({ status: 'success', payload: cart });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Eliminar producto del carrito
  removeProductFromCart: async (req, res) => {
    try {
      const result = await cartService.removeProductFromCart(req.params.cid, req.params.pid);
      res.json({ status: 'success', payload: result });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Vaciar carrito
  clearCart: async (req, res) => {
    try {
      const result = await cartService.clearCart(req.params.cid);
      res.json({ status: 'success', payload: result });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Finalizar compra (purchase)
  purchaseCart: async (req, res) => {
    try {
      const cartId = req.params.cid;
      const userEmail = req.user.email;

      const { ticket, productosSinStock, message } = await cartService.purchase(cartId, userEmail);

      if (!ticket) {
        return res.status(400).json({
          status: 'error',
          message: 'No se generó ningún ticket. ' + message,
          productosSinStock
        });
      }

      res.status(200).json({
        status: 'success',
        message,
        ticket,
        productosSinStock
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};
