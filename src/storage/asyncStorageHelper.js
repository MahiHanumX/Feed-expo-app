import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_KEY = '@my_app_posts';

export const asyncStorageHelper = {
  // Helper to get everything
  fetch: async () => {
    try {
      const resp = await AsyncStorage.getItem(DB_KEY);
      if (!resp) {
        // First load dummy data
        const dummy = [{
          id: 'temp-1',
          title: 'Hello Mobile!',
          description: 'Testing the React Native CRUD app. This post is from AsyncStorage dummy initialization.',
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400',
          createdAt: new Date().toISOString()
        }];
        await AsyncStorage.setItem(DB_KEY, JSON.stringify(dummy));
        return dummy;
      }
      return JSON.parse(resp);
    } catch (err) {
      console.log('Error in AsyncStorage fetch:', err);
      return [];
    }
  },

  // Save full list
  persist: async (data) => {
    try {
      await AsyncStorage.setItem(DB_KEY, JSON.stringify(data));
      console.log('Stored sync successful');
    } catch (e) {
      console.log('Error persisting to storage:', e);
    }
  },

  // Single add tool
  push: async (newEntry) => {
    const list = await asyncStorageHelper.fetch();
    const entry = {
      ...newEntry,
      id: Math.random().toString(36).substr(2, 9), // Simple ID gen
      createdAt: new Date().toISOString()
    };
    const updated = [entry, ...list];
    await asyncStorageHelper.persist(updated);
    return updated;
  },

  // Edit tool
  patch: async (id, fields) => {
    const list = await asyncStorageHelper.fetch();
    const updated = list.map(item => item.id === id ? { ...item, ...fields } : item);
    await asyncStorageHelper.persist(updated);
    return updated;
  },

  // Delete tool
  kill: async (id) => {
    const list = await asyncStorageHelper.fetch();
    const filtered = list.filter(item => item.id !== id);
    await asyncStorageHelper.persist(filtered);
    return filtered;
  }
};
