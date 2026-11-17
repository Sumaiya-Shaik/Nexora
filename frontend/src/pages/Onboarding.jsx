
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  BriefcaseBusiness,
  ArrowRight
} from 'lucide-react'
import { useState } from 'react'
import './Onboarding.css'

function Onboarding() {
  const navigate = useNavigate()

  const [preferredName, setPreferredName] = useState(
    sessionStorage.getItem('nexoraPreferredName') || ''
  )
  const [userType, setUserType] = useState('')

  const handleContinue = () => {
    if (!preferredName.trim()) {
      alert('Please enter the name you would like us to use.')
      return
    }

    if (!userType) {
      alert('Please select your profile to continue.')
      return
    }

    sessionStorage.setItem(
      'nexoraPreferredName',
      preferredName.trim()
    )

    sessionStorage.setItem('nexoraUserType', userType)

    navigate('/living-situation')
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-brand">✦ Nexora</div>

      <div className="onboarding-content">
        <span className="onboarding-step">
          GETTING TO KNOW YOU · 01
        </span>

        <h1>Let's start with you.</h1>

        <p className="onboarding-description">
          Tell us a little about yourself so we can make
          your financial journey more meaningful.
        </p>

        <div className="onboarding-name-field">
          <label htmlFor="preferredName">
            What should we call you?
          </label>

          <input
            id="preferredName"
            type="text"
            placeholder="Enter your preferred name"
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
          />
        </div>

        <h3>Which best describes you?</h3>

        <div className="profile-options">
          <button
            type="button"
            className={`profile-option ${
              userType === 'Student' ? 'selected' : ''
            }`}
            onClick={() => setUserType('Student')}
          >
            <div className="profile-option-icon">
              <GraduationCap size={30} />
            </div>

            <div>
              <strong>I'm a Student</strong>
              <span>
                Managing pocket money and student expenses.
              </span>
            </div>

            <span className="option-check">
              {userType === 'Student' ? '✓' : ''}
            </span>
          </button>

          <button
            type="button"
            className={`profile-option ${
              userType === 'Working Professional' ? 'selected' : ''
            }`}
            onClick={() => setUserType('Working Professional')}
          >
            <div className="profile-option-icon">
              <BriefcaseBusiness size={30} />
            </div>

            <div>
              <strong>I'm a Working Professional</strong>
              <span>
                Managing salary, expenses and savings.
              </span>
            </div>

            <span className="option-check">
              {userType === 'Working Professional' ? '✓' : ''}
            </span>
          </button>
        </div>

        <button
          className="onboarding-continue"
          onClick={handleContinue}
        >
          Continue <ArrowRight size={18} />
        </button>

        <p className="onboarding-footer">
          A few simple questions. A smarter financial future.
        </p>
      </div>
    </div>
  )
}

export default Onboarding
