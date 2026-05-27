import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { LogOut } from 'lucide-react';

export default function Profile({ user, onLogout, onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{profile?.avatar}</div>
            <h1 className="text-3xl font-bold text-gray-800">{profile?.username}</h1>
            <p className="text-gray-600">{profile?.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">{profile?.friends?.length || 0}</p>
              <p className="text-gray-600">Amigos</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-gray-600">Vitórias</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => onNavigate('lobby')}
              className="flex-1 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition"
            >
              🎮 Jogar
            </button>
            <button
              onClick={onLogout}
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
