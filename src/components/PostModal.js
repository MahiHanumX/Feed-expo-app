import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { X, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const PostModal = ({ visible, onClose, onDone, item }) => {
  const [form, setForm] = useState({ title: '', description: '', image: '' });

  // Sync state with item when modal opens
  useEffect(() => {
    if (item) {
      setForm({
        title: item.title || '',
        description: item.description || '',
        image: item.image || ''
      });
    } else {
      setForm({ title: '', description: '', image: '' });
    }
  }, [item, visible]);

  const handlePick = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.6,
        base64: true,
      });

      if (!res.canceled) {
        setForm(prev => ({ 
          ...prev, 
          image: `data:image/jpeg;base64,${res.assets[0].base64}` 
        }));
      }
    } catch (e) {
      console.log('Image picker error:', e);
    }
  };

  const submit = () => {
    if (!form.title.trim() || !form.description.trim() || !form.image) {
      Alert.alert('Details Required', 'Please fill in all the fields before publishing.');
      return;
    }
    // Return data to parent handler
    onDone(form);
  };

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onClose} 
        contentContainerStyle={styles.view}
        style={{ zIndex: 1000 }}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.top}>
            <Text style={styles.topHeading}>{item ? 'Update Entry' : 'Create Entry'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.close}>
              <X color="#94A3B8" size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.inner}>
            <Text style={styles.label}>Post Title</Text>
            <TextInput
              style={styles.field}
              placeholder="What should we call this?"
              placeholderTextColor="#64748B"
              value={form.title}
              onChangeText={val => setForm({ ...form, title: val })}
            />

            <Text style={styles.label}>Short Description</Text>
            <TextInput
              style={[styles.field, styles.textarea]}
              placeholder="Give some more context..."
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={4}
              value={form.description}
              onChangeText={val => setForm({ ...form, description: val })}
            />

            <Text style={styles.label}>Cover Image</Text>
            <TouchableOpacity style={styles.imageBox} onPress={handlePick}>
              {form.image ? (
                <Image source={{ uri: form.image }} style={styles.fullPreview} />
              ) : (
                <View style={styles.iconWrap}>
                  <Camera color="#94A3B8" size={28} />
                  <Text style={styles.helper}>Tap to select from gallery</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.pushBtn} onPress={submit}>
              <Text style={styles.pushText}>
                {item ? 'Save Updates' : 'Publish Post'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#1E293B',
    margin: 15,
    borderRadius: 16,
    overflow: 'hidden',
  },
  top: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1, 
    borderBottomColor: '#2D3748'
  },
  topHeading: { fontSize: 18, fontWeight: '700', color: '#F1F5F9' },
  close: { padding: 4 },
  inner: { padding: 20 },
  label: { color: '#94A3B8', fontSize: 12, marginBottom: 8, fontWeight: '600' },
  field: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    color: '#F8FAFC',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textarea: { height: 90, textAlignVertical: 'top' },
  imageBox: {
    height: 120,
    backgroundColor: '#0F172A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden'
  },
  iconWrap: { alignItems: 'center' },
  helper: { color: '#64748B', fontSize: 11, marginTop: 4 },
  fullPreview: { width: '100%', height: '100%' },
  pushBtn: {
    backgroundColor: '#6366F1',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 50, // More space for keyboard
  },
  pushText: { color: '#FFF', fontSize: 15, fontWeight: '700' }
});

export default PostModal;
