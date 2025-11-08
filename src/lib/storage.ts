import { CarSession } from './mockData';

const STORAGE_KEY = 'carSessions';

/**
 * Save a session to localStorage
 */
export const saveSessionToLocalStorage = (session: CarSession): void => {
  try {
    const existingSessions = getAllSessionsFromLocalStorage();
    const updatedSessions = [session, ...existingSessions];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
  } catch (error) {
    console.error('Error saving session to localStorage:', error);
  }
};

/**
 * Get all sessions from localStorage
 */
export const getAllSessionsFromLocalStorage = (): CarSession[] => {
  try {
    const sessionsJson = localStorage.getItem(STORAGE_KEY);
    if (!sessionsJson) return [];
    return JSON.parse(sessionsJson);
  } catch (error) {
    console.error('Error reading sessions from localStorage:', error);
    return [];
  }
};

/**
 * Get a single session by ID
 */
export const getSessionById = (id: string): CarSession | null => {
  try {
    const sessions = getAllSessionsFromLocalStorage();
    return sessions.find(session => session.id === id) || null;
  } catch (error) {
    console.error('Error getting session by ID:', error);
    return null;
  }
};

/**
 * Delete a session from localStorage
 */
export const deleteSession = (id: string): void => {
  try {
    const sessions = getAllSessionsFromLocalStorage();
    const updatedSessions = sessions.filter(session => session.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
  } catch (error) {
    console.error('Error deleting session:', error);
  }
};

/**
 * Generate a unique session ID
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Update session with background removal status
 */
export const updateSessionBackgroundStatus = (
  sessionId: string,
  backgroundsRemoved: boolean,
  showroomApplied?: boolean
): void => {
  try {
    const sessions = getAllSessionsFromLocalStorage();
    const updatedSessions = sessions.map(session => 
      session.id === sessionId 
        ? { ...session, backgroundsRemoved, showroomApplied: showroomApplied ?? session.showroomApplied }
        : session
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
  } catch (error) {
    console.error('Error updating session background status:', error);
  }
};

/**
 * Update session completely
 */
export const updateSession = (session: CarSession): void => {
  try {
    const sessions = getAllSessionsFromLocalStorage();
    const updatedSessions = sessions.map(s => 
      s.id === session.id ? session : s
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
  } catch (error) {
    console.error('Error updating session:', error);
  }
};
