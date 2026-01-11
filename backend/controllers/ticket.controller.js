const TicketModel = require('../models/ticket.model');
const TicketMessageModel = require('../models/ticketMessage.model');
const { successResponse, errorResponse, validationErrorResponse } = require('../utils/response');
const logger = require('../utils/logger');

exports.create = async (req, res, next) => {
  try {
    const { subject } = req.body;
    if (!subject) {
      const { response, statusCode } = validationErrorResponse('Subject is required');
      return res.status(statusCode).json(response);
    }

    const result = await TicketModel.create({ user_id: req.user_id, subject });
    const { response, statusCode } = successResponse({ id: result.insertId }, 'Ticket created successfully');
    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Create ticket error:', error);
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    const rows = await TicketModel.list({ user_id: req.user_id });
    const { response, statusCode } = successResponse(rows, 'Tickets retrieved successfully');
    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('List tickets error:', error);
    next(error);
  }
};

exports.messages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rows = await TicketMessageModel.list({ ticket_id: id });
    const { response, statusCode } = successResponse(rows, 'Messages retrieved successfully');
    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Get ticket messages error:', error);
    next(error);
  }
};

exports.addMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    if (!message) {
      const { response, statusCode } = validationErrorResponse('Message is required');
      return res.status(statusCode).json(response);
    }

    await TicketMessageModel.create({ ticket_id: id, sender_id: req.user_id, message });
    const { response, statusCode } = successResponse(null, 'Message added successfully');
    return res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Add message error:', error);
    next(error);
  }
};
