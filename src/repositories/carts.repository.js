import CartDTO from '../dto/cart.dto.js';

export default class CartRepository {
  constructor(cartDao) {
    this.cartDao = cartDao;
  }

  async getCarts() {
    const carts = await this.cartDao.getCarts();
    return carts.map(cart => new CartDTO(cart));
  }

  async getCartById(cid) {
    const cart = await this.cartDao.getCartById(cid);
    return new CartDTO(cart);
  }

  async createCart() {
    const newCart = await this.cartDao.createCart();
    return new CartDTO(newCart);
  }

  async addProductToCart(cid, pid, quantity = 1) {
    const updatedCart = await this.cartDao.addProductToCart(cid, pid, quantity);
    return new CartDTO(updatedCart);
  }

  async updateProductQuantity(cid, pid, quantity) {
    const updatedCart = await this.cartDao.updateProductQuantity(cid, pid, quantity);
    return new CartDTO(updatedCart);
  }

  async removeProductFromCart(cid, pid) {
    const updatedCart = await this.cartDao.removeProductFromCart(cid, pid);
    return new CartDTO(updatedCart);
  }

  async clearCart(cid) {
    const clearedCart = await this.cartDao.clearCart(cid);
    return new CartDTO(clearedCart);
  }

  async deleteCart(cid) {
    return await this.cartDao.deleteCart(cid);
  }

  async purchaseCart(cid, user) {
    const result = await this.cartDao.purchaseCart(cid, user);
    return result; // Esto puede ser un objeto con ticket y productos rechazados
  }

  async removePurchasedProducts(cid, productIds) {
    const updatedCart = await this.cartDao.removePurchasedProducts(cid, productIds);
    return new CartDTO(updatedCart);
  }
}

