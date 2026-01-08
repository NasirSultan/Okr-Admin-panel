import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { triggerWeeklyEmail } from '../api/userManagement'

export default function WeeklyEmailTrigger() {
  const [lastTrigger, setLastTrigger] = useState('')
  const [autoSend, setAutoSend] = useState(false)
  const [loading, setLoading] = useState(false)

  const getLastMonday = () => {
    const now = new Date()
    const day = now.getDay()
    const lastMonday = new Date(now)
    lastMonday.setDate(now.getDate() - ((day + 6) % 7))
    lastMonday.setHours(9, 0, 0, 0)
    return lastMonday.toISOString()
  }

  // Load auto-send state from localStorage
  useEffect(() => {
    const storedAutoSend = localStorage.getItem('weeklyEmailAuto') === 'true'
    setAutoSend(storedAutoSend)
    setLastTrigger(localStorage.getItem('lastWeeklyEmail') || getLastMonday())
  }, [])

  const handleTrigger = async () => {
    const confirmSend = window.confirm('Are you sure you want to trigger the weekly email?')
    if (!confirmSend) return

    try {
      setLoading(true)
      await triggerWeeklyEmail()
      const now = new Date().toISOString()
      setLastTrigger(now)
      localStorage.setItem('lastWeeklyEmail', now)
      alert('Weekly email triggered successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to trigger weekly email')
    } finally {
      setLoading(false)
    }
  }

  const toggleAutoSend = () => {
    const newValue = !autoSend
    setAutoSend(newValue)
    localStorage.setItem('weeklyEmailAuto', newValue.toString())
  }

  useEffect(() => {
    if (!autoSend) return

    const scheduleNext = () => {
      const now = new Date()
      const day = now.getDay()
      const nextMonday = new Date(now)
      nextMonday.setDate(now.getDate() + ((1 + 7 - day) % 7))
      nextMonday.setHours(9, 0, 0, 0)
      const delay = nextMonday.getTime() - now.getTime()

      const timer = setTimeout(async () => {
        await handleTrigger()
        scheduleNext()
      }, delay)

      return () => clearTimeout(timer)
    }

    const cleanup = scheduleNext()
    return cleanup
  }, [autoSend])

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-t-4 border-red-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black mb-1">Weekly Email Campaign</h1>
              <p className="text-black">Manage automated weekly email notifications</p>
            </div>
            <div className="bg-red-100 p-4 rounded-xl">
              <svg className="w-12 h-12 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleTrigger}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-black font-semibold px-6 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
            >
              {loading ? 'Sending...' : 'Trigger Weekly Email'}
            </button>

            <button
              onClick={toggleAutoSend}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold shadow-lg transition transform hover:-translate-y-0.5 ${
                autoSend
                  ? 'bg-gradient-to-r from-red-400 to-red-500 text-black hover:from-red-500 hover:to-red-600'
                  : 'bg-gray-300 text-black hover:bg-gray-400'
              }`}
            >
              Auto Send: {autoSend ? 'On' : 'Off'}
            </button>
          </div>

          {/* Last Trigger Info */}
          {lastTrigger && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-700 p-4 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-black">
                Last triggered: <span className="font-semibold text-black">{new Date(lastTrigger).toLocaleString()}</span>
              </p>
            </div>
          )}
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-red-700">
            <h2 className="text-xl font-bold text-black mb-2">Email Schedule</h2>
            <p className="text-black">Emails are sent automatically every Monday at 9:00 AM when Auto Send is enabled.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-red-500">
            <h2 className="text-xl font-bold text-black mb-2">Campaign Types</h2>
            <ul className="space-y-4">
              <li className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <h3 className="font-semibold text-black">Re-engagement Campaigns</h3>
                <p className="text-black text-sm">For inactive users. Example: "We noticed you haven't played recently. Your journey doesn't have to stop here."</p>
              </li>
              <li className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-lg">
                <h3 className="font-semibold text-black">Performance Reports</h3>
                <p className="text-black text-sm">Weekly performance updates for active users. Example: "Platform updates and achievements summary."</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
