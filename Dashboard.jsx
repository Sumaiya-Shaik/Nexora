
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  LayoutDashboard, Wallet, ChartPie, Target, Sparkles,
  Bell, Settings, CircleHelp, Search, Plus, ArrowUpRight,
  ArrowDownRight, Menu, X, Send, Trash2, PiggyBank,
  TrendingUp, BriefcaseBusiness
} from 'lucide-react'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts'
import './Dashboard.css'
import Expenses from './Expenses'

const API = 'http://localhost:8080/api/expenses'

const COLORS = [
  '#A77E5D', '#C9A27E', '#DDBB9A',
  '#A9BBA5', '#765B48', '#D8C4AE'
]

const categories = [
  'Food', 'Travel', 'Rent', 'Shopping', 'Education', 'Other'
]

function money(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`
}

function readFinancialData() {
  try {
    return JSON.parse(
      sessionStorage.getItem('nexoraFinancialData') || '{}'
    )
  } catch {
    return {}
  }
}

function Dashboard() {
  const email = sessionStorage.getItem('nexoraUserEmail') || ''
  const financialData = readFinancialData()

  const firstName =
    sessionStorage.getItem('nexoraUserName') ||
    email.split('@')[0] ||
    'there'

  const userType = financialData.userType || 'Student'
  const initialExpenses = financialData.expenses || {}

  const initialCategories = {
    Rent: Number(initialExpenses.accommodation || 0),
    Food: Number(initialExpenses.food || 0),
    Travel: Number(initialExpenses.travel || 0),
    Shopping: Number(initialExpenses.shopping || 0),
    Education: Number(initialExpenses.education || 0),
    Other:
      Number(initialExpenses.ordering || 0) +
      Number(initialExpenses.subscriptions || 0) +
      Number(initialExpenses.other || 0)
  }

  const initialTotal = Object.values(initialExpenses).reduce(
    (sum, value) => sum + Number(value || 0),
    0
  )

  const income = Number(financialData.income || 0)

  const [active, setActive] = useState('Dashboard')
  const [mobileMenu, setMobileMenu] = useState(false)

  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [expenseTitle, setExpenseTitle] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseCategory, setExpenseCategory] = useState('Food')
  const [expenseDate, setExpenseDate] = useState(
    new Date().toLocaleDateString('en-CA')
  )

  const [monthlyGoal, setMonthlyGoal] = useState(
    Number(sessionStorage.getItem('nexoraMonthlyGoal') || 0)
  )
  const [goalName, setGoalName] = useState(
    sessionStorage.getItem('nexoraGoalName') || 'My Savings Goal'
  )
  const [goalTarget, setGoalTarget] = useState(
    sessionStorage.getItem('nexoraGoalTarget') || ''
  )
  const [goalSaved, setGoalSaved] = useState(
    Number(sessionStorage.getItem('nexoraGoalSaved') || 0)
  )
  const [goalType, setGoalType] = useState(
    sessionStorage.getItem('nexoraGoalType') || 'Custom'
  )

  const [chatOpen, setChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      sender: 'nexa',
      text: "Hello! I'm Nexa, your personal financial companion. How can I help you today?"
    }
  ])

  const [notification] = useState(false)

  const loadExpenses = async () => {
    if (!email) {
      setExpenses([])
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.get(API, {
        params: { email }
      })
      setExpenses(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      console.error('Expense loading error:', err)
      setError('Could not load additional expenses. Check your backend connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExpenses()
  }, [])

  const additionalTotal = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  )

  const totalSpent = initialTotal + additionalTotal
  const remaining = income - totalSpent
  const savings = Math.max(remaining, 0)

  const chartData = useMemo(() => {
    const result = { ...initialCategories }

    expenses.forEach(item => {
      const category = item.category
      if (result[category] !== undefined) {
        result[category] += Number(item.amount || 0)
      } else {
        result.Other += Number(item.amount || 0)
      }
    })

    return Object.entries(result)
      .filter(([, value]) => value > 0)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }))
  }, [expenses])

  const lineData = [
    { month: 'Initial expenses', spent: initialTotal },
    { month: 'Current total', spent: totalSpent }
  ]

  const budgetCategories = [
    { name: 'Accommodation', amount: Number(initialExpenses.accommodation || 0) },
    { name: 'Food & Groceries', amount: Number(initialExpenses.food || 0) },
    { name: 'Food Ordering', amount: Number(initialExpenses.ordering || 0) },
    { name: 'Travel', amount: Number(initialExpenses.travel || 0) },
    { name: 'Shopping', amount: Number(initialExpenses.shopping || 0) },
    { name: 'Subscriptions', amount: Number(initialExpenses.subscriptions || 0) },
    { name: 'Other', amount: Number(initialExpenses.other || 0) }
  ]

  const handleAddExpense = async (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please log in again. Your email was not found.')
      return
    }

    if (!expenseTitle.trim()) {
      setError('Please enter an expense name.')
      return
    }

    if (!expenseAmount || Number(expenseAmount) <= 0) {
      setError('Please enter a valid amount.')
      return
    }

    try {
      await axios.post(API, {
        userEmail: email,
        title: expenseTitle.trim(),
        amount: Number(expenseAmount),
        category: expenseCategory,
        date: expenseDate
      })

      setExpenseTitle('')
      setExpenseAmount('')
      setExpenseCategory('Food')
      await loadExpenses()
    } catch (err) {
      console.error('Expense save error:', err)
      setError(
        err.response?.data?.message ||
        'Unable to save the expense. Please try again.'
      )
    }
  }

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return
    }

    try {
      await axios.delete(`${API}/${id}`)
      await loadExpenses()
    } catch (err) {
      console.error('Expense delete error:', err)
      setError('Unable to delete this expense.')
    }
  }

  const saveMonthlyGoal = (e) => {
    e.preventDefault()

    if (Number(monthlyGoal) <= 0) {
      alert('Please enter a valid monthly savings amount.')
      return
    }

    sessionStorage.setItem('nexoraMonthlyGoal', String(monthlyGoal))
    alert('Your monthly savings goal has been saved!')
  }

  const saveGoal = (e) => {
    e.preventDefault()

    if (!goalName.trim() || Number(goalTarget) <= 0) {
      alert('Please enter a goal name and a valid target amount.')
      return
    }

    sessionStorage.setItem('nexoraGoalName', goalName)
    sessionStorage.setItem('nexoraGoalTarget', String(goalTarget))
    sessionStorage.setItem('nexoraGoalType', goalType)
    sessionStorage.setItem('nexoraGoalSaved', String(goalSaved))

    alert('Your savings goal has been saved!')
  }

  const sendMessage = (text = message) => {
    if (!text.trim()) return

    const question = text.toLowerCase()
    let answer = ''

    if (question.includes('save')) {
      answer = `Your estimated remaining balance is ${money(remaining)}. Try choosing a realistic monthly savings target.`
    } else if (question.includes('food')) {
      answer = 'Plan your meals, set a weekly food limit and compare eating out with preparing meals at home.'
    } else if (question.includes('budget') || question.includes('50')) {
      answer = 'A useful starting point is the 50-30-20 rule: 50% for needs, 30% for wants and 20% for savings.'
    } else if (question.includes('expense')) {
      answer = `Your recorded spending is ${money(totalSpent)}. Visit Expenses to review or add your expenses.`
    } else {
      answer = 'Review your spending, identify unnecessary purchases and set a small achievable savings goal. Every little step counts!'
    }

    setMessages(prev => [
      ...prev,
      { sender: 'user', text },
      { sender: 'nexa', text: answer }
    ])

    setMessage('')
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Expenses', icon: Wallet },
    { name: 'Budgets', icon: ChartPie },
    { name: 'Savings Goals', icon: Target },
    { name: 'AI Coach (Nexa)', icon: Sparkles }
  ]

  const secondaryItems = [
    { name: 'Notifications', icon: Bell },
    { name: 'Settings', icon: Settings },
    { name: 'Help & Support', icon: CircleHelp }
  ]

  const changePage = (name) => {
    setActive(name)
    setMobileMenu(false)
    if (name === 'AI Coach (Nexa)') setChatOpen(true)
  }

  const renderDashboard = () => (
    <>
      <section className="nexora-stats">
        <div className="nexora-stat-card">
          <div className="nexora-stat-icon"><Wallet /></div>
          <div>
            <span>Total Spent</span>
            <h2>{money(totalSpent)}</h2>
            <p><ArrowDownRight size={15} /> Recorded expenses</p>
          </div>
        </div>

        <div className="nexora-stat-card">
          <div className="nexora-stat-icon"><ChartPie /></div>
          <div>
            <span>Remaining Budget</span>
            <h2>{money(remaining)}</h2>
            <p>{income > 0 ? `${Math.round(totalSpent / income * 100)}% of income used` : 'Enter your income'}</p>
            <div className="nexora-mini-progress">
              <span style={{ width: `${Math.min(income > 0 ? totalSpent / income * 100 : 0, 100)}%` }} />
            </div>
          </div>
        </div>

        <div className="nexora-stat-card">
          <div className="nexora-stat-icon"><PiggyBank /></div>
          <div>
            <span>Available Savings</span>
            <h2>{money(savings)}</h2>
            <p><TrendingUp size={15} /> Based on your balance</p>
          </div>
        </div>

        <div className="nexora-stat-card">
          <div className="nexora-stat-icon"><BriefcaseBusiness /></div>
          <div>
            <span>Monthly Income</span>
            <h2>{money(income)}</h2>
            <p>{userType}</p>
          </div>
        </div>
      </section>

      <section className="nexora-chart-grid">
        <div className="nexora-card trend-card">
          <div className="nexora-card-heading">
            <h3>Monthly Expense Overview</h3>
            <span>This month</span>
          </div>

          <div className="nexora-line-chart">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEE5DC" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip formatter={value => money(value)} />
                <Line
                  type="monotone"
                  dataKey="spent"
                  stroke="#8A654A"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#8A654A' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="nexora-chart-note">
            Your initial expenses and additional recorded expenses.
          </p>
        </div>

        <div className="nexora-card breakdown-card">
          <h3>Expense Breakdown</h3>

          {chartData.length > 0 ? (
            <>
              <div className="nexora-donut">
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                    >
                      {chartData.map(item => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={value => money(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="nexora-legend">
                {chartData.map(item => (
                  <div key={item.name}>
                    <span className="nexora-legend-name">
                      <i style={{ background: item.color }} />
                      {item.name}
                    </span>
                    <strong>
                      {totalSpent > 0
                        ? `${Math.round(item.value / totalSpent * 100)}%`
                        : money(item.value)}
                    </strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>No expenses entered yet.</p>
          )}
        </div>
      </section>

      <section className="nexora-bottom-grid">
        <div className="nexora-card insights-card">
          <div className="nexora-section-title">
            <Sparkles size={22} />
            <h3>Nexa Insights</h3>
          </div>

          <div className="nexora-insight-message">
            <div className="nexora-robot">✦</div>
            <div>
              <strong>Your financial snapshot</strong>
              <p>
                {remaining > 0
                  ? `You currently have ${money(remaining)} remaining. Consider setting a savings goal.`
                  : 'Your expenses have reached or exceeded your income. Review your flexible spending.'}
              </p>
            </div>
          </div>

          <button
            className="nexora-text-button"
            onClick={() => setActive('Budgets')}
          >
            Review my budget <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="nexora-card goals-preview">
          <div className="nexora-card-heading">
            <h3>Your Savings Goals</h3>
            <button onClick={() => setActive('Savings Goals')}>View All →</button>
          </div>

          {goalTarget ? (
            <div className="nexora-goal-preview">
              <Target size={28} />
              <div>
                <strong>{goalName}</strong>
                <span>{money(goalSaved)} / {money(goalTarget)}</span>
                <div className="nexora-mini-progress">
                  <span style={{ width: `${Math.min(goalSaved / Number(goalTarget) * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="nexora-empty-goal">
              <Target size={32} />
              <p>You haven't created a savings goal yet.</p>
              <button onClick={() => setActive('Savings Goals')}>+ Add Goal</button>
            </div>
          )}
        </div>
      </section>
    </>
  )

  const renderExpenses = () => (
    <div className="nexora-page-content">
      <div className="nexora-card">
        <span className="nexora-eyebrow">TRACK YOUR SPENDING</span>
        <h3>Add a New Expense</h3>

        <form className="nexora-form" onSubmit={handleAddExpense}>
          <label>
            Expense Name
            <input
              type="text"
              value={expenseTitle}
              onChange={e => setExpenseTitle(e.target.value)}
              placeholder="e.g. Lunch"
              required
            />
          </label>

          <label>
            Amount (₹)
            <input
              type="number"
              min="0.01"
              step="any"
              value={expenseAmount}
              onChange={e => setExpenseAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </label>

          <label>
            Category
            <select
              value={expenseCategory}
              onChange={e => setExpenseCategory(e.target.value)}
            >
              {categories.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Date
            <input
              type="date"
              value={expenseDate}
              onChange={e => setExpenseDate(e.target.value)}
              required
            />
          </label>

          <button className="nexora-primary-button" type="submit">
            <Plus size={17} /> Add Expense
          </button>
        </form>

        {error && <p className="nexora-error">{error}</p>}
      </div>

      <div className="nexora-card">
        <div className="nexora-card-heading">
          <h3>Onboarding Expenses</h3>
          <strong>{money(initialTotal)}</strong>
        </div>

        {budgetCategories.filter(item => item.amount > 0).map(item => (
          <div className="nexora-list-row" key={item.name}>
            <span>{item.name}</span>
            <strong>{money(item.amount)}</strong>
          </div>
        ))}

        {budgetCategories.every(item => item.amount === 0) && (
          <p>No onboarding expenses.</p>
        )}
      </div>

      <div className="nexora-card">
        <div className="nexora-card-heading">
          <h3>Additional Expenses</h3>
          <strong>{money(additionalTotal)}</strong>
        </div>

        {loading ? (
          <p>Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p>No additional expenses yet.</p>
        ) : (
          expenses.map(item => (
            <div className="nexora-list-row" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <small>{item.category} · {item.date}</small>
              </div>
              <strong>{money(item.amount)}</strong>
              <button
                type="button"
                className="nexora-icon-action"
                onClick={() => handleDeleteExpense(item.id)}
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )

  const renderBudgets = () => {
    const recommendedSave = remaining > 0
      ? Math.round(remaining * 0.4)
      : 0

    const allocations = [
      { name: 'Emergency Fund', percent: 50 },
      { name: 'Future Purchases', percent: 30 },
      { name: 'Long-term Savings', percent: 20 }
    ]

    const budgetRules = [
      { name: 'Needs', percent: 50 },
      { name: 'Wants', percent: 30 },
      { name: 'Savings', percent: 20 }
    ]

    return (
      <div className="nexora-page-content">
        <div className="nexora-card">
          <span className="nexora-eyebrow">YOUR MONTHLY FINANCIAL PLAN</span>
          <h3>Understand Your Budget</h3>
          <p className="nexora-muted">
            Here's how your income and spending currently look.
          </p>

          <div className="nexora-list-row">
            <span>Monthly Income</span>
            <strong>{money(income)}</strong>
          </div>
          <div className="nexora-list-row">
            <span>Total Expenses</span>
            <strong>{money(totalSpent)}</strong>
          </div>
          <div className="nexora-list-row">
            <span>Remaining Balance</span>
            <strong>{money(remaining)}</strong>
          </div>
        </div>

        <div className="nexora-card">
          <span className="nexora-eyebrow">NEXA'S SMART SUGGESTION</span>
          <h3>Suggested Amount to Save</h3>
          <h2>{money(recommendedSave)}</h2>
          <p className="nexora-muted">
            {remaining > 0
              ? 'Consider setting aside 40% of your remaining balance, after accounting for upcoming expenses.'
              : 'Your expenses have reached or exceeded your income. Review flexible spending before planning savings.'}
          </p>
          <p className="nexora-muted">
            This is a recommendation, not an actual recorded saving.
          </p>
        </div>

        <div className="nexora-card">
          <span className="nexora-eyebrow">YOUR SAVINGS PLAN</span>
          <h3>How You Could Allocate Your Savings</h3>
          {allocations.map(item => (
            <div className="nexora-budget-row" key={item.name}>
              <div className="nexora-card-heading">
                <strong>{item.name}</strong>
                <strong>
                  {money(recommendedSave * item.percent / 100)} · {item.percent}%
                </strong>
              </div>
              <div className="nexora-progress">
                <span style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="nexora-card">
          <span className="nexora-eyebrow">SMART MONEY HABITS</span>
          <h3>The 50-30-20 Rule</h3>
          <p className="nexora-muted">
            A simple budgeting method to help organise your monthly income.
          </p>
          {budgetRules.map(item => (
            <div className="nexora-budget-row" key={item.name}>
              <div className="nexora-card-heading">
                <strong>{item.name}</strong>
                <strong>
                  {money(income * item.percent / 100)} · {item.percent}%
                </strong>
              </div>
              <div className="nexora-progress">
                <span style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderSavings = () => (
    <div className="nexora-page-content">
      <div className="nexora-card">
        <span className="nexora-eyebrow">BUILD YOUR FUTURE</span>
        <h3>Set Your Monthly Savings Goal</h3>
        <p className="nexora-muted">
          How much would you like to save every month?
        </p>

        <form className="nexora-form" onSubmit={saveMonthlyGoal}>
          <label>
            Monthly Savings Target (₹)
            <input
              type="number"
              min="1"
              step="any"
              value={monthlyGoal || ''}
              onChange={e => setMonthlyGoal(Number(e.target.value))}
              placeholder="e.g. 2000"
              required
            />
          </label>
          <button className="nexora-primary-button" type="submit">
            Save Monthly Goal
          </button>
        </form>
      </div>

      <div className="nexora-card">
        <span className="nexora-eyebrow">YOUR DREAM, YOUR PLAN</span>
        <h3>Create a Savings Goal</h3>

        <form className="nexora-form" onSubmit={saveGoal}>
          <label>
            What are you saving for?
            <select
              value={goalType}
              onChange={e => {
                setGoalType(e.target.value)
                if (e.target.value !== 'Custom') {
                  setGoalName(e.target.value)
                }
              }}
            >
              <option value="Custom">Custom</option>
              <option value="Laptop">Laptop</option>
              <option value="Phone">Phone</option>
              <option value="Travel">Travel</option>
              <option value="Emergency Fund">Emergency Fund</option>
            </select>
          </label>

          <label>
            Goal Name
            <input
              value={goalName}
              onChange={e => setGoalName(e.target.value)}
              placeholder="e.g. My dream laptop"
              required
            />
          </label>

          <label>
            Target Amount (₹)
            <input
              type="number"
              min="1"
              step="any"
              value={goalTarget}
              onChange={e => setGoalTarget(e.target.value)}
              placeholder="e.g. 60000"
              required
            />
          </label>

          <label>
            Already Saved (₹)
            <input
              type="number"
              min="0"
              step="any"
              value={goalSaved}
              onChange={e => setGoalSaved(Number(e.target.value))}
            />
          </label>

          <button className="nexora-primary-button" type="submit">
            <Plus size={17} /> Save Goal
          </button>
        </form>
      </div>

      {goalTarget && (
        <div className="nexora-card">
          <h3>{goalName}</h3>
          <p>{money(goalSaved)} saved out of {money(goalTarget)}</p>
          <div className="nexora-progress">
            <span style={{ width: `${Math.min(goalSaved / Number(goalTarget) * 100, 100)}%` }} />
          </div>
          <p className="nexora-muted">
            {monthlyGoal > 0
              ? `At ${money(monthlyGoal)} per month, your goal may take approximately ${Math.ceil(Math.max(0, Number(goalTarget) - goalSaved) / monthlyGoal)} months.`
              : 'Set a monthly savings target to estimate your goal timeline.'}
          </p>
        </div>
      )}
    </div>
  )

  const renderPlaceholder = () => (
    <div className="nexora-card nexora-placeholder">
      <Sparkles size={32} />
      <h3>{active}</h3>
      <p>This section will be available in a later version of Nexora.</p>
    </div>
  )

  return (
    <div className="nexora-layout">
      {mobileMenu && (
        <div
          className="nexora-overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`nexora-sidebar ${mobileMenu ? 'open' : ''}`}>
        <a href="/" className="nexora-logo">✦ Nexora</a>

        <div className="nexora-user">
          <div className="nexora-user-avatar">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <strong>Hi, {firstName} 👋</strong>
            <span>{userType} Plan</span>
          </div>
        </div>

        <span className="nexora-sidebar-label">YOUR FINANCIAL SPACE</span>

        <nav className="nexora-nav">
          {menuItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.name}
                className={active === item.name ? 'active' : ''}
                onClick={() => changePage(item.name)}
              >
                <Icon size={19} /> {item.name}
              </button>
            )
          })}
        </nav>

        <div className="nexora-sidebar-secondary">
          {secondaryItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.name}
                onClick={() => changePage(item.name)}
              >
                <Icon size={18} /> {item.name}
              </button>
            )
          })}
        </div>

        <div className="nexora-pro-card">
          <Sparkles size={22} />
          <strong>Upgrade to Nexora Pro</strong>
          <p>Unlock advanced insights, AI planning and more.</p>
          <button onClick={() => alert('Nexora Pro is coming soon!')}>
            Upgrade →
          </button>
        </div>
      </aside>

      <main className="nexora-main">
        <header className="nexora-header">
          <button
            className="nexora-mobile-menu"
            onClick={() => setMobileMenu(true)}
          >
            <Menu />
          </button>

          <div>
            <span className="nexora-eyebrow">YOUR FINANCIAL OVERVIEW</span>
            <h1>Welcome back, {firstName} 👋</h1>
            <p>Here's your financial snapshot for this month.</p>
          </div>

          <div className="nexora-header-actions">
            <div className="nexora-search">
              <Search size={17} />
              <input placeholder="Search anything..." />
            </div>
            <button onClick={() => changePage('Notifications')}>
              <Bell />
            </button>
            <div className="nexora-header-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {error && <p className="nexora-error">{error}</p>}

        {active === 'Dashboard' && renderDashboard()}
        {active === 'Expenses' && <Expenses />}
        {active === 'Budgets' && renderBudgets()}
        {active === 'Savings Goals' && renderSavings()}

        {['Notifications', 'Settings', 'Help & Support'].includes(active) &&
          renderPlaceholder()}

        {active === 'AI Coach (Nexa)' && (
          <div className="nexora-card">
            <h3>Your AI Coach, Nexa</h3>
            <p>Ask Nexa about your budget, spending or savings habits.</p>
            <button
              className="nexora-primary-button"
              onClick={() => setChatOpen(true)}
            >
              Open Nexa Chat
            </button>
          </div>
        )}

        <footer className="nexora-footer">Made with care by Nexora ✦</footer>
      </main>

      <button
        className="nexora-chat-float"
        onClick={() => setChatOpen(true)}
      >
        <Sparkles size={19} /> Ask Nexa
      </button>

      {chatOpen && (
        <div className="nexora-chat-window">
          <div className="nexora-chat-header">
            <div>
              <Sparkles size={20} />
              <div>
                <strong>Nexa AI</strong>
                <small>Your financial companion</small>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="nexora-chat-messages">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`nexora-chat-message ${item.sender}`}
              >
                {item.text}
              </div>
            ))}
          </div>

          <div className="nexora-chat-suggestions">
            {[
              'How can I save more?',
              'Explain 50-30-20',
              'How can I reduce expenses?'
            ].map(item => (
              <button key={item} onClick={() => sendMessage(item)}>
                {item}
              </button>
            ))}
          </div>

          <form
            className="nexora-chat-input"
            onSubmit={e => {
              e.preventDefault()
              sendMessage()
            }}
          >
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Ask Nexa..."
            />
            <button type="submit">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Dashboard
