import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, messageType = 'text', mediaUrl } = req.body;
    const senderId = req.userId;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver ID and content are required' });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      conversation: conversation._id,
      content,
      messageType,
      mediaUrl,
    });

    await message.populate('sender', 'username avatar');

    // Update conversation's last message
    conversation.lastMessage = message._id;
    conversation.lastMessageTime = Date.now();
    await conversation.save();

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.query;
    const senderId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar');

    const totalMessages = await Message.countDocuments({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    res.json({
      success: true,
      messages: messages.reverse(),
      totalMessages,
      hasMore: skip + limit < totalMessages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.body;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true, readAt: Date.now() },
      { new: true }
    );

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const { messageId } = req.body;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isSeen: true, seenAt: Date.now() },
      { new: true }
    );

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { messageId, content } = req.body;

    if (!messageId || !content?.trim()) {
      return res.status(400).json({ message: 'Message ID and content are required' });
    }

    const message = await Message.findOneAndUpdate(
      { _id: messageId, sender: req.userId },
      { content: content.trim() },
      { new: true }
    ).populate('sender', 'username avatar').populate('receiver', 'username avatar');

    if (!message) {
      return res.status(404).json({ message: 'Message not found or not authorized' });
    }

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({ lastMessageTime: -1 })
      .populate('participants', 'username email avatar isOnline lastSeen')
      .populate('lastMessage', 'content createdAt sender');

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.body;

    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
