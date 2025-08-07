import CartRepository from '../repositories/carts.repository.js';
import ProductRepository from '../repositories/products.repository.js';
import TicketService from './ticket.service.js';

const cartRepo = new CartRepository();
const productRepo = new ProductRepository();
const ticketService = new TicketService();

export default class CartService {
  async purchase(cartId, userEmail) {
    const cart = await cartRepo.getCartById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    let total = 0;
    const productosComprables = [];
    const productosSinStock = [];

    for (const item of cart.products) {
      const producto = await productRepo.getProductById(item.product._id);

      if (producto.stock >= item.quantity) {
        // Descontar stock desde el repositorio
        await productRepo.updateProduct(producto._id, { stock: producto.stock - item.quantity });

        total += producto.price * item.quantity;

        productosComprables.push(producto._id);
      } else {
        productosSinStock.push(item);
      }
    }

    if (productosComprables.length === 0) {
      return {
        ticket: null,
        productosSinStock,
        message: 'No se pudo realizar la compra. Ningún producto tiene stock suficiente.'
      };
    }

    // Crear ticket desde el servicio de tickets
    const ticket = await ticketService.createTicket({
      amount: total,
      purchaser: userEmail
    });

    // Eliminar productos comprados del carrito
    await cartRepo.removePurchasedProducts(cartId, productosComprables);

    return {
      ticket,
      productosSinStock,
      message:
        productosSinStock.length > 0
          ? 'Compra parcial realizada. Algunos productos no tenían stock.'
          : 'Compra completada con éxito.'
    };
  }
}
