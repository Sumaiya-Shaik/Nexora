
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Plus, CalendarDays, Pencil, Trash2,
  Pause, Play, RefreshCw
} from 'lucide-react'
import './FixedExpenses.css'

const API = 'http://localhost:8080/api/fixed-expenses'
const MONTHLY_API = `${API}/monthly`

const categories = [
  'Rent',
  'Food',
  'Travel',
  'Utilities',
  'Education',
  'Subscriptions',
  'Other'
]

function money(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`
}

function FixedExpenses() {
  const email = sessionStorage.getItem('nexoraUserEmail') || ''

  const [templates, setTemplates] = useState([])
  const [occurrences, setOccurrences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)

  const currentMonth = new Date().toLocaleDateString('en-CA').slice(0, 7)

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Rent')
  const [dueDay, setDueDay] = useState('1')

  const loadData = async () => {
    if (!email) {
      setError('Please log in again to manage fixed expenses.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const [templateResponse, monthlyResponse] = await Promise.all([
        axios.get(API, { params: { email } }),
        axios.get(MONTHLY_API, {
          params: { email, month: currentMonth }
        })
      ])

      setTemplates(Array.isArray(templateResponse.data)
        ? templateResponse.data : [])

      setOccurrences(Array.isArray(monthlyResponse.data)
        ? monthlyResponse.data : [])
    } catch (err) {
      console.error('Fixed expenses loading error:', err)
      setError('Could not load fixed expenses. Please check your backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setTitle('')
    setAmount('')
    setCategory('Rent')
    setDueDay('1')
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please log in again.')
      return
    }

    const payload = {
      userEmail: email,
      title: title.trim(),
      amount: Number(amount),
      category,
      dueDay: Number(dueDay)
    }

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload)
      } else {
        await axios.post(API, payload)
      }

      resetForm()
      await loadData()
    } catch (err) {
      console.error('Fixed expense save error:', err)
      setError('Unable to save this fixed expense.')
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setTitle(item.title)
    setAmount(String(item.amount))
    setCategory(item.category || 'Other')
    setDueDay(String(item.dueDay))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStatus = async (item) => {
    try {
      await axios.patch(`${API}/${item.id}/status`, null, {
        params: { active: !item.active }
      })
      await loadData()
    } catch (err) {
      setError('Unable to update the expense status.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this fixed expense?')) return

    try {
      await axios.delete(`${API}/${id}`)
      await loadData()
    } catch (err) {
      setError('Unable to delete this fixed expense.')
    }
  }

  const activeTotal = templates
    .filter(item => item.active)
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)

  const pendingTotal = occurrences
    .filter(item => item.status === 'PENDING')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)

  return (
    <div className="nexora-fixed-page">

      <div className="nexora-fixed-heading">
        <div>
          <span className="nexora-eyebrow">RECURRING PAYMENTS</span>
          <h2>My Fixed Expenses</h2>
          <p>Keep track of the payments you make every month.</p>
        </div>

        <button
          className="nexora-fixed-refresh"
          onClick={loadData}
          type="button"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="nexora-fixed-summary">
        <div className="nexora-fixed-summary-card">
          <span>Monthly Commitments</span>
          <h3>{money(activeTotal)}</h3>
          <small>From active fixed expenses</small>
        </div>

        <div className="nexora-fixed-summary-card">
          <span>Pending This Month</span>
          <h3>{money(pendingTotal)}</h3>
          <small>{currentMonth}</small>
        </div>

        <div className="nexora-fixed-summary-card">
          <span>Active Payments</span>
          <h3>{templates.filter(item => item.active).length}</h3>
          <small>Recurring templates</small>
        </div>
      </div>

      <div className="nexora-fixed-card">
        <span className="nexora-eyebrow">
          {editingId ? 'UPDATE PAYMENT' : 'NEW RECURRING PAYMENT'}
        </span>

        <h3>{editingId ? 'Edit Fixed Expense' : 'Add Fixed Expense'}</h3>

        <form className="nexora-fixed-form" onSubmit={handleSubmit}>
          <label>
            Expense Name
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Room Rent"
              required
            />
          </label>

          <label>
            Monthly Amount (₹)
            <input
              type="number"
              min="0.01"
              step="any"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 8000"
              required
            />
          </label>

          <label>
            Category
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Monthly Due Day
            <input
              type="number"
              min="1"
              max="31"
              value={dueDay}
              onChange={e => setDueDay(e.target.value)}
              required
            />
          </label>

          <div className="nexora-fixed-form-actions">
            <button className="nexora-primary-button" type="submit">
              <Plus size={17} />
              {editingId ? 'Save Changes' : 'Add Fixed Expense'}
            </button>

            {editingId && (
              <button
                className="nexora-fixed-cancel"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && <p className="nexora-error">{error}</p>}
      </div>

      <div className="nexora-fixed-card">
        <div className="nexora-fixed-section-heading">
          <div>
            <span className="nexora-eyebrow">YOUR RECURRING LIST</span>
            <h3>Fixed Payment Templates</h3>
          </div>
          <CalendarDays color="#7655D9" />
        </div>

        {loading ? (
          <p>Loading fixed expenses...</p>
        ) : templates.length === 0 ? (
          <p className="nexora-fixed-empty">
            No fixed expenses yet. Add your first monthly payment above.
          </p>
        ) : (
          templates.map(item => (
            <div className="nexora-fixed-row" key={item.id}>
              <div className="nexora-fixed-item-icon">
                <CalendarDays size={19} />
              </div>

              <div className="nexora-fixed-item-info">
                <strong>{item.title}</strong>
                <small>
                  {item.category} · Due day {item.dueDay}
                </small>
                <small>{item.active ? 'Active' : 'Paused'}</small>
              </div>

              <strong className="nexora-fixed-amount">
                {money(item.amount)}
              </strong>

              <div className="nexora-fixed-actions">
                <button
                  type="button"
                  title="Edit"
                  onClick={() => handleEdit(item)}
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  title={item.active ? 'Pause' : 'Resume'}
                  onClick={() => handleStatus(item)}
                >
                  {item.active
                    ? <Pause size={16} />
                    : <Play size={16} />}
                </button>

                <button
                  type="button"
                  title="Delete"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="nexora-fixed-card">
        <span className="nexora-eyebrow">MONTHLY PAYMENT TRACKER</span>
        <h3>Payments for {currentMonth}</h3>

        {loading ? (
          <p>Loading monthly payments...</p>
        ) : occurrences.length === 0 ? (
          <p className="nexora-fixed-empty">
            No monthly payments generated yet. Add an active fixed expense
            to see its monthly payment here.
          </p>
        ) : (
          occurrences.map(item => (
            <div className="nexora-fixed-row" key={item.id}>
              <div className="nexora-fixed-item-icon">
                <CalendarDays size={19} />
              </div>

              <div className="nexora-fixed-item-info">
                <strong>{item.title}</strong>
                <small>{item.category} · Due {item.dueDate}</small>
              </div>

              <strong className="nexora-fixed-amount">
                {money(item.amount)}
              </strong>

              <span className={`nexora-fixed-status ${
                item.status === 'PAID' ? 'paid' : 'pending'
              }`}>
                {item.status}
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default FixedExpenses
