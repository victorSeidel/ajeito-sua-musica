import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Music, Mic, Headphones, Download } from 'lucide-react';

const Login: React.FC = () => 
{
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => 
    {
        e.preventDefault();
        try 
        {
            await register(username, email, password);
            navigate('/songs');
        } 
        catch (err) 
        {
            setError('Failed to register. Please try again.');
        }
    };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold">Melodize</h1>
        <p className="text-gray-400 mt-2">
          Grave sua voz sobre playbacks profissionais e crie suas próprias melodias
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-5xl w-full">
        <div className="bg-black/40 border border-emerald-400 rounded-xl p-5 text-center">
          <Music className="text-emerald-400 text-3xl mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Bases Premium</h3>
          <p className="text-gray-400 text-sm">
            Biblioteca com centenas de playbacks de alta qualidade
          </p>
        </div>
        <div className="bg-black/40 border border-emerald-400 rounded-xl p-5 text-center">
          <Mic className="text-emerald-400 text-3xl mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Crie a sua Melodia</h3>
          <p className="text-gray-400 text-sm">
            Crie sua melodia exclusiva e registre em seu nome
          </p>
        </div>
        <div className="bg-black/40 border border-emerald-400 rounded-xl p-5 text-center">
          <Headphones className="text-emerald-400 text-3xl mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Mixer Integrado</h3>
          <p className="text-gray-400 text-sm">
            Ajuste volumes em tempo real
          </p>
        </div>
        <div className="bg-black/40 border border-emerald-400 rounded-xl p-5 text-center">
          <Download className="text-emerald-400 text-3xl mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Exporte em Mp3</h3>
          <p className="text-gray-400 text-sm">
            Salve e baixe suas criações em alta qualidade
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-neutral-900 rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Registrar</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Insira um e-mail"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setUsername(e.target.value); }}
            className="w-full p-3 rounded bg-black/50 text-white border border-gray-700 mb-4 focus:outline-none focus:border-emerald-400"
            required
          />
          <input
            type="password"
            placeholder="Insira uma senha segura"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-black/50 text-white border border-gray-700 mb-4 focus:outline-none focus:border-emerald-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-emerald-400 text-black py-3 rounded-md font-semibold hover:bg-emerald-500 transition"
          >
            Registrar e criar minha próxima música
          </button>
        </form>
        <div className="text-center my-2 text-gray-500">Ou</div>
        <button
          onClick={() => navigate('/login')}
          className="w-full border border-emerald-400 text-emerald-400 py-3 rounded-md font-semibold hover:bg-emerald-400 hover:text-black transition"
        >
          Já tem uma conta? <span className="text-gray-400">Entrar &gt;</span>
        </button>
        <p className="text-gray-400 text-sm text-center mt-4">
          Plataforma segura e exclusiva para Compositores Premium
        </p>
      </div>
    </div>
  );
};

export default Login;