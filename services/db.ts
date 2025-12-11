import { User, MarketItem, Subject, DaySchedule } from '../types';
import { INITIAL_MARKET_ITEMS, INITIAL_SUBJECTS, DUMMY_TIMETABLE } from '../constants';

const DB_KEYS = {
  USERS: 'fresher_users_db',
  ITEMS: 'fresher_market_items_db',
  SUBJECTS: 'fresher_subjects_db',
  TIMETABLE: 'fresher_timetable_db',
  SESSION: 'fresher_user_session'
};

export const db = {
  init: () => {
    // Seed Market Items if empty
    if (!localStorage.getItem(DB_KEYS.ITEMS)) {
      localStorage.setItem(DB_KEYS.ITEMS, JSON.stringify(INITIAL_MARKET_ITEMS));
    }
    // Seed Users if empty
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify([]));
    }
    // Seed Subjects if empty
    if (!localStorage.getItem(DB_KEYS.SUBJECTS)) {
      localStorage.setItem(DB_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
    }
    // Seed Timetable if empty
    if (!localStorage.getItem(DB_KEYS.TIMETABLE)) {
      localStorage.setItem(DB_KEYS.TIMETABLE, JSON.stringify(DUMMY_TIMETABLE));
    }
  },

  // --- Auth Methods ---
  
  login: (username: string): User | null => {
    const users: User[] = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    // Case-insensitive match
    const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    
    if (user) {
      const sessionUser = { ...user, isLoggedIn: true };
      localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(sessionUser));
      return sessionUser;
    }
    return null;
  },

  register: (username: string, department?: string): User => {
    const users: User[] = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    const cleanUsername = username.trim();
    
    if (users.find(u => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
      throw new Error('USER_ID_CONFLICT: Identity already claimed.');
    }

    const newUser: User = { 
        username: cleanUsername, 
        department: department || 'General', 
        isLoggedIn: true 
    };
    
    users.push(newUser);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(DB_KEYS.SESSION);
  },

  getSession: (): User | null => {
    const session = localStorage.getItem(DB_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  },

  // --- Market Methods ---

  getMarketItems: (): MarketItem[] => {
    return JSON.parse(localStorage.getItem(DB_KEYS.ITEMS) || '[]');
  },

  addMarketItem: (item: MarketItem): MarketItem[] => {
    const items = db.getMarketItems();
    const newItems = [item, ...items];
    localStorage.setItem(DB_KEYS.ITEMS, JSON.stringify(newItems));
    return newItems;
  },

  deleteMarketItem: (itemId: string, username: string): MarketItem[] => {
    const items = db.getMarketItems();
    const itemIndex = items.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) throw new Error('ITEM_NOT_FOUND');
    
    // Authorization check
    if (items[itemIndex].seller !== username) {
        throw new Error('ACCESS_DENIED: You do not own this artifact.');
    }

    const newItems = items.filter(i => i.id !== itemId);
    localStorage.setItem(DB_KEYS.ITEMS, JSON.stringify(newItems));
    return newItems;
  },

  // --- Subject/Attendance Methods ---

  getSubjects: (): Subject[] => {
    return JSON.parse(localStorage.getItem(DB_KEYS.SUBJECTS) || '[]');
  },

  saveSubjects: (subjects: Subject[]) => {
    localStorage.setItem(DB_KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  // --- Timetable Methods ---

  getTimetable: (): DaySchedule[] => {
    return JSON.parse(localStorage.getItem(DB_KEYS.TIMETABLE) || '[]');
  },

  saveTimetable: (schedule: DaySchedule[]) => {
    localStorage.setItem(DB_KEYS.TIMETABLE, JSON.stringify(schedule));
  },

  /**
   * Scans the provided timetable for unique subjects and updates the 
   * attendance subject list. Preserves existing attendance counts if 
   * subject name matches.
   */
  syncSubjectsFromTimetable: (schedule: DaySchedule[]) => {
    const currentSubjects = db.getSubjects();
    const newSubjectNames = new Set<string>();

    schedule.forEach(day => {
        day.slots.forEach(slot => {
            // Filter out breaks/lunch/free
            if (['Lecture', 'Lab'].includes(slot.type) && slot.subject) {
                newSubjectNames.add(slot.subject);
            }
        });
    });

    if (newSubjectNames.size === 0) return; // Don't wipe if empty or invalid parse

    const mergedSubjects: Subject[] = Array.from(newSubjectNames).map((name, idx) => {
        // Try to find existing subject (case insensitive for better UX)
        const existing = currentSubjects.find(s => s.name.toLowerCase() === name.toLowerCase());
        if (existing) {
             return existing;
        }
        return {
            id: `auto_${Date.now()}_${idx}`,
            name: name,
            attended: 0,
            total: 0
        };
    });

    localStorage.setItem(DB_KEYS.SUBJECTS, JSON.stringify(mergedSubjects));
  }
};