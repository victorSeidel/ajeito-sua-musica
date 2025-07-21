import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

interface Song { id: number; name: string; rhythm: string; genre: string; audio_path: string; }

const SongList: React.FC = () => 
{
  const [songs, setSongs] = useState<Song[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newSong, setNewSong] = useState({ name: '', rhythm: '', genre: '', audio: null as File | null });
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => 
  {
    if (!token) { navigate('/login'); return; }

    const fetchSongs = async () => 
    {
      try 
      {
        const response = await fetch(`http://localhost:3000/api/songs`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await response.json();
        setSongs(data);
      } 
      catch (error) 
      {
        console.error(error);
      }
    };

    fetchSongs();
  }, [token, navigate]);

  const handleDeleteSong = async (songId: number) => 
  {  
    try 
    {
      if (!confirm('Tem certeza? Essa ação é irreversível')) return;

      const response = await fetch(`http://localhost:3000/api/songs/${songId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }, });

      if (!response.ok) alert('Erro ao excluir música. Tente novamente.');

      window.location.reload();
    } 
    catch (error) 
    {
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { const { name, value } = e.target; setNewSong(prev => ({ ...prev, [name]: value })); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) setNewSong(prev => ({ ...prev, audio: e.target.files![0] })); };

  const handleSubmit = async (e: React.FormEvent) => 
  {
    e.preventDefault();
    if (!newSong.audio || !token) return;

    const formData = new FormData();
    formData.append('name', newSong.name);
    formData.append('rhythm', newSong.rhythm);
    formData.append('genre', newSong.genre);
    formData.append('audio', newSong.audio);

    try 
    {
      const response = await fetch(`http://localhost:3000/api/songs`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });

      if (response.ok) 
      {
        const song = await response.json();
        setSongs(prev => [...prev, song]);
        setShowModal(false);
        setNewSong({ name: '', rhythm: '', genre: '', audio: null });
      }
    } 
    catch (error) 
    {
      console.error(error);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Ajeito Sua Música</h1>
          <div className="flex items-center gap-4">
            <span className="text-white">{user?.username}</span>
            <button onClick={() => setShowModal(true)}
                className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition-colors">
              + Adicionar Música
            </button>
            <button onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
              Sair {'>'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs.map(song => (
            <div key={song.id} onClick={() => navigate(`/songs/${song.id}/recordings`)}
              className="bg-stone-900 rounded-lg p-4 cursor-pointer hover:bg-stone-800 transition-colors" >
              <h3 className="text-xl font-semibold text-white">{song.name}</h3>
              <div className="text-stone-400 mt-2">
                <p>Gênero: {song.genre}</p>
                <p>Ritmo: {song.rhythm}</p>
              </div>
              <button onClick={() => handleDeleteSong(song.id)}
                  className="text-white bg-red-500 mt-3 px-3 py-1 rounded hover:bg-red-600 transition-colors">
                Excluir
              </button>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-stone-900 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-4">Adicionar Nova Música</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-stone-300 mb-2">Nome</label>
                  <input type="text" name="name" value={newSong.name} onChange={handleInputChange} required
                    className="w-full p-2 rounded bg-stone-800 text-white border border-stone-700" />
                </div>
                <div className="mb-4">
                  <label className="block text-stone-300 mb-2">Ritmo</label>
                  <input type="text" name="rhythm" value={newSong.rhythm} onChange={handleInputChange} required
                    className="w-full p-2 rounded bg-stone-800 text-white border border-stone-700"/>
                </div>
                <div className="mb-4">
                  <label className="block text-stone-300 mb-2">Gênero</label>
                  <input type="text" name="genre" value={newSong.genre} onChange={handleInputChange} required
                    className="w-full p-2 rounded bg-stone-800 text-white border border-stone-700"/>
                </div>
                <div className="mb-6">
                  <label className="block text-stone-300 mb-2">Arquivo de Áudio</label>
                  <input type="file" accept="audio/*" onChange={handleFileChange} required
                    className="w-full p-2 rounded bg-stone-800 text-white border border-stone-700"/>
                </div>
                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-white bg-stone-700 rounded hover:bg-stone-600 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit"
                      className="px-4 py-2 text-white bg-emerald-500 rounded hover:bg-emerald-600 transition-colors">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongList;