
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  Home, Building2, Users, House, ArrowRight
} from 'lucide-react'
import './LivingSituation.css'

function LivingSituation() {
  const navigate = useNavigate()
  const [living, setLiving] = useState('')

  const options = [
    {
      name: 'Living with Parents',
      description: 'Staying at home with family.',
      icon: Users
    },
    {
      name: 'PG / Hostel',
      description: 'Living in a paying guest or hostel.',
      icon: Building2
    },
    {
      name: 'Renting a Flat',
      description: 'Living in a rented apartment.',
      icon: Home
    },
    {
      name: 'Other',
      description: 'Another living arrangement.',
      icon: House
    }
  ]

  const handleContinue = () => {
    if (!living) {
      alert('Please select your living situation.')
      return
    }

    sessionStorage.setItem('nexoraLiving', living)
    navigate('/financial-details')
  }

  return (
    <div className="living-page">
      <div className="living-brand">✦ Nexora</div>

      <div className="living-content">
        <span className="living-step">GETTING TO KNOW YOU · 02</span>

        <h1>Where do you live?</h1>

        <p>
          Your living situation helps us understand your
          monthly accommodation and everyday expenses.
        </p>

        <div className="living-options">
          {options.map(item => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                className={`living-option ${living === item.name ? 'selected' : ''}`}
                onClick={() => setLiving(item.name)}
              >
                <div className="living-icon">
                  <Icon size={27} />
                </div>

                <div className="living-option-text">
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                </div>

                <span className="living-check">
                  {living === item.name ? '✓' : ''}
                </span>
              </button>
            )
          })}
        </div>

        <button className="living-continue" onClick={handleContinue}>
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default LivingSituation
