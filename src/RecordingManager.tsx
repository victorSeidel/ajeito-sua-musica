import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface Recording {
  id: number;
  name: string;
  audio_path: string;
  created_at: string;
}

interface Song {
  id: number;
  name: string;
  rhythm: string;
  genre: string;
  audio_path: string;
}

const RecordingManager: React.FC = () => {
  const { songId } = useParams<{ songId: string }>();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [song, setSong] = useState<Song | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => 
  {
    if (!token || !songId) { navigate('/songs'); return; }

    const fetchData = async () => 
    {
      try 
      {
        const songResponse = await fetch(`http://localhost:3000/api/songs/${songId}`, 
        {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!songResponse.ok) throw new Error('Failed to fetch song');

        const songData = await songResponse.json();
        setSong(songData);

        const recordingsResponse = await fetch(`http://localhost:3000/api/recordings/${songId}`, 
        {
          headers: { 'Authorization': `Bearer ${token}`}
        });

        const recordingsData = await recordingsResponse.json();
        setRecordings(recordingsData);
      } 
      catch (error) 
      {
        console.error(error);
      }
    };

    fetchData();
  }, [token, songId, navigate]);

  const handleNewRecording = () => { navigate(`/songs/${songId}/recordings/new`); };

  const handleEditRecording = (recordingId: number) => { navigate(`/songs/${songId}/recordings/${recordingId}/edit`); };

  const handleDeleteRecording = async (recordingId: number) => 
  {  
    try 
    {
      if (!confirm('Tem certeza? Essa ação é irreversível')) return;

      const response = await fetch(`http://localhost:3000/api/recordings/${recordingId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }, });

      if (!response.ok) alert('Erro ao excluir gravação. Tente novamente.');

      window.location.reload();
    } 
    catch (error) 
    {
      console.error(error);
    }
  };

  if (!song) return <div className="min-h-screen bg-black text-white p-4">Carregando...</div>;

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">{song.name}</h1>
            <div className="text-stone-400">
              <span>{song.genre}</span> • <span>{song.rhythm}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/songs')}
                className="flex items-center gap-2 text-white border border-stone-700 rounded-lg px-4 py-2 hover:bg-stone-800 transition-colors">
              Voltar
            </button>
            <button onClick={handleNewRecording}
                className="flex items-center gap-2 text-white rounded-lg px-4 py-2 bg-emerald-400 border border-emerald-400 hover:bg-transparent transition-colors">
              Nova Gravação
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Gravações</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recordings.map(recording => (
            <div key={recording.id} className="bg-stone-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white">{recording.name}</h3>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEditRecording(recording.id)}
                  className="text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDeleteRecording(recording.id)}
                  className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecordingManager;