
import { useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip
} from 'recharts'
import {
  Wallet, TrendingUp, PiggyBank, ArrowRight, Sparkles
} from 'lucide-react'
import './FinancialSummary.css'

const colors = [
  '#A58A70', '#A9BBA5', '#765B48',
  '#D8C4AE', '#C8B8AA', '#B5A99C', '#D2BBA5'
]

function FinancialSummary() {
  const navigate = useNavigate()

  const data = JSON.parse(
    sessionStorage.getItem('nexoraFinancialData') || '{}'
  )

  const income = Number(data.income || 0)
  const expenses = data.expenses || {}

  const totalExpenses = Object.values(expenses).reduce(
    (sum, value) => sum + Number(value || 0), 0
  )

  const balance = income - totalExpenses

  const chartData = [
    { name: 'Accommodation', value: Number(expenses.accommodation || 0) },
    { name: 'Food & Groceries', value: Number(expenses.food || 0) },
    { name: 'Food Ordering', value: Number(expenses.ordering || 0) },
    { name: 'Travel', value: Number(expenses.travel || 0) },
    { name: 'Shopping', value: Number(expenses.shopping || 0) },
    { name: 'Subscriptions', value: Number(expenses.subscriptions || 0) },
    { name: 'Other', value: Number(expenses.other || 0) }
  ].filter(item => item.value > 0)

  const savingsSuggestion = balance > 0
    ? `You have ₹${balance.toLocaleString('en-IN')} remaining. Consider saving 20% of your monthly income, or ₹${Math.round(income * 0.2).toLocaleString('en-IN')} if your expenses allow it.`
    : 'Your expenses are equal to or higher than your income. Review flexible spending and look for areas where you can reduce costs.'

  return (
    <div className="summary-page">
      <div className="summary-brand">✦ Nexora</div>

      <div className="summary-container">
        <span className="summary-eyebrow">YOUR FINANCIAL SNAPSHOT</span>

        <h1>Your money, at a glance.</h1>

        <p className="summary-intro">
          Here's what your monthly financial picture looks like.
          A little clarity can lead to smarter decisions.
        </p>

        <div className="summary-stats">
          <div className="summary-stat">
            <Wallet size={22} />
            <span>Monthly Income</span>
            <strong>₹{income.toLocaleString('en-IN')}</strong>
          </div>

          <div className="summary-stat">
            <TrendingUp size={22} />
            <span>Total Expenses</span>
            <strong>₹{totalExpenses.toLocaleString('en-IN')}</strong>
          </div>

          <div className="summary-stat summary-balance">
            <PiggyBank size={22} />
            <span>Remaining Balance</span>
            <strong className={balance < 0 ? 'summary-negative' : ''}>
              ₹{balance.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

        <div className="summary-chart-card">
          <div>
            <span className="summary-eyebrow">SPENDING ANALYSIS</span>
            <h2>Where does your money go?</h2>
          </div>

          {chartData.length > 0 ? (
            <>
              <div className="summary-chart">
                <ResponsiveContainer width="100%" height={270}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={112}
                      paddingAngle={3}
                    >
                      {chartData.map((item, index) => (
                        <Cell
                          key={item.name}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={value => `₹${Number(value).toLocaleString('en-IN')}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="summary-legend">
                {chartData.map((item, index) => (
                  <div key={item.name}>
                    <span
                      className="summary-legend-dot"
                      style={{ background: colors[index % colors.length] }}
                    />
                    <span>{item.name}</span>
                    <strong>
                      ₹{item.value.toLocaleString('en-IN')}
                    </strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>No expenses have been entered yet.</p>
          )}
        </div>

        <div className="summary-insight">
          <div className="summary-insight-icon">
            <Sparkles size={23} />
          </div>

          <div>
            <span>YOUR FIRST NEXORA INSIGHT</span>
            <h3>A little suggestion for you</h3>
            <p>{savingsSuggestion}</p>
          </div>
        </div>

        <button
          className="summary-button"
          onClick={() => navigate('/dashboard')}
        >
          Explore My Dashboard <ArrowRight size={18} />
        </button>

        <p className="summary-footer">
          Your journey towards smarter money decisions starts here. ✦
        </p>
      </div>
    </div>
  )
}

export default FinancialSummary
