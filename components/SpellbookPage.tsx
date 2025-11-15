
import React, { useState } from 'react';
import { editImage } from '../services/gemini';
import LoadingSpinner from './common/LoadingSpinner';
import { WandIcon } from './common/Icons';
import { Modality } from '@google/genai';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const SpellbookPage: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const popularPrompts = ["Add a retro filter", "Make it look like a watercolor painting", "Add a magical glowing aura", "Change the background to a fantasy forest", "Remove the person in the background"];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setOriginalImageFile(file);
            setOriginalImage(URL.createObjectURL(file));
            setGeneratedImage(null);
        }
    };

    const handleGenerate = async () => {
        if (!originalImageFile || !prompt) {
            setError("Please upload an image and write a spell.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const imageBase64 = await blobToBase64(originalImageFile);
            const response = await editImage(prompt, imageBase64, originalImageFile.type);
            
            const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
            if(imagePart && imagePart.inlineData) {
                 const generatedBase64 = imagePart.inlineData.data;
                 setGeneratedImage(`data:${imagePart.inlineData.mimeType};base64,${generatedBase64}`);
            } else {
                 setError("The spell yielded no visible effect. Try a different incantation.");
            }
        } catch (err) {
            console.error("Image generation failed:", err);
            setError("The spell failed. The magical energies might be unstable.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            <h2 className="text-4xl font-bold font-fantasy text-white mb-4 text-center">The Alchemist's Spellbook</h2>
            <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">Transmute the visual plane. Upload an image, inscribe your incantation, and witness the transformation.</p>

            <div className="max-w-5xl mx-auto bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl shadow-fuchsia-500/20 border border-slate-700 p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Area */}
                    <div className="flex flex-col space-y-6">
                        <div>
                            <label className="block text-lg font-fantasy text-violet-300 mb-2">1. Choose Your Canvas</label>
                            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <div className="flex text-sm text-gray-400"><label htmlFor="file-upload" className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-violet-400 hover:text-violet-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-violet-500 focus-within:ring-offset-slate-900"><span>Upload a file</span><input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} /></label><p className="pl-1">or drag and drop</p></div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="prompt" className="block text-lg font-fantasy text-violet-300 mb-2">2. Inscribe Your Spell</label>
                            <textarea
                                id="prompt"
                                rows={4}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., Add a dragon flying in the sky"
                                className="w-full bg-slate-900/50 border border-slate-600 rounded-md p-3 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                            />
                             <div className="flex flex-wrap gap-2 mt-2">
                                {popularPrompts.map(p => (
                                    <button key={p} onClick={() => setPrompt(p)} className="text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 px-2 py-1 rounded-md transition-colors">{p}</button>
                                ))}
                            </div>
                        </div>
                        
                        <button onClick={handleGenerate} disabled={isLoading || !originalImageFile || !prompt} className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-violet-600 hover:bg-violet-700 disabled:bg-slate-700 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-slate-900 transition-all duration-300">
                            <WandIcon className="w-6 h-6 mr-2" />
                            {isLoading ? 'Casting...' : 'Cast Spell'}
                        </button>
                         {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                    </div>

                    {/* Image Display */}
                    <div className="grid grid-cols-1 gap-4 items-center">
                        <div className="relative aspect-square bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700">
                            <p className="text-gray-500">Original Image</p>
                            {originalImage && <img src={originalImage} alt="Original" className="absolute inset-0 w-full h-full object-contain rounded-lg" />}
                        </div>
                        <div className="relative aspect-square bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700">
                            {isLoading ? <LoadingSpinner text="Conjuring vision..."/> : (
                                <>
                                 <p className="text-gray-500">Transformed Image</p>
                                 {generatedImage && <img src={generatedImage} alt="Generated" className="absolute inset-0 w-full h-full object-contain rounded-lg" />}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
