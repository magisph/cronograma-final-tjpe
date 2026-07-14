// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProgressStore } from './useProgressStore';
import * as firebaseLib from '../lib/firebase';
import { signInAnonymously } from 'firebase/auth';

// Mock firebase auth and doc methods
vi.mock('../lib/firebase', () => ({
  isFirebaseConfigured: false,
  auth: {},
  db: {}
}));

vi.mock('firebase/auth', () => ({
  signInAnonymously: vi.fn(() => Promise.resolve()),
  onAuthStateChanged: vi.fn((auth, cb) => {
    // Just mock calling callback with null (no user) immediately
    cb(null);
  })
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  onSnapshot: vi.fn()
}));

describe('useProgressStore', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useProgressStore.setState({ completedTasks: {}, syncError: null, userId: null });
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('initializes with empty completedTasks', () => {
    expect(useProgressStore.getState().completedTasks).toEqual({});
  });

  it('can toggle a task from uncompleted to completed', () => {
    useProgressStore.getState().toggleTask('day1', 'task1', true);
    expect(useProgressStore.getState().completedTasks['day1']['task1']).toBe(true);
  });

  it('can toggle a task from completed to uncompleted', () => {
    useProgressStore.getState().toggleTask('day1', 'task1', true);
    useProgressStore.getState().toggleTask('day1', 'task1', false);
    expect(useProgressStore.getState().completedTasks['day1']['task1']).toBe(false);
  });

  it('persists data to localStorage', () => {
    useProgressStore.getState().toggleTask('day2', 'task2', true);
    
    // Create a new store instance essentially to see if it reads from localStorage
    // With zustand persist, it saves automatically. Let's check localStorage directly.
    const storageValue = localStorage.getItem('progress-storage');
    expect(storageValue).toBeTruthy();
    expect(storageValue).toContain('"day2":{"task2":true}');
  });
  
  it('calls signInAnonymously if Firebase is configured but user is not logged in', () => {
    // Override mock to simulate firebase being configured
    // Since it's imported, we can temporarily mutate it if possible, or redefine mock
    Object.defineProperty(firebaseLib, 'isFirebaseConfigured', { value: true });
    
    useProgressStore.getState().initializeFirebaseSync();
    
    // Should call signInAnonymously because the mock onAuthStateChanged passes null
    expect(signInAnonymously).toHaveBeenCalled();
  });
});
