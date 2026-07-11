import React, { useState, useRef } from 'react'
import EmojiPicker from 'emoji-picker-react'

export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const fileInputRef = useRef(null)

  const handleSend = async () => {
    if (!message.trim() || isSending) return

    setIsSending(true)
    try {
      await onSendMessage(message, 'text')
      setMessage('')
      setShowEmojiPicker(false)
    } finally {
      setIsSending(false)
    }
  }

  const handleEmojiClick = (emojiObject) => {
    setMessage(message + emojiObject.emoji)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        await onSendMessage(`Shared an image`, 'image', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        await onSendMessage(`Shared a PDF`, 'pdf', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="bg-slate-800 border-t border-slate-700 p-4">
      <div className="relative">
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-0 z-50">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <div className="flex items-end space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-blue-500 hover:bg-slate-700 rounded-lg transition"
            title="Share image"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
            </svg>
          </button>

          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-blue-500 hover:bg-slate-700 rounded-lg transition"
            title="Add emoji"
          >
            😊
          </button>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-24"
            rows="1"
          />

          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-2.977 5.951 2.977a1 1 0 001.169-1.409l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
