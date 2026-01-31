
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Radio } from 'lucide-react';
import { AZURACAST_STREAM_URL } from '../constants';

const RadioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.src = AZURACAST_STREAM_URL; // Reload stream to catch up with live
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border-t-4 border-yellow-500">
      <audio ref={audioRef} />
      
      <div className="flex flex-col items-center gap-6">
        <div className="relative group">
          <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 ${isPlaying ? 'animate-pulse' : ''}`}></div>
          <button 
            onClick={togglePlay}
            className="relative flex items-center justify-center w-24 h-24 bg-blue-900 text-white rounded-full shadow-lg hover:scale-105 transition-transform active:scale-95"
          >
            {isPlaying ? <Pause size={48} /> : <Play size={48} className="ml-2" />}
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-cinzel font-bold text-blue-900">En Vivo</h2>
          <div className="flex items-center justify-center gap-2 text-yellow-600 font-semibold mt-1">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-gray-400'}`}></span>
            Transmisión en directo
          </div>
        </div>

        <div className="w-full max-w-xs flex items-center gap-3">
          <Volume2 size={20} className="text-gray-400" />
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
          />
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
