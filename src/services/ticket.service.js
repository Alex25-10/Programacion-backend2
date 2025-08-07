import TicketDAO from "../dao/TicketDAO.js";
import { generateTicketCode } from "../utils/generateTicketCode.js";

class TicketService {
    constructor() {
        this.ticketDAO = new TicketDAO();
    }

    /**
     * Crea un ticket de compra
     * @param {Object} purchaseData - Datos de la compra
     * @param {String} purchaseData.amount - Total de la compra
     * @param {String} purchaseData.purchaser - Email del comprador
     * @returns {Promise<Object>} Ticket creado
     */
    async createTicket({ amount, purchaser }) {
        try {
            const code = generateTicketCode();
            const purchase_datetime = new Date();

            const ticket = await this.ticketDAO.create({
                code,
                purchase_datetime,
                amount,
                purchaser
            });

            return ticket;
        } catch (error) {
            throw new Error(`Error al crear el ticket: ${error.message}`);
        }
    }

    /**
     * Obtiene todos los tickets
     */
    async getTickets() {
        return await this.ticketDAO.getAll();
    }

    /**
     * Obtiene un ticket por su ID
     */
    async getTicketById(id) {
        return await this.ticketDAO.getById(id);
    }
}

export default TicketService;
