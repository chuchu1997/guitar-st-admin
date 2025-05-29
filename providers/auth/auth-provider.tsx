import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User } from '@prisma/client';


// Define the store interface
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string, 
    password: string, 
    name?: string, 
    role?: 'USER' | 'ADMIN' | 'MANAGER'
  ) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

// Create the Zustand store with persist middleware
const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      // Login method
      login: async (name: string, password: string) => {
        set({ loading: true });
        try {
          const response = await axios.post('/api/auth/login', 
            { name, password },
            { headers: { 'Content-Type': 'application/json' } }
          );

          if (response.status === 200) {
            set({ 
              user: response.data.user, 
              isAuthenticated: true,
              loading: false 
            });

            toast.success('Login successful');
           
          } else {
            set({ loading: false });
            toast.error(response.data.message || 'Login failed');
          }
        } catch (error) {
          set({ loading: false });
          console.error('Login error', error);
          toast.error('An error occurred during login');
        }
        // finally{
        //   redirect('/')
        // }
      },

      // Logout method
      logout: async () => {
        set({ loading: true });
        try {
          const response = await axios.post('/api/auth/logout');

          if (response.status === 200) {
            set({ 
              user: null, 
              isAuthenticated: false,
              loading: false 
            });
            toast.success('Logged out successfully');
            // Optional: redirect to login page
            window.location.href = '/login';
          } else {
            set({ loading: false });
            toast.error('Logout failed');
          }
        } catch (error) {
          set({ loading: false });
          console.error('Logout error', error);
          toast.error('An error occurred during logout');
        }
      },

      // Register method
      register: async (
        email: string, 
        password: string, 
        name?: string, 
        role: 'USER' | 'ADMIN' | 'MANAGER' = 'USER'
      ) => {
        set({ loading: true });
        try {
          const response = await axios.post('/api/auth/register', 
            { email, password, name, role }
          );

          if (response.status === 200) {
            set({ 
              user: response.data.user, 
              isAuthenticated: true,
              loading: false 
            });
            toast.success('Registration successful');
            // Optional: redirect to home page
            window.location.href = '/';
          } else {
            set({ loading: false });
            toast.error(response.data.message || 'Registration failed');
          }
        } catch (error) {
          set({ loading: false });
          console.error('Registration error', error);
          toast.error('An error occurred during registration');
        }
      },

      // Check authentication status
      checkAuthStatus: async () => {
        set({ loading: true });
        try {
          const response = await axios.get('/api/auth/verify');
          
          if (response.status === 200) {
            set({ 
              user: response.data.user, 
              isAuthenticated: true,
              loading: false 
            });
          } else {
            set({ 
              user: null, 
              isAuthenticated: false,
              loading: false 
            });
          }
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false,
            loading: false 
          });
        }
      }
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;