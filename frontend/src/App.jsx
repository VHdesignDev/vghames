import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import Profile from './components/Profile';
import Lobby from './components/Lobby';
import Game from './components/Game';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [gameType, setGameType] = useState(null);
  const [lobbyId, setLobbyId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se usuário está logado
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setCurrentPage('profile');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setCurrentPage('profile');
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setCurrentPage('login');
  };

  const handleNavigate = (page, data = {}) => {
    if (page === 'game') {
      setGameType(data.game);
      setLobbyId(data.lobbyId);
    }
    setCurrentPage(page);
  };

  const handleExitGame = () => {
    setGameType(null);
    setCurrentPage('lobby');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-2xl">⏳ Carregando...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {currentPage === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
      {currentPage === 'profile' && user && (
        <Profile user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
      )}
      {currentPage === 'lobby' && user && (
        <Lobby user={user} onNavigate={handleNavigate} />
      )}
      {currentPage === 'game' && user && (
        <Game gameType={gameType} onExit={handleExitGame} lobbyId={lobbyId} user={user} />
      )}
    </div>
  );
}
