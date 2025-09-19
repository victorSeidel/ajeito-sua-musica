import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AudioEditor from './AudioEditor';
import { useAuth } from './AuthContext';

const AudioEditorPage = () => {
  const { songId } = useParams();
  const [recordingId] = useState<string | null>(null);
  const { token, apiUrl } = useAuth();
  const navigate = useNavigate();

  const handleSave = async (audioBlob: Blob) => 
  {
    try 
    {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      
      const url = recordingId ? `${apiUrl}/recordings/${recordingId}` : `${apiUrl}/recordings`;
      
      const method = recordingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}`, }, body: formData});

      if (response.ok) navigate(`/songs/${songId}/recordings`);
    }
    catch (error) 
     {
      console.error('Error saving recording:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <AudioEditor
        songId={songId}
        recordingId={recordingId ?? ''}
        onSave={handleSave}
        onCancel={() => navigate(`/songs`)}
      />
    </div>
  );
};

export default AudioEditorPage;