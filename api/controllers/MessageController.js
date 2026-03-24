import Message from "../models/message.js";
import User from "../models/user.js";
// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { recipient, content } = req.body;
    console.log(req.body)
    const message = new Message({
      sender: req.user._id,
      recipient,
      content,
    });
    await message.save();
    await message.populate('sender', 'firstName lastName');
    res.status(201).json({ status: 'success', data: { message } });
  } catch (err) {
    console.log(err)
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




// controllers/messageController.js

export const sendOffer = async (req, res) => {
  try {
    const { recipient, carId, offerAmount, content, preferredColor } = req.body;
    const sender = req.user._id;

    if (!recipient || !carId || !offerAmount) {
      return res.status(400).json({ status: false, message: "Missing required fields" });
    }

    const offer = new Message({
      sender,
      recipient,
      carId,
      content: content || `Offer: ₦${offerAmount.toLocaleString()}`,
      type: 'offer',
      offerAmount: Number(offerAmount),
      preferredColor,
      status: 'pending'
    });

    await offer.save();

    // Optional: Populate car and sender info for better notification
    await offer.populate([
      { path: 'carId', select: 'make model year price' },
      { path: 'sender', select: 'firstName lastName' }
    ]);

    res.status(201).json({
      status: true,
      message: "Offer sent successfully",
      data: offer
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Failed to send offer" });
  }
};



// controllers/messageController.js

export const getMyOffers = async (req, res) => {
  try {
    const userId = req.user._id;

    const offers = await Message.find({
      recipient: userId,
      type: 'offer'
    })
    .populate('sender', 'firstName lastName phoneNumber')
    .populate('carId', 'make model year price images title')
    .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      results: offers.length,
      data: { offers }
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to fetch offers" });
  }
};