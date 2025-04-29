// src/store/userStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper to handle Set serialization for localStorage
const jsonStorageWithSet = {
    getItem: (name) => {
        const str = localStorage.getItem(name);
        if (!str) return null;
        const parsed = JSON.parse(str);
        // Revive Sets for profile fields if they exist
        if (parsed.state.userProfile) {
            const profile = parsed.state.userProfile;
            // Ensure profile itself is an object before iterating
            if (typeof profile === 'object' && profile !== null) {
                for (const key in profile) {
                    // Check if the property is an array and corresponds to a Set field
                    if (Array.isArray(profile[key]) && (key === 'misconceptions' || key === 'needsReinforcement' || key === 'knowledgeGaps' || key === 'proficientTopics' || key === 'assessedTopics')) {
                       profile[key] = new Set(profile[key]);
                    }
                 }
             } else {
                 // Handle cases where profile might be null or not an object unexpectedly
                 parsed.state.userProfile = null;
             }
        }
        // Revive Set for interestedTopics
         if (parsed.state.interestedTopics && Array.isArray(parsed.state.interestedTopics)) {
            parsed.state.interestedTopics = new Set(parsed.state.interestedTopics);
         } else {
             // Initialize interestedTopics as an empty Set if it's not stored correctly
             parsed.state.interestedTopics = new Set();
         }

        return parsed;
    },
    setItem: (name, newValue) => {
        // Convert Sets to arrays before storing
        const state = { ...newValue.state };
        if (state.userProfile) {
            const profile = { ...state.userProfile };
            for (const key in profile) {
                if (profile[key] instanceof Set) {
                    profile[key] = Array.from(profile[key]);
                }
            }
            state.userProfile = profile;
        }
        if (state.interestedTopics instanceof Set) {
            state.interestedTopics = Array.from(state.interestedTopics);
        }
        localStorage.setItem(name, JSON.stringify({ state, version: newValue.version }));
    },
    removeItem: (name) => localStorage.removeItem(name),
};


const useUserStore = create(
  persist(
    (set, get) => ({
      // State: Set of interested topic IDs
      interestedTopics: new Set(),
      // State: User profile generated from quiz/interactions
      userProfile: null, // Initially null

      // --- ACTION: Make sure this is defined correctly ---
      setUserProfile: (profile) => set((state) => {
          console.log("Setting user profile in Zustand:", profile); // Add console log
          return { userProfile: profile };
      }),
      // --- END ACTION ---

      // Action: Add a topic to interests
      addInterest: (topicId) => set((state) => ({
        interestedTopics: new Set(state.interestedTopics).add(topicId)
      })),
      // Action: Remove a topic from interests
      removeInterest: (topicId) => set((state) => {
        const newInterests = new Set(state.interestedTopics);
        newInterests.delete(topicId);
        return { interestedTopics: newInterests };
      }),
      // Action: Toggle interest in a topic
      toggleInterest: (topicId) => {
        const currentInterests = get().interestedTopics;
        if (currentInterests.has(topicId)) {
          get().removeInterest(topicId);
        } else {
          get().addInterest(topicId);
        }
      },
      // Utility: Check if a topic is of interest
      isInterested: (topicId) => get().interestedTopics.has(topicId),

       // Action: Clear all user data (useful for logout or reset)
       resetUser: () => set({ interestedTopics: new Set(), userProfile: null }),
    }),
    {
      name: 'finlit-user-storage', // Name for localStorage item
      storage: jsonStorageWithSet, // Use custom storage serializer
      onRehydrateStorage: (state) => { // Optional: Log when state is loaded
        console.log("Zustand state rehydrated from storage");
        return (state, error) => {
          if (error) {
            console.error("Error rehydrating Zustand state:", error);
          }
        }
      }
    }
  )
);

export default useUserStore;