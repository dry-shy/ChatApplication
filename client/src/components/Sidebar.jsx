import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/authSlice'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../hooks/useApi'
import toast from 'react-hot-toast'
import ConversationList from './ConversationList'
import UserSearch from './UserSearch'

export default function Sidebar({ conversations, onSelectConversation, currentConversation }) {
  const [searchMode, setSearchMode] = useState(false)
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      dispatch(logout())
      navigate('/login')
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  return (
    <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold hover:bg-blue-700"
            >
              {user?.username?.charAt(0)?.toUpperCase()}
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-slate-600">
                  <p className="text-white font-semibold">{user?.username}</p>
                  <p className="text-slate-400 text-sm">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-600 rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setSearchMode(!searchMode)}
          className="w-full py-2 px-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
        >
          {searchMode ? 'Back to Chats' : 'Search Users'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {searchMode ? (
          <UserSearch onUserSelect={(userId) => {
            onSelectConversation(userId)
            setSearchMode(false)
          }} />
        ) : (
          <ConversationList 
            conversations={conversations}
            onSelectConversation={onSelectConversation}
            currentConversation={currentConversation}
          />
        )}
      </div>
    </div>
  )
}
