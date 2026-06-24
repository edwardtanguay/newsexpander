import { useState, useEffect } from 'react'
import './App.css'
import initialTerms from './data/terms.json'

function App() {
  const [terms, setTerms] = useState([])

  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Shuffle terms on initial load
  useEffect(() => {
    setTerms(shuffleArray(initialTerms))
  }, [])

  const handleShuffle = () => {
    setTerms(shuffleArray(terms))
  }

  const getYouTubeSearchUrl = (term) => {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const yyyy = sixMonthsAgo.getFullYear()
    const mm = String(sixMonthsAgo.getMonth() + 1).padStart(2, '0')
    const dd = String(sixMonthsAgo.getDate()).padStart(2, '0')
    const query = `${term} after:${yyyy}-${mm}-${dd}`
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
  }

  const getCombinedYouTubeSearchUrl = (term1, term2) => {
    const query = `"${term1}" "${term2}"`
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=CAI%253D`
  }

  // Derive up to 3 random pairs from current shuffled terms list dynamically
  const getComboPairs = (arr) => {
    const pairs = []
    const maxCombos = Math.min(3, Math.floor(arr.length / 2))
    for (let i = 0; i < maxCombos; i++) {
      pairs.push([arr[i * 2], arr[i * 2 + 1]])
    }
    return pairs
  }
  
  const comboPairs = getComboPairs(terms)

  // Calculate dynamic font sizes based on character lengths to fit standard card sizes
  const getCardTextStyle = (name, description) => {
    const totalLength = (name?.length || 0) + (description?.length || 0)
    let titleSize = '1.4rem'
    let descSize = '0.95rem'

    if (totalLength > 160) {
      titleSize = '1.25rem'
      descSize = '0.85rem'
    } else if (totalLength > 110) {
      titleSize = '1.3rem'
      descSize = '0.9rem'
    } else if (totalLength > 70) {
      titleSize = '1.35rem'
      descSize = '0.92rem'
    }

    return {
      titleStyle: { fontSize: titleSize },
      descStyle: { fontSize: descSize }
    }
  }

  return (
    <main className="app-container">
      <header className="header">
        <div className="badge">Knowledge Horizon</div>
        <h1 className="title">News Expander</h1>
        <p className="subtitle">
          Break out of your information bubble. Discover fresh concepts, emerging technologies, and critical debates. Click any topic to search videos on YouTube.
        </p>
      </header>

      <section className="controls">
        <button className="btn btn-primary" onClick={handleShuffle}>
          <span className="btn-icon">⚡</span>
          Shuffle Topics
        </button>
      </section>

      {comboPairs.length > 0 && (
        <section className="combo-section">
          <h2 className="section-title">Cross-Perspective Combos</h2>
          <p className="section-subtitle">Synthesize knowledge by searching for overlapping videos between two distinct topics.</p>
          <div className="combo-buttons">
            {comboPairs.map(([term1, term2], idx) => (
              <a
                key={idx}
                href={getCombinedYouTubeSearchUrl(term1.name, term2.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-combo"
              >
                <span className="combo-icon">🧬</span>
                <span className="combo-text">{term1.name} + {term2.name}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="grid-container">
        {terms.map((term, index) => {
          const { titleStyle, descStyle } = getCardTextStyle(term.name, term.description)
          return (
            <a
              key={term.name}
              href={getYouTubeSearchUrl(term.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="term-card"
              style={{ '--index': index }}
            >
              <div className="card-badge">Topic {index + 1}</div>
              <div className="card-content">
                <h2 className="term-title" style={titleStyle}>{term.name}</h2>
                {term.description && (
                  <p className="term-description" style={descStyle}>
                    <span className="desc-prefix">Relevant because </span>
                    {term.description}
                  </p>
                )}
              </div>
              <div className="card-action">
                Explore on YouTube
                <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
            </a>
          )
        })}
      </section>

      <footer className="footer">
        <p>Curate your feed, expand your mind. Edit <code>terms.txt</code> in the root and run <code>npm run pd</code> to update.</p>
      </footer>
    </main>
  )
}

export default App
