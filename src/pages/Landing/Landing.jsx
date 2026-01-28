import { Container, Button } from 'react-bootstrap'
import './Landing.css'

const Landing = () => {
  return (
    <main className="landing-page">
      <div className="landing-overlay">
        <Container className="landing-content">
          <h1 className="landing-title">Welcome to EventMap</h1>
          <p className="landing-subtitle">
            Discover events. Share experiences. Join the community.
          </p>
          <div className="landing-actions">
            <Button className="landing-btn-primary">
              Explore Events
            </Button>
            <Button variant="outline-light" className="landing-btn-secondary">
              Create Event
            </Button>
          </div></Container>
      </div></main>
  )
}

export default Landing
