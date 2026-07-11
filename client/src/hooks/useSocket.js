import { useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import io from 'socket.io-client'
import {
  addMessage,
  updateMessageStatus,
  setOnlineUsers,
  addTypingUser,
  removeTypingUser,
} from '../redux/chatSlice'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

let socket = null

export const useSocket = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { token } = useSelector(state => state.auth)
  const socketRef = useRef(null)

  const connect = useCallback(() => {
    if (!socket && token) {
      socket = io(SOCKET_URL, {
        auth: {
          token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      })

      socket.on('connect', () => {
        console.log('Connected to socket server')
      })

      socket.on('user_online', (data) => {
        console.log('User online:', data.userId)
      })

      socket.on('user_offline', (data) => {
        console.log('User offline:', data.userId)
      })

      socket.on('online_users_updated', (users) => {
        dispatch(setOnlineUsers(users))
      })

      socket.on('receive_message', (message) => {
        dispatch(addMessage(message))
      })

      socket.on('message_read_receipt', ({ messageId }) => {
        dispatch(updateMessageStatus({ messageId, type: 'read' }))
      })

      socket.on('message_seen_receipt', ({ messageId }) => {
        dispatch(updateMessageStatus({ messageId, type: 'seen' }))
      })

      socket.on('user_typing', ({ senderId }) => {
        dispatch(addTypingUser(senderId))
      })

      socket.on('user_stop_typing', ({ senderId }) => {
        dispatch(removeTypingUser(senderId))
      })

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
      })

      socketRef.current = socket
    }
  }, [token, dispatch])

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect()
      socket = null
      socketRef.current = null
    }
  }, [])

  const emit = useCallback((event, data) => {
    if (socket?.connected) {
      socket.emit(event, data)
    }
  }, [])

  return { connect, disconnect, emit, socket: socketRef.current }
}

export default useSocket
