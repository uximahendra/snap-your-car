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
    id: 'dark-gray-studio',
    name: 'Dark Gray Studio',
    thumbnail: '/showroom-backgrounds/dark-gray-studio.jpg',
    backgroundImage: '/showroom-backgrounds/dark-gray-studio.jpg',
    category: 'studio'
  },
  {
    id: 'light-gray-studio',
    name: 'Light Gray Studio',
    thumbnail: '/showroom-backgrounds/light-gray-studio.jpg',
    backgroundImage: '/showroom-backgrounds/light-gray-studio.jpg',
    category: 'studio'
  },
  {
    id: 'beige-studio',
    name: 'Beige Studio',
    thumbnail: '/showroom-backgrounds/beige-studio.jpg',
    backgroundImage: '/showroom-backgrounds/beige-studio.jpg',
    category: 'studio'
  },
  {
    id: 'white-column-studio',
    name: 'White Column Studio',
    thumbnail: '/showroom-backgrounds/white-column-studio.jpg',
    backgroundImage: '/showroom-backgrounds/white-column-studio.jpg',
    category: 'studio'
  },
  {
    id: 'dark-panel-studio',
    name: 'Dark Panel Studio',
    thumbnail: '/showroom-backgrounds/dark-panel-studio.jpg',
    backgroundImage: '/showroom-backgrounds/dark-panel-studio.jpg',
    category: 'studio'
  }
];
