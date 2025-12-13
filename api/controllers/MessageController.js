import Message from "../models/message.js";
import User from "../models/user.js";
// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { recipient, content } = req.body;
    const message = new Message({
      sender: req.user._id,
      recipient,
      content,
    });
    await message.save();
    await message.populate('sender', 'firstName lastName');
    res.status(201).json({ status: 'success', data: { message } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to send message' });
  }
};

// Get conversation with a user
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id },
      ],
    })
      .populate('sender', 'firstName lastName')
      .populate('recipient', 'firstName lastName')
      .sort({ createdAt: 1 });

    const seller = await User.findById(userId).select('firstName lastName carPartSellerInfo dealerInfo serviceProviderInfo');

    res.status(200).json({
      status: 'success',
      data: { messages, sellerName: `${seller.firstName} ${seller.lastName}` },
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: 'error', message: 'Failed to load conversation' });
  }
};

// Get all my conversations (for inbox)
export const getMyConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user._id }, { recipient: req.user._id }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$recipient',
              '$sender',
            ],
          },
          lastMessage: { $first: '$content' },
          lastMessageTime: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $ne: ['$sender', req.user._id] }, { $eq: ['$read', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          name: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
          lastMessage: 1,
          lastMessageTime: 1,
          unreadCount: 1,
        },
      },
    ]);

    res.status(200).json({ status: 'success', data: { conversations } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to load conversations' });
  }
};