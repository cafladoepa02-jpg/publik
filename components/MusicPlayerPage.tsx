
import React, { useState, useRef, useEffect } from 'react';
import type { MusicTrack } from '../types';
import { PlayIcon, PauseIcon, NextIcon, PrevIcon } from './common/Icons';

const playlist: MusicTrack[] = [
  { id: 1, title: 'Elven Lament', artist: 'Lyra Meadowlight', url: 'https://storage.googleapis.com/music-portal-7b58c.appspot.com/elven-lament.mp3', cover: 'https://picsum.photos/seed/elven/400' },
  { id: 2, title: 'Forge of the Dwarven Kings', artist: 'Gimli Rockbeard', url: 'https://storage.googleapis.com/music-portal-7b58c.appspot.com/dwarven-forge.mp3', cover: 'https://picsum.photos/seed/dwarf/400' },
  { id: 3, title: 'Whispers of the Feywild', artist: 'Aria Whisperwind', url: 'https://storage.googleapis.com/music-portal-7b58c.appspot.com/feywild-whispers.mp3', cover: 'https://picsum.photos/seed/fey/400' },
  { id: 4, title: 'Ocean\'s Serenade', artist: 'Coralia Wavecaller', url: 'https://storage.googleapis.com/music-portal-7b58c.appspot.com/oceans-serenade.mp3', cover: 'https://picsum.photos/seed/ocean/400' },
];

export const MusicPlayerPage: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    const handleEnded = () => nextTrack();

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Playback error:", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };
  
  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newTime = (clickPosition / progressBar.offsetWidth) * audio.duration;
    audio.currentTime = newTime;
  };


  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold font-fantasy text-white mb-8 text-center">Chamber of Enchantments</h2>
      <div className="w-full max-w-sm bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl shadow-fuchsia-500/20 border border-slate-700 p-6">
        <div className="relative pt-[100%] rounded-lg overflow-hidden shadow-lg mb-6">
          <img src={currentTrack.cover} alt={currentTrack.title} className="absolute top-0 left-0 w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        <div className="text-center">
          <h3 className="text-2xl font-fantasy text-white">{currentTrack.title}</h3>
          <p className="text-violet-300 mt-1">{currentTrack.artist}</p>
        </div>

        <div className="mt-6">
          <div className="w-full bg-slate-700 rounded-full h-2 cursor-pointer" onClick={handleProgressClick}>
            <div className="bg-violet-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-6 mt-6">
          <button onClick={prevTrack} className="text-gray-400 hover:text-white transition-colors"><PrevIcon className="w-8 h-8"/></button>
          <button onClick={togglePlayPause} className="w-16 h-16 flex items-center justify-center bg-violet-600 hover:bg-violet-500 rounded-full text-white shadow-lg shadow-violet-500/30 transition-all duration-300 transform hover:scale-105">
            {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
          </button>
          <button onClick={nextTrack} className="text-gray-400 hover:text-white transition-colors"><NextIcon className="w-8 h-8"/></button>
        </div>
        <audio ref={audioRef} src={currentTrack.url} preload="auto" />
      </div>
    </div>
  );
};
