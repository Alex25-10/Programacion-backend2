import TicketService from './ticket.service.js';
import CartRepository from '../repositories/cart.repository.js';
import ProductRepository from '../repositories/product.repository.js';
import { generateTicketCode } from '../utils/generateTicketCode.js';

export default class PurchaseService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
    this.ticketService = new TicketService();
  }

  async purchaseCart(cartId, purchaserEmail) {
    const cart = await this.cartRepository.getCartById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const productosSinStock = [];
    const productosComprados = [];

    for (const item of cart.products) {
      const producto = await this.productRepository.getProductById(item.product._id);
      
      if (!producto) continue;

      if (producto.stock >= item.quantity) {
        producto.stock -= item.quantity;
        await this.productRepository.updateProduct(producto._id, { stock: producto.stock });

        productosComprados.push({
          product: producto._id,
          quantity: item.quantity,
          price: producto.price
        });
      } else {
        productosSinStock.push({
          product: producto._id,
          quantitySolicitada: item.quantity,
          stockDisponible: producto.stock
        });
      }
    }

    // Si no hay productos comprables, no se genera ticket
    if (productosComprados.length === 0) {
      return {
        message: 'No se pudo completar la compra: todos los productos están sin stock suficiente',
        productosSinStock
      };
    }

    const totalAmount = productosComprados.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const ticketData = {
      code: generateTicketCode(),
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: purchaserEmail
    };

    const ticket = await this.ticketService.createTicket(ticketData);

    // Opcional: eliminar del carrito los productos comprados
    await this.cartRepository.removePurchasedProducts(cartId, productosComprados.map(p => p.product));

    return {
      message: 'Compra realizada con éxito',
      ticket,
      productosSinStock
    };
  }
}
