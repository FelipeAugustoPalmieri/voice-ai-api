'use client';

import { useState, useRef } from 'react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

export default function AudioRecorder() {
  const [response, setResponse] = useState<{ transcription: string; aiResponse: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isRecording, startRecording, stopRecording, audioBlob } = useAudioRecorder();

  const handleSubmit = async () => {
    if (!audioBlob) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      formData.append('language', 'pt');

      const result = await fetch('http://localhost:4000/audio/process', {
        method: 'POST',
        body: formData,
      });

      const data = await result.json();
      setResponse(data);
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-6 py-3 rounded-full font-semibold ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>

      {audioBlob && !isRecording && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Process Audio'}
          </button>
        </div>
      )}

      {response && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Transcription:</h3>
            <p>{response.transcription}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">AI Response:</h3>
            <p>{response.aiResponse}</p>
          </div>
        </div>
      )}
    </div>
  );
}