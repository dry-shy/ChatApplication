import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../hooks/useApi'
import { updateUser } from '../redux/authSlice'
import toast from 'react-hot-toast'

export default function Settings() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [formState, setFormState] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    bio: user?.bio || '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setFormState({
      username: user?.username || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
      bio: user?.bio || '',
    })
  }, [user])

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await authAPI.updateProfile(formState)
      dispatch(updateUser(response.data.user))
      toast.success('Profile settings saved')
      navigate('/chat')
    } catch (error) {
      toast.error('Failed to save settings')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-slate-400">Manage your profile and conversation preferences.</p>
          </div>
          <button
            onClick={() => navigate('/chat')}
            className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
          >
            Back to Chat
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Username</label>
            <input
              name="username"
              value={formState.username}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Email</label>
            <input
              name="email"
              value={formState.email}
              onChange={handleChange}
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Avatar URL</label>
            <input
              name="avatar"
              value={formState.avatar}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formState.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full px-4 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  )
}
