import React from 'react'

export default function ConversationList({ conversations, onSelectConversation, currentConversation }) {
  const getOtherUser = (conversation) => {
    return conversation.participants.find(p => p._id !== currentConversation)
  }

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-slate-400">
        <p>No conversations yet</p>
        <p className="text-sm">Start a new conversation by searching for users</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-700">
      {conversations.map((conv) => {
        const otherUser = getOtherUser(conv)
        return (
          <div
            key={conv._id}
            onClick={() => onSelectConversation(otherUser._id)}
            className={`p-4 cursor-pointer hover:bg-slate-700 transition ${
              currentConversation === otherUser._id ? 'bg-slate-700' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center">
                <span className="text-white font-semibold">{otherUser.username?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">{otherUser.username}</h3>
                <p className="text-slate-400 text-sm truncate">
                  {conv.lastMessage?.content || 'No messages yet'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {otherUser.isOnline && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
