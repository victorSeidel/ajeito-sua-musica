import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface Recording { id: number; song_id: number; name: string; audio_path: string; created_at: string; }

const RecordingManager: React.FC = () => 
{
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const { token, apiUrl } = useAuth();
    const navigate = useNavigate();

    useEffect(() => 
    {
        if (!token) { navigate('/songs'); return; }

        const fetchData = async () => 
        {
        try 
        {
            const recordingsResponse = await fetch(`${apiUrl}/recordings/all`, { headers: { 'Authorization': `Bearer ${token}`} });

            const recordingsData = await recordingsResponse.json();
            setRecordings(recordingsData);
        } 
        catch (error) 
        {
            console.error(error);
        }
        };

        fetchData();
    }, [token, navigate]);


    const handleEditRecording = (recording: Recording) => { navigate(`/songs/${recording.song_id}/recordings/${recording.id}/edit`); };

    const handleDeleteRecording = async (recordingId: number) => 
    {  
        try 
        {
            if (!confirm('Tem certeza? Essa ação é irreversível')) return;

            const response = await fetch(`${apiUrl}/recordings/${recordingId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }, });

            if (!response.ok) alert('Erro ao excluir gravação. Tente novamente.');

            window.location.reload();
        } 
        catch (error) 
        {
            alert('Erro ao excluir sua gravação. Tente novamente.');
        }
    };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1c2e] to-[#0a1424] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button onClick={() => navigate('/songs')}
                className="text-white bg-black px-4 py-2 rounded-md hover:bg-red-500 transition">
              Voltar
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center my-6">
          <h2 className="text-white text-2xl font-bold">Gravações</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recordings.map(recording => (
            <div key={recording.id} className="bg-black/60 rounded-xl p-5 flex flex-col justify-between shadow shadow-emerald-400">
              <h3 className="text-white text-lg font-bold my-2">{recording.name || 'Gravação sem nome'}</h3>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleEditRecording(recording)}
                    className="mt-4 bg-emerald-400 text-black py-2 rounded-lg font-semibold hover:bg-emerald-500 transition o">
                  Visualizar
                </button>
                <button onClick={() => handleDeleteRecording(recording.id)}
                    className="bg-red-400 text-black py-2 rounded-lg font-semibold hover:bg-red-500 transition o">
                  Excluir Melodia
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