export interface ShowroomBackground {
  id: string;
  name: string;
  thumbnail: string;
  backgroundImage: string;
  category: 'studio' | 'urban' | 'nature' | 'track';
  isPremium?: boolean;
}

export const showroomBackgrounds: ShowroomBackground[] = [
  {
    id: 'modern-studio',
    name: 'Modern Studio',
    thumbnail: 'bg-gradient-to-b from-gray-100 to-white',
    backgroundImage: 'bg-gradient-to-b from-gray-100 to-white',
    category: 'studio'
  },
  {
    id: 'luxury-showroom',
    name: 'Luxury Showroom',
    thumbnail: 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900',
    backgroundImage: 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900',
    category: 'studio'
  },
  {
    id: 'urban-street',
    name: 'Urban Street',
    thumbnail: 'bg-gradient-to-b from-slate-700 via-slate-600 to-slate-500',
    backgroundImage: 'bg-gradient-to-b from-slate-700 via-slate-600 to-slate-500',
    category: 'urban'
  },
  {
    id: 'nature-scene',
    name: 'Nature Scene',
    thumbnail: 'bg-gradient-to-b from-emerald-200 via-green-300 to-emerald-400',
    backgroundImage: 'bg-gradient-to-b from-emerald-200 via-green-300 to-emerald-400',
    category: 'nature'
  },
  {
    id: 'night-city',
    name: 'Night City',
    thumbnail: 'bg-gradient-to-b from-indigo-950 via-blue-900 to-slate-900',
    backgroundImage: 'bg-gradient-to-b from-indigo-950 via-blue-900 to-slate-900',
    category: 'urban'
  },
  {
    id: 'race-track',
    name: 'Race Track',
    thumbnail: 'bg-gradient-to-b from-red-900 via-gray-800 to-gray-900',
    backgroundImage: 'bg-gradient-to-b from-red-900 via-gray-800 to-gray-900',
    category: 'track'
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    thumbnail: 'bg-white',
    backgroundImage: 'bg-white',
    category: 'studio'
  }
];
