
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignup) {
        const response = await axios.post(
          'https://nexora-g387.onrender.com/api/auth/register',
          { name, email, password }
        )

        alert(response.data.message)

        setIsSignup(false)
        setPassword('')
        setName('')

      } else {
        const response = await axios.post(
          'https://nexora-g387.onrender.com/api/auth/login',
          { email, password }
        )

        const user = response.data

        // Save the logged-in user's profile
        sessionStorage.setItem('nexoraUserId', user.id)
        sessionStorage.setItem('nexoraUserEmail', user.email)
        sessionStorage.setItem('nexoraUserName', user.name)
        sessionStorage.setItem(
          'nexoraPreferredName',
          user.preferredName || user.name
        )
        sessionStorage.setItem(
          'nexoraUserType',
          user.userType || ''
        )
        sessionStorage.setItem(
          'nexoraLiving',
          user.livingSituation || ''
        )
        sessionStorage.setItem(
          'nexoraFinancialData',
          JSON.stringify({
            income: user.monthlyIncome || 0,
            expenses: user.monthlyExpenses || {}
          })
        )
        sessionStorage.setItem(
          'nexoraOnboardingCompleted',
          String(user.onboardingCompleted)
        )

        // New users complete onboarding.
        // Returning users go directly to the dashboard.
        if (user.onboardingCompleted) {
          navigate('/dashboard')
        } else {
          navigate('/welcome')
        }
      }

    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <a href="/" className="auth-brand">
          ✦ Nexora
        </a>

        <div className="auth-message">
          <span>YOUR PERSONAL FINANCIAL COMPANION</span>

          <h1>Smarter money starts with better habits.</h1>

          <p>
            Take the first step towards understanding
            your spending and building a better financial future.
          </p>
        </div>

        <div className="auth-footer">
          Smarter Money. Better Decisions.
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-symbol">✦</div>

          <h2>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>

          <p className="auth-subtitle">
            {isSignup
              ? 'Start your journey towards smarter savings.'
              : 'Sign in to continue your financial journey.'}
          </p>

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="auth-field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="auth-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? 'Please wait...'
                : isSignup
                  ? 'Create Account →'
                  : 'Login →'}
            </button>
          </form>

          <p className="auth-switch">
            {isSignup
              ? 'Already have an account?'
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup)
                setPassword('')
              }}
            >
              {isSignup ? ' Login' : ' Sign Up'}
            </button>
          </p>

          <a href="/" className="back-home">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
