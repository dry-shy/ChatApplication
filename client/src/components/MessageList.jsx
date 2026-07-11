import React, { useEffect, useRef } from 'react'

export default function MessageList({ messages, currentUserId }) {
  const endRef = useRef(null)

  useEffect(() => {
    // Auto scroll to bottom
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-slate-400">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => {
          const isOwn = message.sender._id === currentUserId

          return (
            <div
              key={message._id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in`}
            >
              <div className="flex space-x-2 max-w-xs lg:max-w-md xl:max-w-lg">
                {!isOwn && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {message.sender.username?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}

                <div className={`${isOwn ? 'bg-blue-600' : 'bg-slate-700'} rounded-lg p-3`}>
                  {message.messageType === 'image' && message.mediaUrl && (
                    <img
                      src={message.mediaUrl}
                      alt="shared image"
                      className="max-w-full rounded mb-2 max-h-64"
                    />
                  )}

                  {message.messageType === 'pdf' && message.mediaUrl && (
                    <a
                      href={message.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:underline block mb-2"
                    >
                      PDF Document
                    </a>
                  )}

                  <p className="text-white break-words">{message.content}</p>

                  <div className="flex items-center justify-end space-x-1 mt-1 text-xs text-slate-300">
                    <span>
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isOwn && (
                      <>
                        {message.isSeen && <span>✓✓</span>}
                        {message.isRead && !message.isSeen && <span>✓</span>}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
      <div ref={endRef} />
    </div>
  )
}
