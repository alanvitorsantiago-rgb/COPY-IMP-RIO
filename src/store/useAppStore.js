import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../utils/supabase';

const useAppStore = create(
  persist(
    (set, get) => ({
      user: null,
      history: [],
      library: [],
      usage: {}, // { date: count }
      
      // Actions
      setUser: (user) => set({ user }),
      
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null });
      },
      
      addHistory: (item) => set((state) => ({
        history: [item, ...state.history].slice(0, 50)
      })),
      
      addToLibrary: (item) => set((state) => ({
        library: [item, ...state.library]
      })),
      
      removeFromLibrary: (id) => set((state) => ({
        library: state.library.filter(i => i.id !== id)
      })),
      
      incUsage: (userId) => {
        const today = new Date().toLocaleDateString('pt-BR');
        const usage = { ...get().usage };
        usage[today] = (usage[today] || 0) + 1;
        set({ usage });
      },
      
      getTodayUsage: () => {
        const today = new Date().toLocaleDateString('pt-BR');
        return get().usage[today] || 0;
      },

      updateUserPlan: (plan) => set((state) => ({
        user: state.user ? { ...state.user, plan } : null
      }))
    }),
    {
      name: 'imperio-copy-storage',
    }
  )
);

export default useAppStore;
