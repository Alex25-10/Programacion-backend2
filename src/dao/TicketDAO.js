import { Ticket } from './models/TicketModel.js';
import mongoose from 'mongoose';

export default class TicketDAO {
  async getAll() {
    try {
      return await Ticket.find().lean();
    } catch (error) {
      throw new Error(`Error al obtener tickets: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID de ticket inválido');
      }
      return await Ticket.findById(id).lean();
    } catch (error) {
      throw new Error(`Error al obtener ticket: ${error.message}`);
    }
  }

  async create(data) {
    try {
      return await Ticket.create(data);
    } catch (error) {
      throw new Error(`Error al crear ticket: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID de ticket inválido');
      }
      return await Ticket.findByIdAndUpdate(id, data, { new: true, lean: true });
    } catch (error) {
      throw new Error(`Error al actualizar ticket: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID de ticket inválido');
      }
      return await Ticket.findByIdAndDelete(id).lean();
    } catch (error) {
      throw new Error(`Error al eliminar ticket: ${error.message}`);
    }
  }
}

