import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSocket } from '../hooks/useSocket'
import { messageAPI } from '../hooks/useApi'
import { setConversations, setMessages, setCurrentConversation } from '../redux/chatSlice'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import toast from 'react-hot-toast'

export default function ChatPage() {
  const dispatch = useDispatch()
  const { conversations, currentConversation } = useSelector(state => state.chat)
  const { user } = useSelector(state => state.auth)
  const { connect, disconnect, emit } = useSocket()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Connect to socket
    connect()

    // Load conversations
    loadConversations()

    return () => {
      disconnect()
    }
  }, [])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const response = await messageAPI.getConversations()
      dispatch(setConversations(response.data.conversations))
    } catch (error) {
      toast.error('Failed to load conversations')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectConversation = async (userId) => {
    dispatch(setCurrentConversation(userId))
    
    try {
      const response = await messageAPI.getMessages(userId)
      dispatch(setMessages(response.data.messages))
    } catch (error) {
      toast.error('Failed to load messages')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar 
        conversations={conversations} 
        onSelectConversation={handleSelectConversation}
        currentConversation={currentConversation}
      />
      {currentConversation ? (
        <ChatWindow 
          conversation={currentConversation}
          onSendMessage={(message) => {
            emit('send_message', message)
          }}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to Chat</h2>
            <p className="text-slate-400">Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )
}
