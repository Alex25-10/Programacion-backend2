import TicketDAO from '../dao/TicketDAO.js';

const ticketDAO = new TicketDAO();

export default class TicketRepository {
  async getTickets() {
    return await ticketDAO.getAll();
  }

  async getTicketById(id) {
    return await ticketDAO.getById(id);
  }

  async createTicket(data) {
    return await ticketDAO.create(data);
  }

  async deleteTicket(id) {
    return await ticketDAO.delete(id);
  }

  async updateTicket(id, data) {
    return await ticketDAO.update(id, data);
  }
}
