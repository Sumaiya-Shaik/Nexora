
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Wallet, Home, Utensils, ShoppingBag, Bus, ArrowRight
} from 'lucide-react'
import './FinancialDetails.css'

function FinancialDetails() {
  const navigate = useNavigate()

  const userType = sessionStorage.getItem('nexoraUserType') || 'Student'
  const living = sessionStorage.getItem('nexoraLiving') || ''
  const email = sessionStorage.getItem('nexoraUserEmail') || ''

  const [income, setIncome] = useState('')
  const [saving, setSaving] = useState(false)

  const [expenses, setExpenses] = useState({
    accommodation: '0',
    food: '0',
    ordering: '0',
    travel: '0',
    shopping: '0',
    subscriptions: '0',
    other: '0'
  })

  const fields = [
    {
      key: 'accommodation',
      label: 'Rent / PG / Hostel',
      description: 'Monthly accommodation payment',
      icon: Home
    },
    {
      key: 'food',
      label: 'Food & Groceries',
      description: 'Monthly food and grocery expenses',
      icon: Utensils
    },
    {
      key: 'ordering',
      label: 'Zomato / Swiggy',
      description: 'Online food orders',
      icon: ShoppingBag
    },
    {
      key: 'travel',
      label: 'Travel & Transport',
      description: 'Bus, cab, fuel and other travel',
      icon: Bus
    },
    {
      key: 'shopping',
      label: 'Shopping',
      description: 'Clothes and personal purchases',
      icon: ShoppingBag
    },
    {
      key: 'subscriptions',
      label: 'Subscriptions',
      description: 'Netflix, Spotify and other plans',
      icon: Wallet
    },
    {
      key: 'other',
      label: 'Other Expenses',
      description: 'Any additional monthly expenses',
      icon: Wallet
    }
  ]

  const totalExpenses = Object.values(expenses).reduce(
    (sum, value) => sum + (Number(value) || 0), 0
  )

  const balance = (Number(income) || 0) - totalExpenses

  const handleChange = (key, value) => {
    if (value === '' || Number(value) >= 0) {
      setExpenses(prev => ({ ...prev, [key]: value }))
    }
  }

  const handleContinue = async (e) => {
    e.preventDefault()

    if (!email) {
      alert('Please log in again to continue.')
      navigate('/login')
      return
    }

    if (!income || Number(income) <= 0) {
      alert('Please enter your monthly income.')
      return
    }

    const financialData = {
      userType,
      living,
      income: Number(income),
      expenses: Object.fromEntries(
        Object.entries(expenses).map(([key, value]) => [
          key,
          Number(value) || 0
        ])
      ),
      totalExpenses,
      balance
    }

    const profileData = {
      email,
      preferredName:
        sessionStorage.getItem('nexoraPreferredName') ||
        sessionStorage.getItem('nexoraUserName') ||
        '',
      userType,
      livingSituation: living,
      monthlyIncome: Number(income),
      monthlyExpenses: financialData.expenses
    }

    try {
      setSaving(true)

      const response = await axios.put(
        'https://nexora-g387.onrender.com/api/auth/profile',
        profileData
      )

      // Save local display data after successful database save
      sessionStorage.setItem(
        'nexoraFinancialData',
        JSON.stringify(financialData)
      )

      sessionStorage.setItem('nexoraOnboardingCompleted', 'true')
      sessionStorage.setItem('nexoraPreferredName', response.data.preferredName)

      navigate('/financial-summary')

    } catch (error) {
      console.error('Profile saving error:', error)

      alert(
        error.response?.data?.message ||
        'Unable to save your financial profile. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="financial-details-page">
      <div className="financial-brand">✦ Nexora</div>

      <div className="financial-container">
        <span className="financial-step">YOUR FINANCES · 03</span>

        <h1>Let's understand your money.</h1>

        <p className="financial-intro">
          Enter your monthly income and expenses.
          Don't worry if you don't have an expense — simply enter zero.
        </p>

        <form onSubmit={handleContinue}>
          <div className="financial-income-card">
            <div className="financial-card-icon">
              <Wallet size={24} />
            </div>

            <div>
              <label>
                {userType === 'Student'
                  ? 'Monthly Pocket Money'
                  : 'Monthly Salary'}
              </label>

              <p>
                {userType === 'Student'
                  ? 'How much pocket money do you receive every month?'
                  : 'What is your monthly take-home salary?'}
              </p>
            </div>

            <div className="financial-income-input">
              <span>₹</span>
              <input
                type="number"
                min="1"
                placeholder="0"
                value={income}
                onChange={e => setIncome(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="financial-section-heading">
            <div>
              <span>MONTHLY BREAKDOWN</span>
              <h2>Your Expenses</h2>
            </div>
            <small>Amount in ₹</small>
          </div>

          <div className="financial-expense-list">
            {fields.map(item => {
              const Icon = item.icon
              const accommodationNotApplicable =
                item.key === 'accommodation' &&
                living === 'Living with Parents'

              return (
                <div className="financial-expense-row" key={item.key}>
                  <div className="financial-expense-icon">
                    <Icon size={21} />
                  </div>

                  <div className="financial-expense-info">
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </div>

                  <div className="financial-expense-input">
                    <span>₹</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={
                        accommodationNotApplicable
                          ? '0'
                          : expenses[item.key]
                      }
                      disabled={accommodationNotApplicable}
                      onChange={e =>
                        handleChange(item.key, e.target.value)
                      }
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="financial-total-card">
            <div>
              <span>Total Monthly Expenses</span>
              <strong>₹{totalExpenses.toLocaleString('en-IN')}</strong>
            </div>

            <div>
              <span>Estimated Remaining Balance</span>
              <strong className={balance < 0 ? 'negative-balance' : ''}>
                ₹{balance.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          <button
            className="financial-continue"
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving your profile...' : 'Calculate My Finances'}
            {!saving && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="financial-note">
          Your financial information helps Nexora create a personalised plan.
        </p>
      </div>
    </div>
  )
}

export default FinancialDetails
