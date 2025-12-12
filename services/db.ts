import { User, MarketItem, Subject, DaySchedule } from '../types';
import { INITIAL_SUBJECTS, DUMMY_TIMETABLE, INITIAL_MARKET_ITEMS } from '../constants';
import { auth, dbInstance } from './firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc,
  query
} from "firebase/firestore";

export const db = {
  // --- Auth Methods ---
  
  register: async (email: string, password: string, username: string, department: string): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: username });

      const newUser: User = {
        uid: user.uid,
        username: username,
        email: email,
        department: department,
        isLoggedIn: true
      };

      // Create User Document in Firestore with default data
      // We wrap this in a try-catch so registration succeeds even if DB write fails momentarily
      try {
        await setDoc(doc(dbInstance, "users", user.uid), {
            username,
            email,
            department,
            subjects: INITIAL_SUBJECTS,
            timetable: DUMMY_TIMETABLE
        });
      } catch (dbError) {
          console.warn("Offline: Could not create user profile in DB", dbError);
      }

      return newUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  login: async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      let userData: any = {};
      try {
        // Fetch extra details from Firestore
        const userDoc = await getDoc(doc(dbInstance, "users", user.uid));
        if (userDoc.exists()) {
            userData = userDoc.data();
        }
      } catch (dbError) {
          console.warn("Offline: Could not fetch user profile from DB");
      }

      return {
        uid: user.uid,
        username: user.displayName || userData.username || 'Student',
        email: user.email!,
        department: userData.department || 'General',
        isLoggedIn: true
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  logout: async () => {
    await signOut(auth);
  },

  // --- Market Methods (Global Collection) ---

  getMarketItems: async (): Promise<MarketItem[]> => {
    try {
        const q = query(collection(dbInstance, "market"));
        const querySnapshot = await getDocs(q);
        const items: MarketItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as MarketItem);
        });
        
        return items;
    } catch (e) {
        console.warn("Error fetching market items (Offline Mode):", e);
        // Return dummy items if DB fails so the UI isn't empty
        return INITIAL_MARKET_ITEMS; 
    }
  },

  addMarketItem: async (item: Omit<MarketItem, 'id'>): Promise<MarketItem> => {
    const docRef = await addDoc(collection(dbInstance, "market"), item);
    return { id: docRef.id, ...item };
  },

  deleteMarketItem: async (itemId: string, userId: string): Promise<void> => {
    if (!itemId || !userId) throw new Error("Invalid parameters for deletion.");

    const itemRef = doc(dbInstance, "market", itemId);
    const itemSnap = await getDoc(itemRef);
    
    if (itemSnap.exists()) {
      const data = itemSnap.data();
      // Strict ownership check
      if (data.sellerId !== userId) {
        throw new Error("ACCESS_DENIED: You do not own this artifact.");
      }
      await deleteDoc(itemRef);
    } else {
        throw new Error("ITEM_NOT_FOUND: The artifact has already been purged.");
    }
  },

  // --- Subject/Attendance Methods (User Collection) ---

  getSubjects: async (userId: string): Promise<Subject[]> => {
    if (!userId) return INITIAL_SUBJECTS;
    try {
        const userDoc = await getDoc(doc(dbInstance, "users", userId));
        if (userDoc.exists()) {
            const data = userDoc.data();
            return data.subjects || INITIAL_SUBJECTS;
        }
    } catch (e) {
        console.warn("Offline: Returning default subjects");
    }
    return INITIAL_SUBJECTS;
  },

  saveSubjects: async (userId: string, subjects: Subject[]) => {
    const userRef = doc(dbInstance, "users", userId);
    await updateDoc(userRef, { subjects });
  },

  // --- Timetable Methods (User Collection) ---

  getTimetable: async (userId: string): Promise<DaySchedule[]> => {
    if (!userId) return DUMMY_TIMETABLE;
    try {
        const userDoc = await getDoc(doc(dbInstance, "users", userId));
        if (userDoc.exists()) {
            const data = userDoc.data();
            return data.timetable || DUMMY_TIMETABLE;
        }
    } catch (e) {
        console.warn("Offline: Returning default timetable");
    }
    return DUMMY_TIMETABLE;
  },

  saveTimetable: async (userId: string, schedule: DaySchedule[]) => {
    const userRef = doc(dbInstance, "users", userId);
    await updateDoc(userRef, { timetable: schedule });
  },

  syncSubjectsFromTimetable: async (userId: string, schedule: DaySchedule[]) => {
    try {
        const currentSubjects = await db.getSubjects(userId);
        const newSubjectNames = new Set<string>();

        schedule.forEach(day => {
            day.slots.forEach(slot => {
                if (['Lecture', 'Lab'].includes(slot.type) && slot.subject && slot.subject !== 'Free' && slot.subject !== 'Lunch') {
                    newSubjectNames.add(slot.subject);
                }
            });
        });

        if (newSubjectNames.size === 0) return;

        // Merge logic: Don't duplicate if name is similar
        const mergedSubjects: Subject[] = [...currentSubjects];
        
        newSubjectNames.forEach(newName => {
            const exists = mergedSubjects.some(s => s.name.toLowerCase().includes(newName.toLowerCase()) || newName.toLowerCase().includes(s.name.toLowerCase()));
            if (!exists) {
                mergedSubjects.push({
                    id: `auto_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                    name: newName,
                    attended: 0,
                    total: 0
                });
            }
        });

        await db.saveSubjects(userId, mergedSubjects);
    } catch (e) {
        console.warn("Offline: Could not sync subjects from timetable");
    }
  }
};