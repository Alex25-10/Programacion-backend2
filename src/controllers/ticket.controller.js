import CartService from '../services/cart.service.js';

const cartService = new CartService();

export const purchaseCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const userEmail = req.user.email;

    const result = await cartService.purchase(cartId, userEmail);

    res.status(200).json({
      status: 'success',
      message: 'Compra realizada',
      ticket: result.ticket,
      productosNoProcesados: result.productosFallidos
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};
