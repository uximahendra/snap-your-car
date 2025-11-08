export const mockUser = {
  id: "demo_user",
  name: "Marco Demo",
  email: "demo@snapyourcar.app",
  subscription: "lifetime",
  locale: "en-EU"
};

export type ImageStatus = "processed" | "queued" | "processing" | "failed";

export interface CarImage {
  id: string;
  angle: string;
  status: ImageStatus;
  before: string;
  after: string;
  background?: string;
  maskConfidence?: number;
  backgroundRemoved?: string;        // Transparent PNG after removal
  showroomId?: string;               // Selected showroom background ID
  showroomBackground?: string;       // Showroom background URL
}

export interface CarSession {
  id: string;
  title: string;
  date: string;
  images: CarImage[];
  mode: "exterior" | "interior";
  backgroundsRemoved?: boolean;      // Track if backgrounds removed
  showroomApplied?: boolean;         // Track if showrooms applied
}

// All car angles combined (exterior + interior)
export const allAngles = [
  { id: "front", label: "Front", icon: "circle", previewImage: "/car-angles/front.svg" },
  { id: "front-left", label: "Front Left", icon: "circle", previewImage: "/car-angles/front-left.svg" },
  { id: "left", label: "Left", icon: "circle", previewImage: "/car-angles/left.svg" },
  { id: "rear-left", label: "Rear Left", icon: "circle", previewImage: "/car-angles/rear-left.svg" },
  { id: "rear", label: "Rear", icon: "circle", previewImage: "/car-angles/rear.svg" },
  { id: "rear-right", label: "Rear Right", icon: "circle", previewImage: "/car-angles/rear-right.svg" },
  { id: "right", label: "Right", icon: "circle", previewImage: "/car-angles/right.svg" },
  { id: "front-right", label: "Front Right", icon: "circle", previewImage: "/car-angles/front-right.svg" },
];

export const backgrounds = [
  { id: "studio-white", label: "Studio White", thumbnail: "bg-white" },
  { id: "outdoor-natural", label: "Outdoor Natural", thumbnail: "bg-gradient-to-b from-blue-100 to-green-50" },
  { id: "luxury-showroom", label: "Luxury Showroom", thumbnail: "bg-gradient-to-b from-gray-900 to-gray-700" },
  { id: "premium-night", label: "Premium Night", thumbnail: "bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800" },
];

