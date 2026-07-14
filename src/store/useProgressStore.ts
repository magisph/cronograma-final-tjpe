import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

export interface ProgressState {
  completedTasks: Record<string, Record<string, boolean>>; // { dayId: { taskId: boolean } }
  toggleTask: (dayId: string, taskId: string, completed: boolean) => void;
  setTasks: (tasks: Record<string, Record<string, boolean>>) => void;
  initializeFirebaseSync: () => void;
  syncError: string | null;
  userId: string | null;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => {
      let isInitializing = false;
      let unsubscribeSnapshot: (() => void) | null = null;

      return {
        completedTasks: {},
        syncError: null,
        userId: null,

        toggleTask: (dayId, taskId, completed) => {
          const state = get();
          const newTasks = {
            ...state.completedTasks,
            [dayId]: {
              ...(state.completedTasks[dayId] || {}),
              [taskId]: completed
            }
          };

          set({ completedTasks: newTasks });

          // If Firebase is configured and user is logged in, sync to Firestore
          const { userId } = get();
          if (isFirebaseConfigured && userId && db) {
            setDoc(doc(db, 'userProgress', userId), { completedTasks: newTasks }, { merge: true })
              .catch((error) => {
                console.error("Error syncing to Firestore:", error);
              });
          }
        },

        setTasks: (tasks) => {
          set({ completedTasks: tasks });
        },

        initializeFirebaseSync: () => {
          if (!isFirebaseConfigured || !auth || !db) return;
          if (isInitializing) return;
          isInitializing = true;

          onAuthStateChanged(auth, async (user: User | null) => {
            if (user) {
              set({ userId: user.uid });
              const docRef = doc(db, 'userProgress', user.uid);
              
              try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                  const data = docSnap.data();
                  if (data && data.completedTasks) {
                    const remoteTasks = data.completedTasks;
                    
                    const localTasks = get().completedTasks;
                    const merged: Record<string, Record<string, boolean>> = { ...localTasks };
                    
                    for (const dayId in remoteTasks) {
                      merged[dayId] = { ...(merged[dayId] || {}), ...remoteTasks[dayId] };
                    }
                    
                    set({ completedTasks: merged });
                    setDoc(docRef, { completedTasks: merged }, { merge: true }).catch(console.error);
                  }
                } else {
                  // doc doesn't exist, create it with local state
                  const localTasks = get().completedTasks;
                  await setDoc(docRef, { completedTasks: localTasks }, { merge: true });
                }

                // Listen for changes from other devices
                if (unsubscribeSnapshot) {
                  unsubscribeSnapshot();
                }
                unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
                  if (docSnap.exists()) {
                     const data = docSnap.data();
                     if (data && data.completedTasks) {
                        set({ completedTasks: data.completedTasks });
                     }
                  }
                });

              } catch (error: any) {
                console.error("Error accessing Firestore:", error);
                set({ syncError: error.message });
              }
            } else {
              set({ userId: null });
              if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
                unsubscribeSnapshot = null;
              }
              // Sign in anonymously
              signInAnonymously(auth).catch((error) => {
                console.error("Error signing in anonymously:", error);
                set({ syncError: error.message });
              });
            }
          });
        }
      };
    },
    {
      name: 'progress-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ completedTasks: state.completedTasks }), // only persist completedTasks
    }
  )
);
