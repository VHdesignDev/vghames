import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '../config';
import { Plus, LogOut } from 'lucide-react';

export default function Lobby({ user, onNavigate }) {
  const [lobbys, setLobbys] = useState([]);
  const [currentLobby, setCurrentLobby] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState('adivinha-nota');

  const GAMES = [
    { id: 'adivinha-nota', name: '🎵 Adivinha Nota', players: '2-4' },
    { id: 'wavelength', name: '📡 Wavelength', players: '3-8' },
    { id: 'chameleon', name: '🦎 The Chameleon', players: '3-8' },
    { id: 'ito', name: '💭 ITO', players: '1-99' },
  ];

  useEffect(() => {
    // Conectar ao Socket.io
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Conectado ao backend');
      loadLobbys();
    });

    newSocket.on('players-updated', (data) => {
      if (currentLobby) {
        setCurrentLobby(prev => ({
          ...prev,
          players: data.players
        }));
      }
    });

    newSocket.on('game-started', (data) => {
      console.log('🎮 Jogo iniciado:', data.game);
      onNavigate('game', { game: data.game, lobbyId: currentLobby?.id });
    });

    return () => newSocket.disconnect();
  }, []);

  const loadLobbys = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/lobbys`);
      const data = await res.json();
      setLobbys(data.lobbys || []);
    } catch (error) {
      console.error('Erro ao carregar lobbys:', error);
    }
  };

  const createLobby = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/lobbys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          gameName: selectedGame
        })
      });

      const data = await res.json();
      if (data.success) {
        const newLobby = data.lobby;
        setCurrentLobby(newLobby);
        
        // Conectar ao lobby via Socket.io
        socket.emit('join-lobby', {
          lobbyId: newLobby.id,
          userId: user.uid
        });
      }
    } catch (error) {
      console.error('Erro ao criar lobby:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinLobby = (lobby) => {
    setCurrentLobby(lobby);
    socket.emit('join-lobby', {
      lobbyId: lobby.id,
      userId: user.uid
    });
  };

  const startGame = () => {
    if (currentLobby) {
      socket.emit('start-game', {
        lobbyId: currentLobby.id,
        userId: user.uid
      });
    }
  };

  const leaveLobby = () => {
    if (socket && currentLobby) {
      socket.emit('leave-lobby', { userId: user.uid });
      setCurrentLobby(null);
    }
  };

  if (currentLobby) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Lobby: {currentLobby.id}
            </h1>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Jogadores ({currentLobby.players.length})</h2>
              <div className="space-y-2">
                {currentLobby.players.map(playerId => (
                  <div key={playerId} className="bg-gray-100 p-3 rounded-lg">
                    👤 {playerId === user.uid ? 'Você' : playerId}
                    {playerId === currentLobby.host && ' 👑'}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {currentLobby.host === user.uid && (
                <button
                  onClick={startGame}
                  disabled={currentLobby.players.length < 2}
                  className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  🚀 Iniciar Jogo
                </button>
              )}
              <button
                onClick={leaveLobby}
                className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <LogOut size={18} /> Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-4">🎮 Lobbys</h1>
          
          {/* Criar novo lobby */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Criar novo lobby</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Escolha um jogo:</label>
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  {GAMES.map(game => (
                    <option key={game.id} value={game.id}>
                      {game.name} ({game.players} jogadores)
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={createLobby}
                disabled={loading}
                className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Criar Lobby
              </button>
            </div>
          </div>

          {/* Lobbys disponíveis */}
          <h2 className="text-xl font-bold text-white mb-3">Lobbys disponíveis</h2>
          <div className="grid gap-4">
            {lobbys.length === 0 ? (
              <div className="bg-white bg-opacity-20 text-white p-6 rounded-lg text-center">
                Nenhum lobby disponível. Crie um!
              </div>
            ) : (
              lobbys.map(lobby => (
                <div key={lobby.id} className="bg-white rounded-lg shadow-lg p-6 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold text-gray-800">{lobby.game}</p>
                    <p className="text-gray-600">Lobby: {lobby.id}</p>
                    <p className="text-sm text-gray-500">{lobby.players.length} jogadores</p>
                  </div>
                  <button
                    onClick={() => joinLobby(lobby)}
                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                  >
                    Entrar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          onClick={() => onNavigate('profile')}
          className="bg-white text-purple-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition"
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}
