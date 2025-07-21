import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './Login';
import Register from './Register';
import SongList from './SongList';
import RecordingManager from './RecordingManager';
import AudioEditorPage from './AudioEditorPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Navigate to="/songs" replace />} />

          <Route path="/songs" element={<SongList />} />
          
          <Route path="/songs/:songId/recordings" element={<RecordingManager />} />
          <Route path="/songs/:songId/recordings/new" element={<AudioEditorPage />} />
          <Route path="/songs/:songId/recordings/:recordingId/edit" element={<AudioEditorPage />}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;