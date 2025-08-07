import ProductRepository from '../repositories/products.repository.js';
import ProductDTO from '../dto/product.dto.js';

const productRepository = new ProductRepository();

export const getAllProducts = async (req, res) => {
  try {
    const products = await productRepository.getProducts();
    const productDTOs = products.map(product => new ProductDTO(product));
    res.status(200).json({ status: 'success', payload: productDTOs });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productRepository.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    const productDTO = new ProductDTO(product);
    res.status(200).json({ status: 'success', payload: productDTO });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = await productRepository.createProduct(req.body);
    const productDTO = new ProductDTO(newProduct);
    res.status(201).json({ status: 'success', payload: productDTO });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productRepository.updateProduct(req.params.pid, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    const productDTO = new ProductDTO(updatedProduct);
    res.status(200).json({ status: 'success', payload: productDTO });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productRepository.deleteProduct(req.params.pid);
    if (!deletedProduct) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
