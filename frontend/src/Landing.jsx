
import { Link } from 'react-router-dom'
import './App.css'

function Landing() {
  return (
    <div className="nexora">

      <nav className="navbar">
        <a href="#" className="brand">
          <span className="brand-icon">✦</span> Nexora
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <Link to="/login" className="nav-button">Get Started</Link>
      </nav>

      <section className="hero-section" id="home">
        <div className="hero-content">
          <span className="eyebrow">
            YOUR PERSONAL FINANCIAL COMPANION
          </span>

          <h1>
            Smarter Money.<br />
            <span>Better Decisions.</span>
          </h1>

          <p>
            Take control of your spending, build better
            financial habits and achieve your savings goals
            with personalised guidance from Nexora.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="primary-button">
              Get Started <span>→</span>
            </Link>
            <a href="#about" className="secondary-button">
              Learn More
            </a>
          </div>

          <div className="hero-note">
            ✧ Simple planning. Smarter spending. Better savings.
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-decoration decoration-one"></div>
          <div className="visual-decoration decoration-two"></div>

          <div className="preview-card">
            <div className="preview-header">
              <div>
                <span className="preview-label">YOUR BALANCE</span>
                <h2>₹12,450</h2>
              </div>
              <span className="preview-icon">◈</span>
            </div>

            <div className="preview-divider"></div>

            <div className="preview-item">
              <span>🥗 Food</span><strong>₹2,500</strong>
            </div>
            <div className="preview-item">
              <span>🏠 Rent</span><strong>₹4,000</strong>
            </div>
            <div className="preview-item">
              <span>🚕 Travel</span><strong>₹1,000</strong>
            </div>
            <div className="preview-item">
              <span>🛍 Shopping</span><strong>₹1,500</strong>
            </div>

            <div className="savings-preview">
              <div>
                <span>Monthly savings</span>
                <h3>₹3,000</h3>
              </div>
              <span className="savings-icon">↗</span>
            </div>
          </div>

          <div className="floating-card">
            <span>✦ Nexa's suggestion</span>
            <strong>Save ₹500 more this month!</strong>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <span className="eyebrow">WHAT NEXORA OFFERS</span>
          <h2>Everything you need to manage money better.</h2>
          <p>
            A simpler way to understand your spending
            and make smarter financial decisions.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">◈</span>
            <h3>Expense Tracking</h3>
            <p>Record daily expenses and understand where your money goes.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">♧</span>
            <h3>Personalised Savings</h3>
            <p>Discover practical savings suggestions based on your profile.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">✧</span>
            <h3>Nexa AI Assistant</h3>
            <p>Get helpful financial guidance and personalised suggestions.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">◎</span>
            <h3>Financial Analytics</h3>
            <p>View spending patterns through simple charts and insights.</p>
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div>
          <span className="eyebrow">A BETTER WAY TO SAVE</span>
          <h2>Your money deserves a smarter plan.</h2>
        </div>
        <p>
          Nexora brings your expenses, savings goals and
          personalised financial guidance together in one
          simple dashboard.
        </p>
      </section>

      <footer className="footer">
        <a href="#" className="brand">✦ Nexora</a>
        <p>Smarter Money. Better Decisions.</p>
        <span>© 2026 Nexora. All rights reserved.</span>
      </footer>

    </div>
  )
}

export default Landing
