import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { messageAPI } from '../hooks/useApi'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { addMessage, updateMessage, deleteMessage } from '../redux/chatSlice'
import toast from 'react-hot-toast'

export default function ChatWindow({ conversation, onSendMessage }) {
  const { messages } = useSelector(state => state.chat)
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [recipientInfo, setRecipientInfo] = useState(null)
  const currentUserId = user?._id || user?.id

  useEffect(() => {
    // Get recipient info from messages
    if (messages.length > 0) {
      const otherUser = messages[0].sender._id === currentUserId ? messages[0].receiver : messages[0].sender
      setRecipientInfo(otherUser)
    } else {
      setRecipientInfo(null)
    }
  }, [messages, currentUserId])

  const handleSendMessage = async (content, messageType = 'text', mediaUrl = null) => {
    try {
      const response = await messageAPI.sendMessage({
        receiverId: conversation,
        content,
        messageType,
        mediaUrl,
      })

      const message = response.data.message
      dispatch(addMessage(message))
      onSendMessage(message)
    } catch (error) {
      toast.error('Failed to send message')
      console.error(error)
    }
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      await messageAPI.deleteMessage(messageId)
      dispatch(deleteMessage(messageId))
      toast.success('Message deleted')
    } catch (error) {
      toast.error('Failed to delete message')
      console.error(error)
    }
  }

  const handleRenameMessage = async (messageId, content) => {
    try {
      const response = await messageAPI.updateMessage(messageId, content)
      dispatch(updateMessage(response.data.message))
      toast.success('Message updated')
    } catch (error) {
      toast.error('Failed to update message')
      console.error(error)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      {/* Chat Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold">{recipientInfo?.username?.charAt(0)?.toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-white font-semibold">{recipientInfo?.username}</h2>
            <p className="text-slate-400 text-sm">
              {recipientInfo?.isOnline ? 'Active now' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        onDeleteMessage={handleDeleteMessage}
        onRenameMessage={handleRenameMessage}
      />

      {/* Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  )
}
