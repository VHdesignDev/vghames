import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://vghames.vercel.app' 
      : 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Firebase Admin Setup (Comentado: ativar depois quando Firestore estiver funcionando)
/*
try {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, '');
  
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: privateKey,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  });
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Firebase Admin error:', error.message);
}

const db = admin.firestore();
const auth = admin.auth();
*/

console.log('✅ Servidor rodando (Firebase Firestore comentado por enquanto)');

// ========== LOBBYS ==========
const lobbys = new Map(); // { lobbyId -> { id, host, players, game, status } }
const playerLobbys = new Map(); // { userId -> lobbyId }

// ========== GAME STATES ==========
const gameStates = new Map(); // { lobbyId -> { round, teams, scores, currentTeam, targetNote, category, tips, guesses, hintGiver, guesser } }

const CATEGORIES = [
  'Filmes', 'Músicas', 'Celebridades', 'Comidas', 'Países',
  'Livros', 'Séries', 'Animais', 'Jogos', 'Esportes',
  'Profissões', 'Marcas', 'Bebidas', 'Frutas', 'Flores'
];

const getRandomCategory = () => CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
const getRandomNote = () => Math.floor(Math.random() * 10) + 1; // 1-10

// Criar novo lobby
app.post('/api/lobbys', async (req, res) => {
  try {
    const { userId, gameName } = req.body;
    console.log('📝 Criando lobby:', { userId, gameName });
    
    const lobbyId = Math.random().toString(36).substring(7).toUpperCase();
    
    const lobby = {
      id: lobbyId,
      host: userId,
      players: [userId],
      game: gameName,
      status: 'waiting', // waiting | playing | finished
      createdAt: new Date().toISOString(),
    };

    lobbys.set(lobbyId, lobby);
    playerLobbys.set(userId, lobbyId);

    // Comentado: Salvar no Firestore (ativar depois)
    // await db.collection('lobbys').doc(lobbyId).set(lobby);
    
    console.log('✅ Lobby criado:', lobbyId);

    res.json({ success: true, lobbyId, lobby });
  } catch (error) {
    console.error('❌ Erro ao criar lobby:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Listar lobbys disponíveis
app.get('/api/lobbys', async (req, res) => {
  try {
    const activeLobbys = Array.from(lobbys.values()).filter(
      l => l.status === 'waiting'
    );
    res.json({ success: true, lobbys: activeLobbys });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== WEBSOCKET (Socket.io) ==========
io.on('connection', (socket) => {
  console.log(`👤 Usuário conectado: ${socket.id}`);

  // Usuário entrou em um lobby
  socket.on('join-lobby', (data) => {
    const { lobbyId, userId } = data;
    const lobby = lobbys.get(lobbyId);

    if (!lobby) {
      socket.emit('error', { message: 'Lobby não encontrado' });
      return;
    }

    if (lobby.status !== 'waiting') {
      socket.emit('error', { message: 'Jogo já começou' });
      return;
    }

    // Adicionar player ao lobby
    if (!lobby.players.includes(userId)) {
      lobby.players.push(userId);
    }

    playerLobbys.set(userId, lobbyId);
    socket.join(lobbyId);

    // Notificar todos no lobby
    io.to(lobbyId).emit('players-updated', {
      players: lobby.players,
      count: lobby.players.length,
    });

    console.log(`✅ ${userId} entrou no lobby ${lobbyId}`);
  });

  // Iniciar jogo
  socket.on('start-game', (data) => {
    const { lobbyId, userId } = data;
    const lobby = lobbys.get(lobbyId);

    if (lobby && lobby.host === userId) {
      lobby.status = 'playing';
      
      // Inicializar estado do jogo
      if (lobby.game === 'Adivinha Nota') {
        const team1 = lobby.players.slice(0, Math.ceil(lobby.players.length / 2));
        const team2 = lobby.players.slice(Math.ceil(lobby.players.length / 2));
        
        const gameState = {
          round: 1,
          maxRounds: 3,
          teams: { team1, team2 },
          scores: { team1: 0, team2: 0 },
          currentTeam: 'team1',
          targetNote: getRandomNote(),
          category: getRandomCategory(),
          tips: [],
          guesses: [],
          hintGiver: team1[0],
          guesser: team1[1] || team1[0],
          phase: 'hints', // hints | guessing | finished
          startTime: new Date(),
        };
        
        gameStates.set(lobbyId, gameState);
        
        io.to(lobbyId).emit('game-started', {
          game: lobby.game,
          gameState: {
            ...gameState,
            targetNote: undefined, // Não enviar a nota para ninguém ainda
          }
        });
        
        // Enviar nota apenas para o jogador que vai dar dicas
        socket.to(team1[0] || team1[1]).emit('you-are-hint-giver', {
          targetNote: gameState.targetNote,
          category: gameState.category,
          guesser: gameState.guesser,
        });
        
        console.log(`🎮 Jogo 'Adivinha Nota' iniciado: ${lobbyId} | Nota: ${gameState.targetNote}, Categoria: ${gameState.category}`);
      }
    }
  });

  // Enviar dica
  socket.on('send-hint', (data) => {
    const { lobbyId, userId, hint } = data;
    const gameState = gameStates.get(lobbyId);
    const lobby = lobbys.get(lobbyId);
    
    if (gameState && gameState.phase === 'hints' && gameState.hintGiver === userId) {
      gameState.tips.push({ userId, hint, timestamp: new Date() });
      io.to(lobbyId).emit('hint-received', { hint, userId });
      console.log(`💡 Dica em ${lobbyId}: "${hint}"`);
    }
  });

  // Fazer adivinha
  socket.on('make-guess', (data) => {
    const { lobbyId, userId, guess } = data;
    const gameState = gameStates.get(lobbyId);
    
    if (gameState && gameState.guesser === userId && gameState.phase === 'guessing') {
      const guessNum = parseInt(guess);
      const isCorrect = guessNum === gameState.targetNote;
      
      gameState.guesses.push({ userId, guess: guessNum, isCorrect, timestamp: new Date() });
      
      if (isCorrect) {
        gameState.scores[gameState.currentTeam] += 10;
        io.to(lobbyId).emit('guess-correct', {
          guess: guessNum,
          targetNote: gameState.targetNote,
          team: gameState.currentTeam,
          scores: gameState.scores,
        });
        console.log(`✅ Adivinha correta em ${lobbyId}! Nota: ${gameState.targetNote}`);
      } else {
        io.to(lobbyId).emit('guess-incorrect', {
          guess: guessNum,
          targetNote: gameState.targetNote,
          message: `Não... A nota era ${gameState.targetNote}!`,
        });
        console.log(`❌ Adivinha errada em ${lobbyId}. Chutou ${guessNum}, era ${gameState.targetNote}`);
      }
      
      // Passar para próxima rodada após 3s
      setTimeout(() => {
        gameState.tips = [];
        gameState.guesses = [];
        gameState.phase = 'hints';
        gameState.round += 1;
        
        if (gameState.round > gameState.maxRounds) {
          gameState.phase = 'finished';
          io.to(lobbyId).emit('game-finished', { scores: gameState.scores });
          console.log(`🏁 Jogo finalizado em ${lobbyId}`);
        } else {
          // Alternar times
          gameState.currentTeam = gameState.currentTeam === 'team1' ? 'team2' : 'team1';
          gameState.targetNote = getRandomNote();
          gameState.category = getRandomCategory();
          gameState.hintGiver = gameState.teams[gameState.currentTeam][0];
          gameState.guesser = gameState.teams[gameState.currentTeam][1] || gameState.teams[gameState.currentTeam][0];
          
          io.to(lobbyId).emit('next-round', {
            round: gameState.round,
            currentTeam: gameState.currentTeam,
            category: gameState.category,
          });
          
          // Notificar novo hint giver
          socket.to(gameState.hintGiver).emit('you-are-hint-giver', {
            targetNote: gameState.targetNote,
            category: gameState.category,
            guesser: gameState.guesser,
          });
        }
      }, 3000);
    }
  });

  // Mudar para fase de adivinhação
  socket.on('ready-to-guess', (data) => {
    const { lobbyId } = data;
    const gameState = gameStates.get(lobbyId);
    
    if (gameState) {
      gameState.phase = 'guessing';
      io.to(lobbyId).emit('guessing-phase-started');
      console.log(`🎯 Fase de adivinhação iniciada em ${lobbyId}`);
    }
  });

  // Enviar evento do jogo
  socket.on('game-event', (data) => {
    const { lobbyId, event, payload } = data;
    io.to(lobbyId).emit('game-event', { event, payload });
  });

  // Sair do lobby
  socket.on('leave-lobby', (data) => {
    const { userId } = data;
    const lobbyId = playerLobbys.get(userId);

    if (lobbyId) {
      const lobby = lobbys.get(lobbyId);
      if (lobby) {
        lobby.players = lobby.players.filter(p => p !== userId);
        
        if (lobby.players.length === 0) {
          lobbys.delete(lobbyId);
          console.log(`🗑️ Lobby vazio deletado: ${lobbyId}`);
        } else {
          io.to(lobbyId).emit('players-updated', {
            players: lobby.players,
            count: lobby.players.length,
          });
        }
      }
      playerLobbys.delete(userId);
      socket.leave(lobbyId);
    }
  });

  socket.on('disconnect', () => {
    console.log(`👋 Usuário desconectado: ${socket.id}`);
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
  console.log(`📊 Socket.io pronto para conexões`);
});
