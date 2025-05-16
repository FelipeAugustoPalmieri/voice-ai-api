import AudioRecorder from '@/components/AudioRecorder';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Voice AI Assistant</h1>
        <AudioRecorder />
      </div>
    </main>
  );
}