import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { profileService } from './profileService';

/**
 * Authentication Service
 * Handles all authentication operations including email OTP and social auth
 */

export interface AuthResponse {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
  isNewUser?: boolean;
}

export interface SocialAuthResponse {
  success: boolean;
  user?: User;
  session?: Session;
  isNewUser?: boolean;
  error?: string;
}

/**
 * Initialize auth state and check for existing session
 */
export const authService = {
  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
    return session;
  },

  /**
   * Get current user
   */
  async getUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error.message);
      return null;
    }
    return user;
  },

  /**
   * Check if a user exists by email
   */
  async checkUserExists(email: string): Promise<import('../lib/types').Profile | null> {
    return await profileService.getProfileByEmail(email);
  },

  /**
   * Sign up / Sign in with email OTP
   * Supabase sends a 6-digit OTP to the user's email
   */
  async signUpWithOTP(email: string): Promise<AuthResponse> {
    try {
      // Check if user exists in our profiles table
      const existingProfile = await profileService.getProfileByEmail(email);
      const userExists = existingProfile !== null;

      if (userExists) {
        console.log('User already exists, proceeding to login flow');
      } else {
        console.log('New user, creating profile');
      }

      // Send OTP to email (this works for both new and existing users)
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
      });

      if (error) {
        console.error('Error sending OTP:', error.message);
        return {
          success: false,
          error: this.getAuthErrorMessage(error),
          isNewUser: !userExists,
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        isNewUser: !userExists,
      };
    } catch (error: any) {
      console.error('Unexpected error in signUpWithOTP:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
        isNewUser: false,
      };
    }
  },

  /**
   * Verify OTP and complete authentication
   */
  async verifyOTP(email: string, token: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) {
        console.error('Error verifying OTP:', error.message);
        return {
          success: false,
          error: this.getAuthErrorMessage(error),
        };
      }

      // Check if user exists in our profiles table
      const existingProfile = data.user
        ? await profileService.getProfileByEmail(data.user.email || '')
        : null;

      const isNewUser = existingProfile === null;

      // If new user, create profile in database
      if (isNewUser && data.user) {
        try {
          await profileService.createProfile({
            id: data.user.id, // Use auth user's ID to ensure consistency
            email: data.user.email || email,
            first_name: null,
            last_name: null,
            role: 'fan', // Default role
            onboarding_completed: false,
          });
          console.log('Created new profile for user:', data.user.email);
        } catch (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't fail auth if profile creation fails
          // User can complete profile later
        }
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        isNewUser,
      };
    } catch (error: any) {
      console.error('Unexpected error in verifyOTP:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  },

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<SocialAuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
          skipBrowserRedirect: true, // For Expo
        },
      });

      if (error) {
        console.error('Google auth error:', error.message);
        return {
          success: false,
          error: 'Failed to sign in with Google. Please try again.',
        };
      }

      // Check if user exists in profiles (after OAuth completes)
      // Note: For OAuth, we need to handle the redirect in a different way
      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error: any) {
      console.error('Unexpected error in signInWithGoogle:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  },

  /**
   * Sign in with Apple
   */
  async signInWithApple(): Promise<SocialAuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.error('Apple auth error:', error.message);
        return {
          success: false,
          error: 'Failed to sign in with Apple. Please try again.',
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error: any) {
      console.error('Unexpected error in signInWithApple:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  },

  /**
   * Sign in with Facebook
   */
  async signInWithFacebook(): Promise<SocialAuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
          skipBrowserRedirect: true,
          scopes: 'public_profile,email',
        },
      });

      if (error) {
        console.error('Facebook auth error:', error.message);
        return {
          success: false,
          error: 'Failed to sign in with Facebook. Please try again.',
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error: any) {
      console.error('Unexpected error in signInWithFacebook:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error.message);
        return {
          success: false,
          error: 'Failed to sign out. Please try again.',
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Unexpected error in signOut:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  },

  /**
   * Resend OTP to email
   */
  async resendOTP(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'email',
        email,
      });

      if (error) {
        console.error('Error resending OTP:', error.message);
        return {
          success: false,
          error: 'Failed to resend code. Please try again.',
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Unexpected error in resendOTP:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  },

  /**
   * Get user-friendly error message from Supabase auth error
   */
  getAuthErrorMessage(error: AuthError): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please try again.';
      case 'Email not confirmed':
        return 'Please verify your email before signing in.';
      case 'User already registered':
        return 'An account with this email already exists. Please sign in.';
      case 'Email rate limit exceeded':
        return 'Too many attempts. Please wait a moment and try again.';
      case 'Invalid OTP':
        return 'Invalid code. Please check and try again.';
      case 'OTP expired':
        return 'This code has expired. Please request a new one.';
      default:
        if (error.message.includes('For security purposes, you can only request this after')) {
          return 'Try again later';
        }
        return error.message || 'An error occurred. Please try again.';
    }
  },

  /**
   * Handle OAuth redirect (for web/social auth)
   */
  async handleAuthCallback(): Promise<AuthResponse> {
    try {
      // This is for handling OAuth callbacks in React Native
      // Supabase handles most of this automatically
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Check if user exists in profiles
      const existingProfile = data.user
        ? await profileService.getProfileByEmail(data.user.email || '')
        : null;

      const isNewUser = existingProfile === null;

      // Create profile if new user
      if (isNewUser && data.user) {
        try {
          await profileService.createProfile({
            id: data.user.id, // Use auth user's ID to ensure consistency
            email: data.user.email || '',
            first_name: null,
            last_name: null,
            role: 'fan',
            onboarding_completed: false,
          });
        } catch (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        isNewUser,
      };
    } catch (error: any) {
      console.error('Error handling auth callback:', error);
      return {
        success: false,
        error: 'An unexpected error occurred.',
      };
    }
  },
};

/**
 * Set up auth state listener
 * Call this in your app root to track session changes
 */
export const setupAuthListener = (
  onSessionChange: (session: Session | null) => void
) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email);
      onSessionChange(session);
    }
  );

  return subscription;
};

/**
 * Check if user has completed onboarding
 */
export const checkOnboardingStatus = async (
  userId: string
): Promise<boolean> => {
  if (!userId) return false;

  try {
    const profile = await profileService.getProfileById(userId);
    return profile?.onboarding_completed ?? false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};
