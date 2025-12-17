// controllers/contactController.js
import Contact from '../models/contactSchema.js';

// POST - Submit contact form
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required',
      });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      status: 'success',
      message: 'Thank you! Your message has been sent. We will get back to you soon.',
      data: { contact },
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send message. Please try again later.',
    });
  }
};

// GET - Admin: Get all contact messages
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 }) // newest first
      .select('-__v');

    res.status(200).json({
      status: 'success',
      results: contacts.length,
      data: { contacts },
    });
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch contact messages',
    });
  }
};

// Optional: Mark as read
export const markContactAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ status: 'fail', message: 'Contact not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { contact },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to update' });
  }
};