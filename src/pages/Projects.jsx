import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

const projects = [
  {
    title: 'RepWise',
    description: 'An AI-powered fitness and nutrition ecosystem featuring a natural language food scanner, custom workout generation, and an interactive hydration tracker.',
    tags: ['AI Integration', 'React', 'Next.js', 'TypeScript'],
    github: 'https://github.com/ujjwalv01',
    live: '#',
  },
  {
    title: 'Rival Scan AI',
    description: 'An AI-powered competitive intelligence tool that researches any company in seconds. Generates CI reports featuring SWOT analysis and charts.',
    tags: ['Next.js', 'Groq API', 'Firecrawl', 'Recharts'],
    github: 'https://github.com/ujjwalv01',
    live: '#',
  },
  {
    title: 'KhareedoNow',
    description: 'A full-featured e-commerce platform with product management, cart functionality, payment integration, and admin analytics dashboard.',
    tags: ['MERN Stack', 'Zustand', 'Stripe', 'Cloudinary'],
    github: 'https://github.com/ujjwalv01',
    live: '#',
  },
  {
    title: 'LinkMedical',
    description: 'A platform for finding and booking specialized medical office spaces, with search, filtering, and listing capabilities.',
    tags: ['React', 'Node.js', 'MongoDB', 'Express'],
    github: 'https://github.com/ujjwalv01',
    live: '#',
  },
]

function Projects() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="header-logo">Ujjwal Verma</Link>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </header>

      <main className="inner-page">
        <Link to="/" className="back">← back</Link>

        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">
          Things I've built - from hackathon prototypes to fully shipped products.
          Most are open-source.
        </p>

        <div className="projects-list">
          {projects.map((project, index) => (
            <div className="project" key={index}>
              <div className="project-header">
                <span className="project-title">{project.title}</span>
                <div className="project-links">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer">code</a>
                  )}
                  {project.live && project.live !== '#' && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer">live</a>
                  )}
                </div>
              </div>
              <p className="project-desc">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag, i) => (
                  <span className="tag" key={i}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="inner-footer">
        <div className="footer-inner">
          <span className="footer-credit">
            <a href="/">Ujjwal Verma</a>
          </span>
        </div>
      </footer>
    </>
  )
}

export default Projects
