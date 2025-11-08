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
    id: 'modern-studio-1',
    name: 'Modern Studio',
    thumbnail: '/showroom-backgrounds/modern-studio-1.jpg',
    backgroundImage: '/showroom-backgrounds/modern-studio-1.jpg',
    category: 'studio'
  },
  {
    id: 'modern-studio-2',
    name: 'Industrial Studio',
    thumbnail: '/showroom-backgrounds/modern-studio-2.jpg',
    backgroundImage: '/showroom-backgrounds/modern-studio-2.jpg',
    category: 'studio'
  },
  {
    id: 'luxury-showroom',
    name: 'Luxury Showroom',
    thumbnail: '/showroom-backgrounds/luxury-showroom.jpg',
    backgroundImage: '/showroom-backgrounds/luxury-showroom.jpg',
    category: 'studio'
  },
  {
    id: 'urban-street',
    name: 'Urban Street',
    thumbnail: '/showroom-backgrounds/urban-street.jpg',
    backgroundImage: '/showroom-backgrounds/urban-street.jpg',
    category: 'urban'
  },
  {
    id: 'nature-scene',
    name: 'Nature Scene',
    thumbnail: '/showroom-backgrounds/nature-scene.jpg',
    backgroundImage: '/showroom-backgrounds/nature-scene.jpg',
    category: 'nature'
  },
  {
    id: 'night-city',
    name: 'Night City',
    thumbnail: '/showroom-backgrounds/night-city.jpg',
    backgroundImage: '/showroom-backgrounds/night-city.jpg',
    category: 'urban'
  },
  {
    id: 'race-track',
    name: 'Race Track',
    thumbnail: '/showroom-backgrounds/race-track.jpg',
    backgroundImage: '/showroom-backgrounds/race-track.jpg',
    category: 'track'
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    thumbnail: '/showroom-backgrounds/minimal-white.jpg',
    backgroundImage: '/showroom-backgrounds/minimal-white.jpg',
    category: 'studio'
  }
];
