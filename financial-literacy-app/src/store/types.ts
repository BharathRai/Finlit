// src/store/types.ts

// Define a UserProfile type matching structure from backend *after* JSON parse
// Using arrays for Sets might be safer for simple JSON transfer if persist middleware isn't configured for Sets.
export interface UserProfile {
    userId: string;
    topicKnowledge?: Record<string, number>; // Keys will be strings from JSON
    topicConfidence?: Record<string, number>;
    misconceptions?: number[]; // Array of topic IDs
    needsReinforcement?: number[]; // Array of topic IDs
    knowledgeGaps?: number[]; // Array of topic IDs
    proficientTopics?: number[]; // Array of topic IDs
    assessedTopics?: number[]; // Array of topic IDs
}

// Define the state structure
export interface UserStoreState {
    interestedTopics: Set<number>; // Keep as Set internally in Zustand state
    userProfile: UserProfile | null;
}

// Define the actions structure
export interface UserStoreActions {
    setUserProfile: (profile: UserProfile | null) => void;
    addInterest: (topicId: number) => void;
    removeInterest: (topicId: number) => void;
    toggleInterest: (topicId: number) => void;
    isInterested: (topicId: number) => boolean;
    resetUser: () => void;
}

// Combine state and actions for the full store type used in selectors
export type UserStoreType = UserStoreState & UserStoreActions;