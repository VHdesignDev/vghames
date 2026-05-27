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

// Firebase Admin Setup
try {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  });
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Firebase Admin error:', error.message);
}

const db = admin.firestore();
const auth = admin.auth();

// ========== LOBBYS ==========
const lobbys = new Map(); // { lobbyId -> { id, host, players, game, status } }
const playerLobbys = new Map(); // { userId -> lobbyId }

// Criar novo lobby
app.post('/api/lobbys', async (req, res) => {
  try {
    const { userId, gameName } = req.body;
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

    // Salvar no Firestore
    await db.collection('lobbys').doc(lobbyId).set(lobby);

    res.json({ success: true, lobbyId, lobby });
  } catch (error) {
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
      io.to(lobbyId).emit('game-started', { game: lobby.game });
      console.log(`🎮 Jogo iniciado: ${lobby.game} (${lobbyId})`);
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
