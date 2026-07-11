import React, { useEffect, useRef, useState } from 'react'

function MessageItem({ message, isOwn, onDeleteMessage, onRenameMessage }) {
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(message.content)

  useEffect(() => {
    setContent(message.content)
  }, [message.content])

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in`}>
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

          {editing ? (
            <div className="space-y-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 rounded bg-slate-800 text-white border border-slate-600"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="px-3 py-1 bg-slate-600 rounded text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (content.trim() && onRenameMessage) {
                      onRenameMessage(message._id, content.trim())
                      setEditing(false)
                    }
                  }}
                  className="px-3 py-1 bg-green-600 rounded text-white"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-white break-words">{message.content}</p>
          )}

          <div className="flex items-center justify-between gap-2 mt-2 text-xs text-slate-300">
            <span>
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <div className="flex items-center gap-2">
              {isOwn && (
                <>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="px-2 py-1 bg-slate-600 rounded hover:bg-slate-500"
                  >
                    {editing ? 'Cancel' : 'Rename'}
                  </button>
                  <button
                    onClick={() => onDeleteMessage?.(message._id)}
                    className="px-2 py-1 bg-red-600 rounded hover:bg-red-500"
                  >
                    Delete
                  </button>
                </>
              )}
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
    </div>
  )
}

export default function MessageList({ messages, currentUserId, onDeleteMessage, onRenameMessage }) {
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
        messages.map((message) => (
          <MessageItem
            key={message._id}
            message={message}
            isOwn={message.sender._id === currentUserId}
            onDeleteMessage={onDeleteMessage}
            onRenameMessage={onRenameMessage}
          />
        ))
      )}
      <div ref={endRef} />
    </div>
  )
}
