import { create } from 'zustand';

const useUIStore = create((set) => ({
  toast: { show: false, message: '', type: 'success' },
  
  showToast: (message, type = 'success') => {
    set({ toast: { show: true, message, type } });
    setTimeout(() => {
      set((state) => ({ toast: { ...state.toast, show: false } }));
    }, 3000);
  },

  hideToast: () => set((state) => ({ toast: { ...state.toast, show: false } })),
  
  modal: null, // { type, props }
  openModal: (type, props = {}) => set({ modal: { type, props } }),
  closeModal: () => set({ modal: null }),
}));

export default useUIStore;
