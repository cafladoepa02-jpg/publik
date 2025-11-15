
import React, { useState } from 'react';
import type { Writing } from '../types';

const mockWritings: Writing[] = [
  {
    id: '1',
    title: 'The Whispering Glade',
    category: 'Story',
    date: '2 moons ago',
    excerpt: 'In the heart of the Eldwood, where sunlight dapples through ancient leaves, lies a glade that hums with forgotten magic...',
    content: 'Full story content here.'
  },
  {
    id: '2',
    title: 'Stardate 2.3.4: Anomaly Encounter',
    category: 'Journal',
    date: '3 cycles past',
    excerpt: 'The ship\'s long-range sensors picked up a gravitational anomaly unlike any we\'ve cataloged. Captain\'s orders are to approach with caution.',
    content: 'Full journal entry here.'
  },
    {
    id: '3',
    title: 'Recipe for a Sunstone Potion',
    category: 'Journal',
    date: '5 days ago',
    excerpt: 'One must first acquire a morning dewdrop from a Lumina flower, three powdered moon-moth wings, and a sliver of sunstone...',
    content: 'Full recipe here.'
  },
    {
    id: '4',
    title: 'The Clockwork City\'s Secret',
    category: 'Story',
    date: '1 year ago',
    excerpt: 'Beneath the brass and steam of Cogsworth, a deeper secret ticked away, powered not by gears, but by a captured star.',
    content: 'Full story content here.'
  },
];


const WritingCard: React.FC<{ writing: Writing, onSelect: (writing: Writing) => void }> = ({ writing, onSelect }) => (
    <div 
        className="bg-slate-800/50 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl hover:shadow-fuchsia-500/20 p-6 border border-slate-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        onClick={() => onSelect(writing)}
    >
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold font-fantasy text-white">{writing.title}</h3>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${writing.category === 'Story' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-amber-500/20 text-amber-300'}`}>
                {writing.category}
            </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{writing.date}</p>
        <p className="mt-4 text-gray-400">{writing.excerpt}</p>
    </div>
);

const WritingDetailModal: React.FC<{ writing: Writing, onClose: () => void }> = ({ writing, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl shadow-violet-500/30" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-fantasy text-white">{writing.title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                    <span className={`px-2 py-1 rounded-full text-xs ${writing.category === 'Story' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {writing.category}
                    </span>
                    <span>{writing.date}</span>
                </div>
                <div className="prose prose-invert prose-lg text-gray-300 max-w-none">
                    <p>{writing.excerpt}</p>
                    <p>{writing.content}</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>
        </div>
    );
};


export const WritingsPage: React.FC = () => {
    const [selectedWriting, setSelectedWriting] = useState<Writing | null>(null);

    return (
        <div>
            <h2 className="text-4xl font-bold font-fantasy text-white mb-8 text-center">Library of Sagas & Scrolls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockWritings.map(writing => (
                    <WritingCard key={writing.id} writing={writing} onSelect={setSelectedWriting} />
                ))}
            </div>
            {selectedWriting && <WritingDetailModal writing={selectedWriting} onClose={() => setSelectedWriting(null)} />}
        </div>
    );
};
