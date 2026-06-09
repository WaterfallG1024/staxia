import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import Home from './pages/Home';
import Stack from './pages/Stack';
import List from './pages/List';
import Setting from './pages/Setting';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-slate-200 dark:selection:bg-slate-800">
          {/* Main Content Area */}
          <main className="pb-24 max-w-4xl mx-auto min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stack" element={<Stack />} />
              <Route path="/list" element={<List />} />
              <Route path="/setting" element={<Setting />} />
            </Routes>
          </main>
          
          {/* Navigation */}
          <Navbar />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
