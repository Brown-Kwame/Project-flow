import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ModalAction {
  label: string;
  onPress: () => void;
  color?: string;
}

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  actions: ModalAction[];
}

const CustomModal: React.FC<CustomModalProps> = ({ visible, onClose, title, subtitle, actions }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={onClose}>
      <View style={styles.supportModal}>
        <Text style={styles.modalTitle}>{title}</Text>
        {subtitle ? <Text style={styles.modalSubtitle}>{subtitle}</Text> : null}
        {actions.map((action, idx) => (
          <Pressable
            key={action.label + idx}
            style={[
              styles.modalButton,
              idx === actions.length - 1 ? { borderBottomWidth: 0 } : null
            ]}
            onPress={action.onPress}
          >
            <Text style={[styles.modalButtonText, action.color ? { color: action.color } : {}]}>{action.label}</Text>
          </Pressable>
        ))}
      </View>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default CustomModal; 