// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { useSession } from 'next-auth/react';

// export const useUserStore = create(
//   persist((set) => ({
//     user: null,
//     loading: true,

//     checkUserSession: async () => {
//       set({ loading: true });
//       try {
//         const { data: session, status } = useSession();
//         if (status === "authenticated") {
//           set({ user: session.user });
//         } else {
//           set({ user: null });
//         }
//       } catch (error) {
//         console.error('Error checking user session:', error);
//         set({ user: null });
//       } finally {
//         set({ loading: false });
//       }
//     },
//   }))
// );