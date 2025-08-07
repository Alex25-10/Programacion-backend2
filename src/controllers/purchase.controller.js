// src/controllers/purchase.controller.js
import PurchaseService from '../services/purchase.service.js';

const purchaseService = new PurchaseService();

export const purchaseCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const purchaserEmail = req.user?.email;

    if (!cartId) {
      return res.status(400).json({ status: 'error', message: 'Cart ID es requerido' });
    }

    if (!purchaserEmail) {
      return res.status(401).json({ status: 'error', message: 'Usuario no autenticado' });
    }

    const result = await purchaseService.purchaseCart(cartId, purchaserEmail);

    return res.status(200).json({
      status: 'success',
      message: result.message || 'Compra realizada con éxito',
      ticket: result.ticket || null,
      productosSinStock: result.productosSinStock || []
    });
  } catch (error) {
    console.error('Error en purchaseCart:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

