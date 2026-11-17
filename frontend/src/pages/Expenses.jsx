
import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Plus, Wallet, Receipt, Trash2, ShoppingBag, Utensils,
  House, Car, CircleDollarSign, CalendarDays,
  TrendingUp, LoaderCircle, Repeat, Pencil, Pause, Play
} from 'lucide-react'
import './Expenses.css'

const API = 'https://nexora-g387.onrender.com/api/expenses'
const FIXED_API = 'https://nexora-g387.onrender.com/api/fixed-expenses'
const MONTHLY_API = `${FIXED_API}/monthly`

const categories = [
  'Food', 'Accommodation', 'Travel', 'Shopping',
  'Subscriptions', 'Entertainment', 'Education',
  'Utilities', 'Other'
]

const getIcon = (category) => {
  const icons = {
    Food: Utensils,
    Accommodation: House,
    Travel: Car,
    Shopping: ShoppingBag,
    Subscriptions: Receipt,
    Utilities: House
  }
  return icons[category] || CircleDollarSign
}

function Expenses() {
  const email = sessionStorage.getItem('nexoraUserEmail') || ''
  const currentMonth = new Date().toLocaleDateString('en-CA').slice(0, 7)

  const [expenses, setExpenses] = useState([])
  const [fixedExpenses, setFixedExpenses] = useState([])
  const [occurrences, setOccurrences] = useState([])

  const [type, setType] = useState('daily')
  const [filter, setFilter] = useState('all')

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-CA')
  )
  const [dueDay, setDueDay] = useState('1')
  const [editingId, setEditingId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const formatMoney = (value) =>
    `₹${Number(value || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 2
    })}`

  const loadExpenses = async () => {
    if (!email) {
      setError('Please log in again to view your expenses.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const [dailyResponse, fixedResponse, monthlyResponse] =
        await Promise.all([
          axios.get(API, { params: { email } }),
          axios.get(FIXED_API, { params: { email } }),
          axios.get(MONTHLY_API, {
            params: { email, month: currentMonth }
          })
        ])

      setExpenses(Array.isArray(dailyResponse.data)
        ? dailyResponse.data : [])

      setFixedExpenses(Array.isArray(fixedResponse.data)
        ? fixedResponse.data : [])

      setOccurrences(Array.isArray(monthlyResponse.data)
        ? monthlyResponse.data : [])

    } catch (err) {
      console.error('Expense loading error:', err)
      setError('Unable to load expenses. Check your backend connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExpenses()
  }, [])

  const activeFixed = fixedExpenses.filter(item => item.active)

  const dailyTotal = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0), 0
  )

  const fixedTotal = occurrences.reduce(
    (sum, item) => sum + Number(item.amount || 0), 0
  )

  // Each monthly fixed payment is counted once.
  const total = dailyTotal + fixedTotal

  // Get monthly income or pocket money from onboarding
const financialData = JSON.parse(
  sessionStorage.getItem('nexoraFinancialData') || '{}'
)
const monthlyIncome = Number(financialData.income || 0)

// Calculate remaining balance
const totalMonthlyExpenses = dailyTotal + fixedTotal

const remainingBalance = monthlyIncome - totalMonthlyExpenses
const pendingTotal = 0

  const categoryTotals = categories
    .map(name => {
      const dailyAmount = expenses
        .filter(item => item.category === name)
        .reduce((sum, item) => sum + Number(item.amount || 0), 0)

      const fixedAmount = occurrences
        .filter(item => item.category === name)
        .reduce((sum, item) => sum + Number(item.amount || 0), 0)

      return {
        name,
        amount: dailyAmount + fixedAmount
      }
    })
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  const resetForm = () => {
    setTitle('')
    setAmount('')
    setCategory('Food')
    setDate(new Date().toLocaleDateString('en-CA'))
    setDueDay('1')
    setEditingId(null)
    setType('daily')
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError('Please log in again.')
      return
    }

    if (!title.trim() || !amount || Number(amount) <= 0) {
      setError('Please enter valid expense details.')
      return
    }

    if (type === 'recurring' &&
        (Number(dueDay) < 1 || Number(dueDay) > 31)) {
      setError('Due day must be between 1 and 31.')
      return
    }

    setSaving(true)

    try {
      if (type === 'recurring') {
        const payload = {
          userEmail: email,
          title: title.trim(),
          amount: Number(amount),
          category,
          dueDay: Number(dueDay)
        }

        if (editingId) {
          await axios.put(`${FIXED_API}/${editingId}`, payload)
        } else {
          await axios.post(FIXED_API, payload)
        }
      } else {
        await axios.post(API, {
          userEmail: email,
          title: title.trim(),
          amount: Number(amount),
          category,
          date
        })
      }

      resetForm()
      await loadExpenses()

      setSuccess(
        type === 'recurring'
          ? 'Monthly recurring expense saved!'
          : 'Expense added successfully!'
      )
    } catch (err) {
      console.error('Expense save error:', err)
      setError(
        err.response?.data?.message ||
        'Unable to save the expense. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setType('recurring')
    setTitle(item.title)
    setAmount(String(item.amount))
    setCategory(item.category || 'Other')
    setDueDay(String(item.dueDay))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteDaily = async (id) => {
    if (!window.confirm('Delete this expense?')) return

    try {
      await axios.delete(`${API}/${id}`)
      await loadExpenses()
      setSuccess('Expense deleted successfully!')
    } catch (err) {
      setError('Unable to delete this expense.')
    }
  }

  const handleFixedStatus = async (item) => {
    try {
      await axios.patch(`${FIXED_API}/${item.id}/status`, null, {
        params: { active: !item.active }
      })
      await loadExpenses()
    } catch (err) {
      setError('Unable to update recurring expense.')
    }
  }

  const handleDeleteFixed = async (id) => {
    if (!window.confirm('Delete this recurring expense?')) return

    try {
      await axios.delete(`${FIXED_API}/${id}`)
      await loadExpenses()
      setSuccess('Recurring expense deleted.')
    } catch (err) {
      setError('Unable to delete recurring expense.')
    }
  }

  const dailyRecords = expenses.map(item => ({
    ...item,
    recordType: 'daily'
  }))

  const recurringRecords = occurrences.map(item => ({
    ...item,
    recordType: 'recurring',
    date: item.dueDate
  }))

  const allRecords = [...dailyRecords, ...recurringRecords]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  const displayedRecords = filter === 'all'
    ? allRecords
    : filter === 'recurring'
      ? recurringRecords
      : dailyRecords

  return (
    <div className="expense-page">

      <div className="expense-heading">
        <div>
          <span className="expense-eyebrow">YOUR MONEY, YOUR CONTROL</span>
          <h1>My Expenses</h1>
          <p>All your recurring payments and daily spending, together.</p>
        </div>
        <div className="expense-heading-icon">
          <Wallet size={25} />
        </div>
      </div>

      <div className="expense-summary">

        <div className="expense-summary-card">
          <div className="expense-summary-icon"><Wallet /></div>
<div>
  <span>Remaining Balance</span>
  <h2>{formatMoney(remainingBalance)}</h2>
</div>
        </div>

        <div className="expense-summary-card">
          <div className="expense-summary-icon"><Repeat /></div>
          <div>
            <span>Fixed Commitments</span>
            <h2>{formatMoney(fixedTotal)}</h2>
          </div>
        </div>

      </div>

      <div className="expense-content-grid">

        <section className="expense-panel expense-form-panel">
          <div className="expense-panel-heading">
            <div>
              <span className="expense-eyebrow">TRACK YOUR SPENDING</span>
              <h2>{editingId ? 'Edit Recurring Expense' : 'Add an Expense'}</h2>
            </div>
            <div className="expense-small-icon"><Plus size={21} /></div>
          </div>

          <div className="expense-type-switch">
            <button
              type="button"
              className={type === 'daily' ? 'selected' : ''}
              onClick={() => {
                setType('daily')
                setEditingId(null)
              }}
            >
              <Receipt size={16} /> One-time
            </button>

            <button
              type="button"
              className={type === 'recurring' ? 'selected' : ''}
              onClick={() => {
                setType('recurring')
                setEditingId(null)
              }}
            >
              <Repeat size={16} /> Monthly recurring
            </button>
          </div>

          <form className="expense-form" onSubmit={handleAddExpense}>

            <div className="expense-form-field">
              <label>Expense Name</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Room Rent, Lunch"
                required
              />
            </div>

            <div className="expense-form-field">
              <label>Amount (₹)</label>
              <input
                type="number"
                min="0.01"
                step="any"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="expense-form-field">
              <label>Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {categories.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {type === 'daily' ? (
              <div className="expense-form-field">
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="expense-form-field">
                <label>Monthly Due Day</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={dueDay}
                  onChange={e => setDueDay(e.target.value)}
                  required
                />
              </div>
            )}

            <button
              className="expense-submit"
              type="submit"
              disabled={saving}
            >
              {saving
                ? <LoaderCircle size={17} className="expense-spinner" />
                : <Plus size={18} />}
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Save Changes'
                  : 'Add Expense'}
            </button>

            {editingId && (
              <button
                className="expense-submit"
                type="button"
                onClick={resetForm}
              >
                Cancel Editing
              </button>
            )}

          </form>

          {error && <p className="expense-error">{error}</p>}
          {success && <p className="expense-success">{success}</p>}
        </section>

        <section className="expense-panel expense-category-panel">
          <div className="expense-panel-heading">
            <div>
              <span className="expense-eyebrow">WHERE YOUR MONEY GOES</span>
              <h2>Category Breakdown</h2>
            </div>
            <TrendingUp color="#7655D9" />
          </div>

          {categoryTotals.length === 0 ? (
            <p className="expense-empty">
              Your category breakdown will appear here.
            </p>
          ) : (
            <div className="expense-category-list">
              {categoryTotals.map(item => {
                const Icon = getIcon(item.name)
                const percentage = total
                  ? item.amount / total * 100
                  : 0

                return (
                  <div className="expense-category-item" key={item.name}>
                    <div className="expense-category-top">
                      <div className="expense-category-name">
                        <Icon size={18} />
                        <span>{item.name}</span>
                      </div>
                      <strong>{formatMoney(item.amount)}</strong>
                    </div>

                    <div className="expense-progress-track">
                      <div
                        className="expense-progress-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="expense-category-percent">
                      {percentage.toFixed(1)}% of monthly expenses
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </section>

      </div>

      <section className="expense-panel">
        <div className="expense-panel-heading">
          <div>
            <span className="expense-eyebrow">MANAGE YOUR RECURRING PAYMENTS</span>
            <h2>Fixed Expenses</h2>
          </div>
          <Repeat color="#7655D9" />
        </div>

        {loading ? (
          <p className="expense-empty">Loading...</p>
        ) : fixedExpenses.length === 0 ? (
          <p className="expense-empty">
            No recurring expenses yet. Add rent, PG fees or other monthly payments above.
          </p>
        ) : (
          <div className="expense-transaction-list">
            {fixedExpenses.map(item => (
              <div className="expense-transaction" key={item.id}>
                <div className="expense-transaction-icon">
                  <CalendarDays size={20} />
                </div>

                <div className="expense-transaction-info">
                  <strong>{item.title}</strong>
                  <span>
                    {item.category} · Due day {item.dueDay} ·
                    {' '}{item.active ? 'Active' : 'Paused'}
                  </span>
                </div>

                <strong className="expense-transaction-amount">
                  {formatMoney(item.amount)}
                </strong>

                <button
                  type="button"
                  className="expense-delete"
                  title="Edit"
                  onClick={() => handleEdit(item)}
                >
                  <Pencil size={17} />
                </button>

                <button
                  type="button"
                  className="expense-delete"
                  title={item.active ? 'Pause' : 'Resume'}
                  onClick={() => handleFixedStatus(item)}
                >
                  {item.active ? <Pause size={17} /> : <Play size={17} />}
                </button>

                <button
                  type="button"
                  className="expense-delete"
                  title="Delete"
                  onClick={() => handleDeleteFixed(item.id)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="expense-panel expense-transactions">
        <div className="expense-panel-heading">
          <div>
            <span className="expense-eyebrow">YOUR SPENDING HISTORY</span>
            <h2>All Transactions</h2>
          </div>
          <span className="expense-count">{displayedRecords.length} records</span>
        </div>

        <div className="expense-type-switch">
          {[
            ['all', 'All Expenses'],
            ['recurring', 'Recurring'],
            ['daily', 'One-time']
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={filter === value ? 'selected' : ''}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="expense-empty">Loading your expenses...</p>
        ) : displayedRecords.length === 0 ? (
          <p className="expense-empty">
            No expenses found in this filter.
          </p>
        ) : (
          <div className="expense-transaction-list">
            {displayedRecords.map(item => {
              const Icon = getIcon(item.category)

              return (
                <div
                  className="expense-transaction"
                  key={`${item.recordType}-${item.id}`}
                >
                  <div className="expense-transaction-icon">
                    {item.recordType === 'recurring'
                      ? <Repeat size={20} />
                      : <Icon size={20} />}
                  </div>

                  <div className="expense-transaction-info">
                    <strong>{item.title}</strong>
                    <span>
                      {item.category} · {item.date}
                      {' · '}
                      {item.recordType === 'recurring'
                        ? `Fixed · ${item.status}`
                        : 'One-time'}
                    </span>
                  </div>

                  <strong className="expense-transaction-amount">
                    {formatMoney(item.amount)}
                  </strong>

                  {item.recordType === 'daily' && (
                    <button
                      className="expense-delete"
                      onClick={() => handleDeleteDaily(item.id)}
                      title="Delete expense"
                      type="button"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      <div className="expense-footer">
        Made with care by Nexora ✦
      </div>

    </div>
  )
}

export default Expenses
