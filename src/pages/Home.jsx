import { useEffect, useState } from 'react'
import TransitionLink from '../components/TransitionLink'
import ThemeToggle from '../components/ThemeToggle'

function Home() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
      setTime(now + ' IST')
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="home-page">
      <ThemeToggle />

      <main className="hero">
        <div className="hero-content">
          {/* Avatar — placeholder Batman logo, replace later */}
          <img
            src="/d612ee610793a42b00b3bbfd2ccaf068.gif"
            alt="Ujjwal Verma"
            className="avatar magnetic"
            onError={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #F5C518, #c4a000)'
              e.target.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%230a0a14"/><path d="M50 25 C45 35, 30 38, 15 30 C20 45, 25 55, 35 58 C30 62, 28 68, 25 75 C35 70, 42 65, 50 72 C58 65, 65 70, 75 75 C72 68, 70 62, 65 58 C75 55, 80 45, 85 30 C70 38, 55 35, 50 25Z" fill="%23F5C518"/></svg>')
            }}
          />

          <h1 className="hero-name" data-text="Ujjwal Verma">Ujjwal Verma</h1>
          <p className="hero-aka">full stack developer &amp; competitive programmer</p>

          <p className="hero-bio">
            Hey, I'm a CSE undergrad and full-stack developer who enjoys building
            things that solve real problems. I've built projects ranging from
            AI-powered fitness ecosystems to competitive intelligence tools, most
            of my work lives on{' '}
            <a href="https://github.com/ujjwalv01" target="_blank" rel="noopener noreferrer">GitHub</a>.
            When I'm not shipping code, I'm grinding competitive programming.
            I'm a Codeforces Specialist with a max rating of 1421 and 300+ DSA
            problems under my belt.
          </p>

          <p className="hero-bio">
            I'm comfortable across the MERN stack, and I genuinely enjoy the process
            of going from a rough idea to a polished product. I care about clean
            architecture, smooth user experiences, and writing code that doesn't
            make future-me angry. Currently open to internships, collaborations,
            and interesting conversations. You can grab my{' '}
            <a href="https://drive.google.com/file/d/1AIgD792xOUPS1h2ZN0PhSXrijEvsQIHv/view?usp=drive_link" target="_blank" rel="noopener noreferrer">resume</a>{' '}
            or reach out at{' '}
            <a href="mailto:ujjwalverma010305@gmail.com">ujjwalverma010305@gmail.com</a>.
          </p>

          <p className="hero-bio">
            If you made it here, I'd probably enjoy talking to you - shoot me a
            message about something that recently fascinated you.
          </p>

          <div className="hero-links">
            <TransitionLink to="/projects" className="magnetic">projects</TransitionLink>
            <a href="https://github.com/ujjwalv01" target="_blank" rel="noopener noreferrer" className="magnetic">github</a>
            <a href="https://x.com/Ujjwal_v01" target="_blank" rel="noopener noreferrer" className="magnetic">twitter</a>
            <a href="https://www.linkedin.com/in/ujjwal-verma-cse/" target="_blank" rel="noopener noreferrer" className="magnetic">linkedin</a>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <span className="footer-location">📍 Kanpur, India</span>
        <span className="footer-dot"></span>
        <span className="footer-time">{time}</span>
      </footer>
    </div>
  )
}

export default Home
