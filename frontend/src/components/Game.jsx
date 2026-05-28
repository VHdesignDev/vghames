import React from 'react';
import AdivinhaNotaGame from './AdivinhaNotaGame';

export default function Game({ gameType, onExit, lobbyId, user }) {
  if (gameType === 'Adivinha Nota' || gameType === 'adivinha-nota') {
    return <AdivinhaNotaGame gameType={gameType} onExit={onExit} lobbyId={lobbyId} user={user} />;
  }

  // Fallback para outros jogos
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">🎮 {gameType}</h1>
        
        <div className="bg-gray-100 p-12 rounded-lg mb-6">
          <p className="text-gray-600">Jogo será implementado aqui</p>
        </div>

        <button
          onClick={onExit}
          className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition"
        >
          ← Voltar ao Lobby
        </button>
      </div>
    </div>
  );
}
