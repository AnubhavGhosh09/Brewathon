import { Club, DaySchedule, Subject, MarketItem } from './types';

export const COLLEGE_CONTEXT = `
A. College Secrets & Tips:
CANTEENS: Legendary status. Best items: Gobi Manchurian, Noodles, Fried Rice.
BUNKING: 85% attendance is officially required for exams.
LIBRARY: Open 8 AM - 8 PM. The only quiet place.
STRICT PROFS: Don't worry yet, just attend the first few classes.
HOSTELS: Mess food is a "miss". Explore local hangouts.
EVENTS: "HALCYON" is the annual fest. Do not miss it.
WIFI: Register in the CS department; ask the proctor.

B. Club List (Categorized):
Theatre: Aurora (Theatrical Group), Black Pearl (Dramatic Arts), Drushya (Visual Storytelling).
Dance: Team Panthers (High Energy), Team Valcons (Choreography).
Photography: Ad Lib Arts.
Technical: Decoders (Coding), SARK (Hardware), AI Brewery (ML), Soaring Eagles (Tech/Drones).
Robotics: Corsit (Embedded), Team Auto Architects (Automotive).
Management: TedX, Avalanche (E-Cell), Quest (Adventure), Pathfinders (Leadership).
Interest Groups: Quizzing, DebSoc (Debate).
`;

export const INITIAL_CLUBS: Club[] = [
  { id: '1', name: 'Aurora', category: 'Theatre', description: 'The flagship theatre club bringing stories to life.', members: 85, icon: '🎭', status: 'RECRUITING' },
  { id: '2', name: 'Black Pearl', category: 'Theatre', description: 'Dark, intense, dramatic performances.', members: 42, icon: '🖤', status: 'FULL' },
  { id: '3', name: 'Team Panthers', category: 'Dance', description: 'High-energy dance crew dominating every stage.', members: 65, icon: '🐆', status: 'RECRUITING' },
  { id: '4', name: 'Decoders', category: 'Technical', description: 'Competitive coding and hackathons.', members: 120, icon: '💻', status: 'RECRUITING' },
  { id: '5', name: 'Soaring Eagles', category: 'Technical', description: 'Building high-performance UAVs and drones.', members: 30, icon: '🦅', status: 'FULL' },
  { id: '6', name: 'Avalanche', category: 'Management', description: 'The Entrepreneurship Cell (E-Cell).', members: 55, icon: '📈', status: 'RECRUITING' },
  { id: '7', name: 'Ad Lib Arts', category: 'Photography', description: 'Capturing moments that tell stories.', members: 78, icon: '📸', status: 'FULL' },
  { id: '8', name: 'SARK', category: 'Technical', description: 'Hardware, IoT, and Student Amateur Radio Klub.', members: 45, icon: '📡', status: 'RECRUITING' },
  { id: '9', name: 'AI Brewery', category: 'Technical', description: 'Brewing intelligence. ML & AI research group.', members: 60, icon: '🧠', status: 'RECRUITING' },
  { id: '10', name: 'TEDx', category: 'Management', description: 'Organizing world-class talks and events.', members: 25, icon: '❌', status: 'FULL' },
  { id: '11', name: 'Quest', category: 'Management', description: 'Adventure club. Treks, nature, and survival.', members: 90, icon: '🏔️', status: 'RECRUITING' },
  { id: '12', name: 'CORSIT', category: 'Robotics', description: 'Robotics and Embedded Systems club.', members: 50, icon: '🤖', status: 'RECRUITING' },
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: '1', name: 'Engineering Math', attended: 20, total: 24 },
  { id: '2', name: 'Physics Cycle', attended: 12, total: 18 },
  { id: '3', name: 'Basic Electronics', attended: 8, total: 15 }, // Low attendance
  { id: '4', name: 'C Programming', attended: 22, total: 22 },
  { id: '5', name: 'English', attended: 5, total: 10 }, // Panic
];

export const DUMMY_TIMETABLE: DaySchedule[] = [
  {
    day: 'Monday',
    slots: [
      { time: '09:00', subject: 'Math', type: 'Lecture', room: 'LH-101' },
      { time: '10:00', subject: 'Physics', type: 'Lecture', room: 'LH-102' },
      { time: '11:00', subject: 'Free', type: 'Free' },
    ]
  },
  {
    day: 'Tuesday',
    slots: [
      { time: '09:00', subject: 'C Prog', type: 'Lab', room: 'LAB-2' },
      { time: '11:00', subject: 'Electronics', type: 'Lecture', room: 'LH-103' },
    ]
  },
    {
    day: 'Wednesday',
    slots: [
      { time: '09:00', subject: 'Math', type: 'Lecture', room: 'LH-101' },
      { time: '10:00', subject: 'Physics', type: 'Lecture', room: 'LH-102' },
    ]
  },
    {
    day: 'Thursday',
    slots: [
      { time: '09:00', subject: 'Math', type: 'Lecture', room: 'LH-101' },
      { time: '10:00', subject: 'Physics', type: 'Lecture', room: 'LH-102' },
    ]
  },
    {
    day: 'Friday',
    slots: [
      { time: '09:00', subject: 'Math', type: 'Lecture', room: 'LH-101' },
      { time: '10:00', subject: 'Physics', type: 'Lecture', room: 'LH-102' },
    ]
  },
  {
    day: 'Saturday',
    slots: [
      { time: '09:00', subject: 'Labs', type: 'Lab', room: 'LAB-1' },
      { time: '12:00', subject: 'Free', type: 'Free' },
    ]
  }
];

export const INITIAL_MARKET_ITEMS: MarketItem[] = [
  { 
    id: '1', 
    title: 'Drafter (Mini) - Barely Used', 
    price: '₹350', 
    seller: 'Mech_God_99', 
    type: 'SELL', 
    category: 'Stationery', 
    description: 'Passed Graphics with S grade using this. Lucky item.',
    isVerified: true,
    contact: 'Whatsapp: 9876543210'
  },
  { 
    id: '2', 
    title: 'Arduino Uno Kit + Sensors', 
    price: '₹800', 
    seller: 'Robo_Freak', 
    type: 'SELL', 
    category: 'Electronics', 
    description: 'Complete kit. Jumper wires included. Don\'t bargain.',
    isVerified: true,
    contact: 'Meet at Canteen A, 1pm'
  },
  { 
    id: '3', 
    title: 'M3 Textbook (Greta)', 
    price: 'Free', 
    seller: 'Backlog_King', 
    type: 'EXCHANGE', 
    category: 'Books', 
    description: 'Exchange for Canteen coupons. I gave up on Math.',
    isVerified: false,
    contact: 'Discord: math_hater#0001'
  },
  { 
    id: '4', 
    title: 'Scientific Calculator fx-991EX', 
    price: '₹600', 
    seller: 'Freshie_01', 
    type: 'BUY', 
    category: 'Electronics', 
    description: 'Need urgently for internals. Lost mine.',
    isVerified: true,
    contact: 'Call: 9988776655'
  },
];