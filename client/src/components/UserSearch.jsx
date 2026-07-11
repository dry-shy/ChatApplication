import React, { useEffect, useState, useRef } from 'react'
import { authAPI } from '../hooks/useApi'
import toast from 'react-hot-toast'

export default function UserSearch({ onUserSelect }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Type a name or email to search')
  const abortControllerRef = useRef(null)

  useEffect(() => {
    const query = searchQuery.trim()

    if (!query) {
      setSearchResults([])
      setStatusMessage('Type a name or email to search')
      return
    }

    setLoading(true)
    setStatusMessage('Searching...')

    const handler = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      try {
        const response = await authAPI.searchUsers(query, {
          signal: abortControllerRef.current.signal,
        })
        const users = response.data?.users || []
        setSearchResults(users)
        setStatusMessage(users.length === 0 ? 'No users found' : '')
      } catch (error) {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          toast.error('Search failed')
          setStatusMessage('Search failed')
        }
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      clearTimeout(handler)
      abortControllerRef.current?.abort()
    }
  }, [searchQuery])

  return (
    <div className="p-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search users..."
        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-4 space-y-2">
        {loading && <div className="text-slate-400 text-center">Searching...</div>}

        {!loading && statusMessage && (
          <div className="text-slate-400 text-center py-4">{statusMessage}</div>
        )}

        {searchResults.map((user) => (
          <div
            key={user._id}
            onClick={() => onUserSelect(user._id)}
            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg cursor-pointer transition flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold">{user.username?.charAt(0)?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{user.username}</p>
              <p className="text-slate-400 text-sm truncate">{user.email}</p>
            </div>
            {user.isOnline && (
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
