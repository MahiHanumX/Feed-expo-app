import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Edit3, Trash2 } from 'lucide-react-native';

const PostCard = ({ data, onEdit, onRemove }) => {
  return (
    <View style={styles.cardContainer}>
      <Image 
        source={{ uri: data.image }} 
        style={styles.cardCover} 
        resizeMode="cover"
      />
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {data.title}
          </Text>
          <Text style={styles.cardDate}>
            {new Date(data.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.cardDesc} numberOfLines={3}>
          {data.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.footerActions}>
            <TouchableOpacity 
              style={[styles.smallBtn, styles.edit]} 
              onPress={() => onEdit(data)}
            >
              <Edit3 color="#818CF8" size={14} />
              <Text style={{ color: '#818CF8', fontSize: 12, fontWeight: '600' }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.smallBtn, styles.remove]} 
              onPress={() => onRemove(data.id)}
            >
              <Trash2 color="#F43F5E" size={14} />
              <Text style={{ color: '#F43F5E', fontSize: 12, fontWeight: '600' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  cardCover: { width: '100%', height: 200 },
  cardBody: { padding: 20 },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'baseline',
    marginBottom: 10
  },
  cardTitle: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#F8FAFC', 
    flex: 1,
    marginRight: 12,
    letterSpacing: -0.5
  },
  cardDate: { fontSize: 11, color: '#64748B', fontWeight: '600', textTransform: 'uppercase' },
  cardDesc: { 
    fontSize: 15, 
    color: '#94A3B8', 
    lineHeight: 22, 
    marginBottom: 20 
  },
  footer: { 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255,255,255,0.05)', 
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  footerActions: { flexDirection: 'row', gap: 12 },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6
  },
  edit: { borderColor: 'rgba(129, 140, 248, 0.3)' },
  remove: { borderColor: 'rgba(244, 63, 94, 0.3)' }
});

export default PostCard;
