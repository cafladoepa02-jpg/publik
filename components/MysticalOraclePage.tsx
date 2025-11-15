
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { connectToOracle } from '../services/gemini';
// FIX: Replaced deprecated LiveSession with StartLiveSessionResponse.
import type { StartLiveSessionResponse, Blob, LiveServerMessage } from '@google/genai';
import { Modality } from '@google/genai';
import LoadingSpinner from './common/LoadingSpinner';

// Helper functions for audio encoding/decoding, must be implemented manually per guidelines
const decode = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const encode = (bytes: Uint8Array): string => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


type OracleState = 'IDLE' | 'CONNECTING' | 'LISTENING' | 'SPEAKING' | 'ERROR';

export const MysticalOraclePage: React.FC = () => {
    const [oracleState, setOracleState] = useState<OracleState>('IDLE');
    const [transcriptions, setTranscriptions] = useState<{user: string, oracle: string}[]>([]);
    const [error, setError] = useState<string | null>(null);

    // FIX: Replaced deprecated LiveSession with StartLiveSessionResponse.
    const sessionPromiseRef = useRef<Promise<StartLiveSessionResponse> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const playingSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const currentInputTranscription = useRef('');
    const currentOutputTranscription = useRef('');

    const stopSession = useCallback(() => {
        if(sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }

        if(outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            playingSourcesRef.current.forEach(source => source.stop());
            playingSourcesRef.current.clear();
            outputAudioContextRef.current.close();
            outputAudioContextRef.current = null;
        }
        
        setOracleState('IDLE');
    }, []);

    useEffect(() => {
        return () => {
            stopSession();
        };
    }, [stopSession]);
    
    const startSession = async () => {
        setError(null);
        setTranscriptions([]);
        setOracleState('CONNECTING');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = inputAudioContext;
            
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;
            
            sessionPromiseRef.current = connectToOracle(
                {
                    onopen: () => {
                        setOracleState('LISTENING');
                        const source = inputAudioContext.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            if(sessionPromiseRef.current){
                                sessionPromiseRef.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle transcription
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscription.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscription.current += message.serverContent.outputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            const fullInput = currentInputTranscription.current.trim();
                            const fullOutput = currentOutputTranscription.current.trim();
                            if(fullInput || fullOutput) {
                                setTranscriptions(prev => [...prev, {user: fullInput, oracle: fullOutput}]);
                            }
                            currentInputTranscription.current = '';
                            currentOutputTranscription.current = '';
                        }

                        // Handle audio playback
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            setOracleState('SPEAKING');
                            const outCtx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
                            
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
                            
                            const source = outCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outCtx.destination);
                            
                            source.onended = () => {
                                playingSourcesRef.current.delete(source);
                                if (playingSourcesRef.current.size === 0) {
                                    setOracleState('LISTENING');
                                }
                            };

                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            playingSourcesRef.current.add(source);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Oracle error:', e);
                        setError('An error occurred with the Oracle connection.');
                        setOracleState('ERROR');
                        stopSession();
                    },
                    onclose: () => {
                        stopSession();
                    },
                },
                {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
                }
            );

        } catch (err) {
            console.error(err);
            setError('Failed to get microphone permissions. Please allow access and try again.');
            setOracleState('ERROR');
        }
    };
    

  const stateInfo = {
    IDLE: { text: "The Oracle is silent.", color: "text-gray-400" },
    CONNECTING: { text: "Opening channel to the Oracle...", color: "text-yellow-400" },
    LISTENING: { text: "The Oracle is listening...", color: "text-blue-400" },
    SPEAKING: { text: "The Oracle speaks...", color: "text-violet-400" },
    ERROR: { text: "The connection has faded.", color: "text-red-400" },
  };

  return (
    <div>
      <h2 className="text-4xl font-bold font-fantasy text-white mb-4 text-center">Mystic Oracle</h2>
      <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">Speak, and the ether shall answer. This channel is a direct conduit to a timeless intelligence. Ask your questions aloud.</p>

      <div className="max-w-3xl mx-auto bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl shadow-fuchsia-500/20 border border-slate-700 p-6">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className={`text-lg font-semibold ${stateInfo[oracleState].color}`}>
            {oracleState === 'CONNECTING' ? <LoadingSpinner text={stateInfo[oracleState].text} /> : stateInfo[oracleState].text}
          </div>
          
          {error && <p className="text-red-400 text-center">{error}</p>}
          
          {oracleState === 'IDLE' || oracleState === 'ERROR' ? (
            <button onClick={startSession} className="px-8 py-3 bg-violet-600 text-white font-bold rounded-full shadow-lg shadow-violet-500/30 hover:bg-violet-500 transition-all duration-300 transform hover:scale-105">
              Open a Channel
            </button>
          ) : (
            <button onClick={stopSession} className="px-8 py-3 bg-red-600 text-white font-bold rounded-full shadow-lg shadow-red-500/30 hover:bg-red-500 transition-all duration-300 transform hover:scale-105">
              Close Channel
            </button>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700 space-y-4 max-h-96 overflow-y-auto pr-2">
            {transcriptions.map((t, index) => (
                <div key={index} className="space-y-2">
                    {t.user && <div className="text-right"><span className="inline-block bg-blue-900/50 text-blue-200 rounded-lg px-4 py-2">{t.user}</span></div>}
                    {t.oracle && <div><span className="inline-block bg-violet-900/50 text-violet-200 rounded-lg px-4 py-2">{t.oracle}</span></div>}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
