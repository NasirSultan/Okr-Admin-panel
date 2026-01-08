import { useEffect, useState } from "react"
import AdminLayout from "@/components/layout/AdminLayout"
import {
  getAllPointAdjustments,
  createPointAdjustment,
  updatePointAdjustment,
  deletePointAdjustment
} from "../api/pointAdjustmentApi"

export default function PointAdjustmentManager() {
  const [points, setPoints] = useState([])
  const [form, setForm] = useState({ level: "", xpRangeStart: "", title: "" })
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const loadData = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await getAllPointAdjustments()
      const data = res.data || []
      setPoints(data)

      if (!editId) {
        const next =
          data.length > 0 ? Math.max(...data.map(i => i.level)) + 1 : 1
        setForm(f => ({ ...f, level: next }))
      }
    } catch {
      setError("Failed to load point adjustments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setMessage("")
    setError("")

    const payload = {
      level: Number(form.level),
      xpRangeStart: Number(form.xpRangeStart),
      title: form.title
    }

    try {
      if (editId) {
        await updatePointAdjustment(editId, payload)
        setMessage("Point updated successfully")
      } else {
        await createPointAdjustment(payload)
        setMessage("Point created successfully")
      }

      setForm({ level: "", xpRangeStart: "", title: "" })
      setEditId(null)
      loadData()
    } catch (err) {
      setError(err.response?.data?.message || "Action failed")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = item => {
    setEditId(item.id)
    setForm({
      level: item.level,
      xpRangeStart: item.xpRangeStart,
      title: item.title
    })
    setMessage("")
    setError("")
  }

  const handleDelete = async id => {
    setDeletingId(id)
    setMessage("")
    setError("")

    try {
      await deletePointAdjustment(id)
      setMessage("Point deleted successfully")
      setEditId(null)
      setForm({ level: "", xpRangeStart: "", title: "" })
      loadData()
    } catch {
      setError("Delete failed")
    } finally {
      setDeletingId(null)
    }
  }

  const cancelEdit = () => {
    setEditId(null)
    setForm({ level: "", xpRangeStart: "", title: "" })
    setMessage("")
    setError("")
    loadData()
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-2 sm:p-4 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Point Adjustment Manager
          </h2>
          <p className="text-sm text-gray-500">
            Manage XP levels and titles
          </p>
        </div>

        {message && (
          <div className="bg-green-100 text-green-800 p-3 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg border shadow p-4 sm:p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4"
          >
            <input
              type="number"
              value={form.level}
              disabled={editId !== null}
              onChange={e => setForm({ ...form, level: e.target.value })}
              placeholder="Level"
              className="border p-2 rounded w-full"
              required
            />

            <input
              type="number"
              value={form.xpRangeStart}
              onChange={e =>
                setForm({ ...form, xpRangeStart: e.target.value })
              }
              placeholder="XP Range Start"
              className="border p-2 rounded w-full"
              required
            />

            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className="border p-2 rounded w-full"
              required
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-red-600 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                {saving ? "Saving..." : editId ? "Update" : "Create"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="border px-4 py-2 rounded w-full sm:w-auto"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg border shadow overflow-x-auto">
          {loading ? (
            <div className="p-4 text-gray-500">Loading...</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Level</th>
                  <th className="p-3 text-left">XP Start</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {points.length > 0 ? (
                  points.map(item => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3">{item.level}</td>
                      <td className="p-3">{item.xpRangeStart}</td>
                      <td className="p-3">{item.title}</td>
                      <td className="p-3 flex flex-col sm:flex-row justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          {deletingId === item.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-center text-gray-500"
                    >
                      No point adjustments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
