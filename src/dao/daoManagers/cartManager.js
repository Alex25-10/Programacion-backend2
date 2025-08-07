import CartModel from '../models/CartModel.js';
import ProductRepository from '../../repositories/products.repository.js';
import TicketRepository from '../../repositories/tickets.repository.js';
import { v4 as uuidv4 } from 'uuid';

const productRepo = new ProductRepository();
const ticketRepo = new TicketRepository();

class CartManager {
  async getCartById(cid) {
    const cart = await CartModel.findById(cid).populate('products.product');
    return cart;
  }

  async addProductToCart(cid, pid, quantity = 1) {
    const cart = await this.getCartById(cid);
    const product = await productRepo.getProductById(pid);

    if (!product) throw new Error('Producto no encontrado');
    if (product.stock < quantity) throw new Error('Stock insuficiente');

    const productInCart = cart.products.find(p => p.product._id.toString() === pid);

    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    return cart;
  }

  async purchaseCart(cid, userEmail) {
    const cart = await this.getCartById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    let totalAmount = 0;
    const productosSinStock = [];

    for (const item of cart.products) {
      const producto = await productRepo.getProductById(item.product._id);

      if (producto.stock >= item.quantity) {
        totalAmount += producto.price * item.quantity;
        await productRepo.updateProduct(producto._id, {
          stock: producto.stock - item.quantity
        });
      } else {
        productosSinStock.push(producto._id);
      }
    }

    // Filtra los productos que sí se pudieron comprar
    cart.products = cart.products.filter(item => !productosSinStock.includes(item.product._id));
    await cart.save();

    const ticket = await ticketRepo.createTicket({
      code: uuidv4(),
      amount: totalAmount,
      purchaser: userEmail,
    });

    return {
      status: 'success',
      message: 'Compra procesada',
      ticket,
      productosSinStock
    };
  }
}

export default CartManager;