export const mockSessions: CarSession[] = [
  {
    id: "s_mercedes_eqa_demo",
    title: "Mercedes EQA Electric",
    date: "2025-11-05",
    mode: "exterior",
    backgroundsRemoved: true,
    showroomApplied: true,
    images: [
      {
        id: "eqa_front",
        angle: "Front",
        status: "processed",
        before: "/demo-sessions/eqa-session/front.jpg",
        after: "/demo-sessions/eqa-session/front.jpg",
        backgroundRemoved: "/demo-sessions/eqa-session/front.jpg",
        showroomId: "white-column-studio",
        showroomBackground: "/showroom-backgrounds/white-column-studio.jpg",
        maskConfidence: 98
      },
      {
        id: "eqa_front_left",
        angle: "Front Left",
        status: "processed",
        before: "/demo-sessions/eqa-session/front-left.jpg",
        after: "/demo-sessions/eqa-session/front-left.jpg",
        backgroundRemoved: "/demo-sessions/eqa-session/front-left.jpg",
        showroomId: "white-column-studio",
        showroomBackground: "/showroom-backgrounds/white-column-studio.jpg",
        maskConfidence: 97
      },
      {
        id: "eqa_left",
        angle: "Left",
        status: "processed",
        before: "/demo-sessions/eqa-session/left.jpg",
        after: "/demo-sessions/eqa-session/left.jpg",
        backgroundRemoved: "/demo-sessions/eqa-session/left.jpg",
        showroomId: "white-column-studio",
        showroomBackground: "/showroom-backgrounds/white-column-studio.jpg",
        maskConfidence: 96
      },
      {
        id: "eqa_rear_left",
        angle: "Rear Left",
        status: "processed",
        before: "/demo-sessions/eqa-session/rear-left.jpg",
        after: "/demo-sessions/eqa-session/rear-left.jpg",
        backgroundRemoved: "/demo-sessions/eqa-session/rear-left.jpg",
        showroomId: "white-column-studio",
        showroomBackground: "/showroom-backgrounds/white-column-studio.jpg",
        maskConfidence: 97
      },
      {
        id: "eqa_rear",
        angle: "Rear",
        status: "processed",
        before: "/demo-sessions/eqa-session/rear.jpg",
        after: "/demo-sessions/eqa-session/rear.jpg",
        backgroundRemoved: "/demo-sessions/eqa-session/rear.jpg",
        showroomId: "white-column-studio",
        showroomBackground: "/showroom-backgrounds/white-column-studio.jpg",
        maskConfidence: 98
      },
      {
        id: "eqa_rear_right",
        angle: "Rear Right",
        status: "processed",
        before: "/demo-sessions/eqa-session/rear-right.jpg",
        after: "/demo-sessions/eqa-session/rear-right.jpg",
        backgroundRemoved: "/demo-sessions/eqa-session/rear-right.jpg",
        showroomId: "white-column-studio",
        showroomBackground: "/showroom-backgrounds/white-column-studio.jpg",
        maskConfidence: 97
      },
      {
        id: "eqa_right",
        angle: "Right",
        status: "processed",
        before: "/demo-sessions/eqa-session/right.jpg",
        after: "/demo-sessions/eqa-session/right.jpg",
        backgroundRemoved: "/demo-sessions/eqa-session/right.jpg",
        showroomId: "white-column-studio",
        showroomBackground: "/showroom-backgrounds/white-column-studio.jpg",
        maskConfidence: 96
      },
      {
        id: "eqa_front_right",
        angle: "Front Right",
        status: "processed",
        before: "/demo-sessions/eqa-session/front-right.jpg",
        after: "/demo-sessions/eqa-session/front-right.jpg",
        backgroundRemoved: "/demo-sessions/eqa-session/front-right.jpg",
        showroomId: "white-column-studio",
        showroomBackground: "/showroom-backgrounds/white-column-studio.jpg",
        maskConfidence: 98
      }
    ]
  },
  {
    id: "s_bmw_8",
    title: "BMW 8 Series",
    date: "2025-10-15",
    mode: "exterior",
    images: [
      {
        id: "img1",
        angle: "Front",
        status: "processed",
        before: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
        after: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&sat=1.2&con=1.1",
        background: "studio-white",
        maskConfidence: 98
      },
      {
        id: "img2",
        angle: "3/4 Front Left",
        status: "processed",
        before: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop",
        after: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop&sat=1.2&con=1.1",
        background: "studio-white",
        maskConfidence: 96
      },
    ]
  },
  {
    id: "s_audi_rs",
    title: "Audi RS6",
    date: "2025-10-10",
    mode: "exterior",
    images: [
      {
        id: "img3",
        angle: "Front",
        status: "processed",
        before: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&h=600&fit=crop",
        after: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&h=600&fit=crop&sat=1.2&con=1.1",
        background: "luxury-showroom",
        maskConfidence: 97
      },
    ]
  },
  {
    id: "s_tesla_model",
    title: "Tesla Model S",
    date: "2025-10-05",
    mode: "exterior",
    images: [
      {
        id: "img4",
        angle: "Front",
        status: "queued",
        before: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop",
        after: "",
      },
    ]
  },
];

export const processingSteps = [
  { id: 1, label: "Uploading", duration: 1000 },
  { id: 2, label: "Segmentation", duration: 2000 },
  { id: 3, label: "Enhancement", duration: 4000 },
  { id: 4, label: "Compositing", duration: 2000 },
  { id: 5, label: "Finalizing", duration: 1000 },
];
