import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  onlineUsers: [],
  typingUsers: [],
  loading: false,
  error: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload
    },
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    updateMessageStatus: (state, action) => {
      const message = state.messages.find(m => m._id === action.payload.messageId)
      if (message) {
        if (action.payload.type === 'read') {
          message.isRead = true
        } else if (action.payload.type === 'seen') {
          message.isSeen = true
        }
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload
    },
    addTypingUser: (state, action) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload)
      }
    },
    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter(id => id !== action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setConversations,
  setCurrentConversation,
  setMessages,
  addMessage,
  updateMessageStatus,
  setOnlineUsers,
  addTypingUser,
  removeTypingUser,
  setLoading,
  setError,
  clearError,
} = chatSlice.actions

export default chatSlice.reducer
