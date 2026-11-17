
import { useNavigate } from 'react-router-dom'
import './Welcome.css'

function Welcome() {
  const navigate = useNavigate()

  const email = sessionStorage.getItem('nexoraUserEmail') || ''
  const username = email.split('@')[0] || 'there'

  const displayName = username.charAt(0).toUpperCase() + username.slice(1)

  return (
    <div className="welcome-page">
      <div className="welcome-brand">✦ Nexora</div>

      <div className="welcome-content">
        <div className="welcome-symbol">✦</div>

        <span className="welcome-label">
          YOUR PERSONAL FINANCIAL COMPANION
        </span>

        <h1>
          Nexora welcomes you,
          <br />
          {displayName} ✨
        </h1>

        <p>
          Every great financial journey starts with a small step.
          Let's understand your money habits and help you make
          smarter financial decisions.
        </p>

        <button
          className="welcome-button"
          onClick={() => navigate('/onboarding')}
        >
          Get Started <span>→</span>
        </button>

        <div className="welcome-footer">
          Smarter Money. Better Decisions.
        </div>
      </div>
    </div>
  )
}

export default Welcome
