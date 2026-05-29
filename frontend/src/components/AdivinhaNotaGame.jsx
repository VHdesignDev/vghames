import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { auth } from '../firebase';
import { BACKEND_URL } from '../config';

let socket;

export default function Game({ gameType, onExit, lobbyId, user }) {
  const [gameState, setGameState] = useState(null);
  const [isHintGiver, setIsHintGiver] = useState(false);
  const [targetNote, setTargetNote] = useState(null);
  const [hints, setHints] = useState([]);
  const [currentHint, setCurrentHint] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guessResult, setGuessResult] = useState(null);
  const [showGuessPhase, setShowGuessPhase] = useState(false);

  useEffect(() => {
    console.log('🎮 Iniciando AdivinhaNotaGame. LobbyId:', lobbyId, 'User:', user?.uid);

    if (!socket) {
      socket = io(BACKEND_URL);
    }

    // Se já temos um lobbyId, fazer join
    if (lobbyId && user?.uid) {
      console.log(`👥 Entrando no room do jogo: ${lobbyId}`);
      socket.emit('join-lobby', {
        lobbyId: lobbyId,
        userId: user.uid
      });
    }

    // Evento: Jogo iniciado
    socket.on('game-started', (data) => {
      console.log('🎮 Jogo iniciado:', data);
      setGameState(data.gameState);
      setHints([]);
      setShowGuessPhase(false);
      setIsHintGiver(false);
    });

    // Evento: Eu sou o que dá dicas
    socket.on('you-are-hint-giver', (data) => {
      console.log('👨‍🏫 Você é quem dá dicas! Nota:', data.targetNote);
      setIsHintGiver(true);
      setTargetNote(data.targetNote);
      setHints([]);
      setShowGuessPhase(false);
    });

    // Evento: Dica recebida
    socket.on('hint-received', (data) => {
      console.log('💡 Dica recebida:', data.hint);
      setHints(prev => [...prev, data]);
    });

    // Evento: Fase de adivinhação iniciada
    socket.on('guessing-phase-started', () => {
      console.log('🔢 Fase de adivinhação iniciada');
      setShowGuessPhase(true);
    });

    // Evento: Adivinha correta
    socket.on('guess-correct', (data) => {
      console.log('✅ Adivinha correta!');
      setGuessResult({ correct: true, note: data.targetNote, scores: data.scores });
    });

    // Evento: Adivinha incorreta
    socket.on('guess-incorrect', (data) => {
      console.log('❌ Adivinha incorreta!');
      setGuessResult({ correct: false, note: data.targetNote, message: data.message });
    });

    // Evento: Próxima rodada
    socket.on('next-round', (data) => {
      console.log('🔄 Próxima rodada');
      setGameState(prev => ({
        ...prev,
        round: data.round,
        currentTeam: data.currentTeam,
        category: data.category,
      }));
      setHints([]);
      setCurrentHint('');
      setCurrentGuess('');
      setGuessResult(null);
      setShowGuessPhase(false);
      setIsHintGiver(false);
    });

    // Evento: Jogo finalizado
    socket.on('game-finished', (data) => {
      console.log('🏆 Jogo finalizado');
      setGameState(prev => ({ ...prev, phase: 'finished' }));
    });

    return () => {
      socket.off('game-started');
      socket.off('you-are-hint-giver');
      socket.off('hint-received');
      socket.off('guessing-phase-started');
      socket.off('guess-correct');
      socket.off('guess-incorrect');
      socket.off('next-round');
      socket.off('game-finished');
    };
  }, []);

  const handleSendHint = () => {
    if (currentHint.trim()) {
      socket.emit('send-hint', {
        lobbyId,
        userId: user.uid,
        hint: currentHint,
      });
      setCurrentHint('');
    }
  };

  const handleReadyToGuess = () => {
    socket.emit('ready-to-guess', { lobbyId });
  };

  const handleMakeGuess = () => {
    if (currentGuess && currentGuess >= 1 && currentGuess <= 10) {
      socket.emit('make-guess', {
        lobbyId,
        userId: user.uid,
        guess: currentGuess,
      });
    }
  };

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Aguardando jogo...</p>
        </div>
      </div>
    );
  }

  if (gameState.phase === 'finished') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">🏁 Jogo Finalizado!</h1>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-600 p-4 rounded-lg">
              <p className="text-gray-300">Time 1</p>
              <p className="text-3xl font-bold text-white">{gameState.scores.team1}</p>
            </div>
            <div className="bg-red-600 p-4 rounded-lg">
              <p className="text-gray-300">Time 2</p>
              <p className="text-3xl font-bold text-white">{gameState.scores.team2}</p>
            </div>
          </div>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-yellow-400 text-slate-900 font-bold rounded-lg hover:bg-yellow-300 transition"
          >
            ← Voltar ao Lobby
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      {/* Cabeçalho */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-yellow-400">🎵 Adivinha Nota</h1>
            <p className="text-gray-400">Rodada {gameState.round}/{gameState.maxRounds}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className={`p-3 rounded-lg ${gameState.currentTeam === 'team1' ? 'bg-blue-600' : 'bg-slate-700'}`}>
              <p className="text-sm text-gray-300">Time 1</p>
              <p className="text-2xl font-bold text-white">{gameState.scores.team1}</p>
            </div>
            <div className={`p-3 rounded-lg ${gameState.currentTeam === 'team2' ? 'bg-red-600' : 'bg-slate-700'}`}>
              <p className="text-sm text-gray-300">Time 2</p>
              <p className="text-2xl font-bold text-white">{gameState.scores.team2}</p>
            </div>
          </div>
        </div>

        {/* Categoria */}
        <div className="bg-slate-700 p-4 rounded-lg mb-6 text-center">
          <p className="text-gray-400 mb-2">Categoria</p>
          <p className="text-3xl font-bold text-yellow-300">📂 {gameState.category}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PAINEL DO QUE DÁ DICAS */}
        {isHintGiver && (
          <div className="bg-slate-800 p-6 rounded-lg border-2 border-green-500">
            <h2 className="text-2xl font-bold text-green-400 mb-4">👨‍🏫 Você dá as Dicas!</h2>
            
            {/* Nota Secreta */}
            <div className="bg-gradient-to-r from-green-600 to-green-400 p-6 rounded-lg mb-6 text-center">
              <p className="text-white text-sm mb-2">A nota secreta é:</p>
              <p className="text-6xl font-bold text-white">{targetNote}</p>
            </div>

            {/* Input de Dica */}
            {!showGuessPhase && (
              <div className="mb-6">
                <input
                  type="text"
                  value={currentHint}
                  onChange={(e) => setCurrentHint(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendHint()}
                  placeholder="Digite uma dica... (ex: 'Um clássico de Spielberg')"
                  className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-gray-500 mb-3"
                />
                <button
                  onClick={handleSendHint}
                  className="w-full px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition"
                >
                  💬 Enviar Dica
                </button>
              </div>
            )}

            {/* Botão para Fase de Adivinhação */}
            {!showGuessPhase && (
              <button
                onClick={handleReadyToGuess}
                className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition"
              >
                ✋ Pronto! Deixa ele Adivinhar
              </button>
            )}

            {showGuessPhase && (
              <div className="bg-blue-600 p-4 rounded-lg text-center">
                <p className="text-white font-bold">⏳ Aguardando adivinha...</p>
              </div>
            )}
          </div>
        )}

        {/* PAINEL DO QUE ADIVINHA */}
        {!isHintGiver && (
          <div className="bg-slate-800 p-6 rounded-lg border-2 border-purple-500">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">🧩 Você Adivinha!</h2>

            {/* Dicas Recebidas */}
            <div className="mb-6">
              <p className="text-white font-bold mb-3">💡 Dicas Recebidas:</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {hints.length === 0 ? (
                  <p className="text-gray-400 text-sm">Aguardando dicas...</p>
                ) : (
                  hints.map((hint, idx) => (
                    <div key={idx} className="bg-slate-700 p-3 rounded-lg">
                      <p className="text-yellow-300 text-sm">{hint.hint}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Input de Adivinha */}
            {showGuessPhase ? (
              <div>
                <p className="text-white mb-3 font-bold">Qual é a nota? (1-10)</p>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <button
                      key={num}
                      onClick={() => setCurrentGuess(num.toString())}
                      className={`p-3 rounded-lg font-bold text-lg transition ${
                        currentGuess === num.toString()
                          ? 'bg-yellow-400 text-slate-900'
                          : 'bg-slate-700 text-white hover:bg-slate-600'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleMakeGuess}
                  disabled={!currentGuess}
                  className="w-full px-4 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 disabled:bg-gray-600 transition"
                >
                  🎯 Enviar Adivinha
                </button>
              </div>
            ) : (
              <div className="bg-purple-600 p-4 rounded-lg text-center">
                <p className="text-white font-bold">⏳ Aguardando o sinal...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resultado da Adivinha */}
      {guessResult && (
        <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 rounded-lg text-center max-w-md z-50 ${
          guessResult.correct ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <h2 className={`text-3xl font-bold text-white mb-4 ${guessResult.correct ? '' : ''}`}>
            {guessResult.correct ? '✅ ACERTOU!' : '❌ ERROU!'}
          </h2>
          <p className="text-white text-lg mb-4">{guessResult.message || `A nota era: ${guessResult.note}`}</p>
          {guessResult.scores && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-black bg-opacity-50 p-3 rounded">
                <p className="text-sm text-gray-300">Time 1</p>
                <p className="text-2xl font-bold text-white">{guessResult.scores.team1}</p>
              </div>
              <div className="bg-black bg-opacity-50 p-3 rounded">
                <p className="text-sm text-gray-300">Time 2</p>
                <p className="text-2xl font-bold text-white">{guessResult.scores.team2}</p>
              </div>
            </div>
          )}
          <p className="text-white text-sm">⏳ Próxima rodada em breve...</p>
        </div>
      )}

      {/* Botão Voltar */}
      <div className="fixed top-4 left-4">
        <button
          onClick={onExit}
          className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}
