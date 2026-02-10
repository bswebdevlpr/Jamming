"use client";

import { create } from "zustand";
import { UserProfile } from "@/app/lib/interfaces/global.interface";
import { Entity_Playlist } from "@/app/lib/interfaces/entity.interface";

const initialUserProfile: UserProfile = {
  isLoaded: undefined,
  id: undefined,
  accept_marketing: undefined,
  profile_image: undefined,
  nickname: undefined,
  tags: undefined,
  pos: undefined,
  genre: undefined,
  level: undefined,
  location: undefined,
  bpm: undefined,
  is_bpm_public: undefined,
  allow_noti: undefined,
  playlist: [],
};

interface SessionState {
  userProfile: UserProfile;
  signupProfileImage: File | null;
}

interface SessionActions {
  setUserProfile: (input: Partial<UserProfile>) => void;
  resetUserProfile: () => void;
  setSignupProfileImage: (file: File | null) => void;
  clearSignupData: () => void;
}

export const useSessionStore = create<SessionState & SessionActions>((set) => ({
  userProfile: initialUserProfile,
  signupProfileImage: null,

  setUserProfile: (input) =>
    set((state) => ({
      userProfile: { ...state.userProfile, ...input },
    })),
  resetUserProfile: () => set({ userProfile: initialUserProfile }),
  setSignupProfileImage: (file) => set({ signupProfileImage: file }),
  clearSignupData: () => set({ signupProfileImage: null }),
}));
