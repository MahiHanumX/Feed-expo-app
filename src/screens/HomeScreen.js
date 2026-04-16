import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  RefreshControl,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Image as ImageIcon } from 'lucide-react-native';
import { asyncStorageHelper } from '../storage/asyncStorageHelper';
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';

const HomeScreen = ({ navigation }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, activeItem: null });

  // Load feed from DB
  const refresh = async () => {
    setLoading(true);
    try {
      const data = await asyncStorageHelper.fetch();
      setList(data);
      console.log('App: Data refreshed from store');
    } catch (e) {
      console.log('Refresh failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleUpdateAction = async (formFields) => {
    try {
      let updated;
      if (modal.activeItem) {
        // Edit mode
        updated = await asyncStorageHelper.patch(modal.activeItem.id, formFields);
      } else {
        // Create mode
        updated = await asyncStorageHelper.push(formFields);
      }
      setList(updated);
      setModal({ open: false, activeItem: null });
    } catch (err) {
      console.log('Creation/Update failed:', err);
      Alert.alert('Oops!', 'Something went wrong while saving.');
    }
  };

  const handleRemove = (id) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to remove this post? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await asyncStorageHelper.kill(id);
            setList(result);
            console.log('Post deleted:', id);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Feed</Text>
          <Text style={styles.headerSub}>Latest updates from DevHub</Text>
        </View>
        <TouchableOpacity style={styles.plusFab} onPress={() => setModal({ open: true, activeItem: null })}>
          <Plus color="#FFF" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} colors={['#6366F1']} tintColor="#6366F1" />}
      >
        {list.length === 0 ? (
          <View style={styles.emptyWrap}>
            <ImageIcon color="#94A3B8" size={64} strokeWidth={1.5} />
            <Text style={styles.emptyText}>Feed is currently empty.</Text>
            <TouchableOpacity onPress={() => setModal({ open: true, activeItem: null })}>
              <Text style={styles.emptyAction}>Create your first entry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          list.map(p => (
            <PostCard
              key={p.id}
              data={p}
              onEdit={(item) => setModal({ open: true, activeItem: item })}
              onRemove={handleRemove}
            />
          ))
        )}
      </ScrollView>

      {/* Shared Entry Modal */}
      <PostModal
        visible={modal.open}
        onClose={() => setModal({ open: false, activeItem: null })}
        onDone={handleUpdateAction}
        item={modal.activeItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F172A'
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderBottomWidth: 0.5,
    borderBottomColor: '#1E293B',
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  plusFab: {
    backgroundColor: '#6366F1',
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  scroll: { padding: 20 },
  emptyWrap: { alignItems: 'center', marginTop: 120 },
  emptyText: { color: '#94A3B8', fontSize: 16, marginTop: 15 },
  emptyAction: { color: '#6366F1', fontWeight: '700', marginTop: 10, fontSize: 15 }
});

export default HomeScreen;
