const SupportTicket = require("../../models/SupportTicket");

exports.listTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find().populate("user", "name email phone").sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.create(req.body);
    res.status(201).json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
