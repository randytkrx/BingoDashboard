import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TeamPage from './TeamPage';
import SummaryPage from './SummaryPage';

const teams = ['Team1', 'Team2', 'Team3', 'Team4', 'Team5', 'Team6'];

function App() {
  const [darkMode, setDarkMode] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <Router >
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="bg-white dark:bg-gray-800 shadow p-4 sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto space-y-2 sm:space-y-0 sm:space-x-4">
            <h1 className="text-xl font-bold">Bingo Dashboard</h1>
            <nav className="flex flex-wrap gap-2 justify-center">
              <Link to="/" className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">All Teams</Link>
              {teams.map(team => (
                <Link key={team} to={`/${team.toLowerCase()}`} className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                  {team}
                </Link>
              ))}
            </nav>
            <button onClick={() => setDarkMode(!darkMode)} className="text-sm text-blue-500 hover:underline">
              Toggle {darkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </header>

        <main className="flex-grow p-4 max-w-6xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<SummaryPage />} />
            {teams.map(team => (
              <Route key={team} path={`/${team.toLowerCase()}`} element={<TeamPage team={team} />} />
            ))}
          </Routes>
        </main>

        <footer className="text-center text-xs text-gray-500 p-4 bg-white dark:bg-gray-800">
          Made by s59 for Mercenary Clan
        </footer>
      </div>
    </Router>
  );
}

export default App;
