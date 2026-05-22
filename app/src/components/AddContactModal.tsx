import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView,
  Platform,
  Animated,
  Share
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '../icons';
import { useTheme } from '../theme/ThemeProvider';

interface AddContactModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, username: string) => void;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({ visible, onClose, onSave }) => {
  const { t } = useTheme();
  const [activeTab, setActiveTab] = useState<'options' | 'add_id'>('options');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastOpacity] = useState(new Animated.Value(0));

  const showToast = (message: string) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => setToastMessage(null));
  };

  const handleCopyLink = async () => {
    const inviteLink = 'https://kora.app/invite/user_' + Math.random().toString(36).substring(7);
    await Clipboard.setStringAsync(inviteLink);
    showToast('Link copiado para a área de transferência!');
    
    try {
      await Share.share({
        message: `Participe do Kora! Use meu link para se cadastrar: ${inviteLink}`,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const handleSave = () => {
    if (!username.trim()) {
      showToast('Por favor, informe o ID/Username.');
      return;
    }
    
    let formattedUsername = username.trim();
    if (!formattedUsername.startsWith('@')) {
      formattedUsername = '@' + formattedUsername;
    }

    const contactName = name.trim() ? name.trim() : null;

    onSave(contactName || '', formattedUsername);
    showToast('Contato adicionado com sucesso!');
    
    setTimeout(() => {
      setName('');
      setUsername('');
      setActiveTab('options');
      onClose();
    }, 800);
  };

  const handleBack = () => {
    if (activeTab === 'add_id') {
      setActiveTab('options');
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleBack}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdropPressable} 
          activeOpacity={1} 
          onPress={onClose} 
        />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.keyboardContainer}
        >
          <View style={[styles.modalCard, { backgroundColor: t.bg2, borderColor: t.cardBorder }]}>
            <View style={[styles.handleBar, { backgroundColor: t.inkFaint }]} />
            
            <View style={[styles.header, { borderBottomColor: t.line }]}>
              <TouchableOpacity onPress={handleBack} style={styles.headerBtn}>
                <Feather name={activeTab === 'add_id' ? 'arrow-left' : 'x'} size={20} color={t.ink} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: t.ink }]}>
                {activeTab === 'add_id' ? 'Adicionar por ID' : 'Convidar ou Adicionar'}
              </Text>
              <View style={{ width: 24 }} />
            </View>

            {activeTab === 'options' ? (
              <View style={styles.optionsContainer}>
                <Text style={[styles.subTitle, { color: t.inkMute }]}>Escolha como deseja prosseguir:</Text>
                
                <TouchableOpacity style={[styles.optionCard, { backgroundColor: t.bgElev, borderColor: t.cardBorder }]} onPress={handleCopyLink} activeOpacity={0.7}>
                  <View style={[styles.iconWrapper, { backgroundColor: t.bg }]}>
                    <Feather name="share-2" size={22} color={t.orange} />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, { color: t.ink }]}>Enviar Link de Convite</Text>
                    <Text style={[styles.optionDesc, { color: t.inkMute }]}>Copia um link exclusivo para compartilhar com um amigo.</Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={t.inkMute} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.optionCard, { backgroundColor: t.bgElev, borderColor: t.cardBorder }]} onPress={() => setActiveTab('add_id')} activeOpacity={0.7}>
                  <View style={[styles.iconWrapper, { backgroundColor: t.bg }]}>
                    <Feather name="user-plus" size={22} color={t.orange} />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, { color: t.ink }]}>Adicionar pelo ID</Text>
                    <Text style={[styles.optionDesc, { color: t.inkMute }]}>Insira o identificador de usuário para adicioná-lo na hora.</Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={t.inkMute} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.formContainer}>
                <Text style={[styles.subTitle, { color: t.inkMute }]}>Preencha as informações do contato:</Text>

                <Text style={[styles.inputLabel, { color: t.ink }]}>ID de Usuário *</Text>
                <View style={[styles.inputWrapper, { backgroundColor: t.bgElev, borderColor: t.cardBorder }]}>
                  <Feather name="at-sign" size={16} color={t.inkMute} style={{ marginRight: 8 }} />
                  <TextInput
                    placeholder="ex: joao_silva"
                    placeholderTextColor={t.inkMute}
                    value={username}
                    onChangeText={setUsername}
                    style={[styles.input, { color: t.ink }]}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <Text style={[styles.inputLabel, { color: t.ink }]}>Nome do Contato (Opcional)</Text>
                <View style={[styles.inputWrapper, { backgroundColor: t.bgElev, borderColor: t.cardBorder }]}>
                  <Feather name="user" size={16} color={t.inkMute} style={{ marginRight: 8 }} />
                  <TextInput
                    placeholder="ex: João Silva"
                    placeholderTextColor={t.inkMute}
                    value={name}
                    onChangeText={setName}
                    style={[styles.input, { color: t.ink }]}
                    autoCorrect={false}
                  />
                </View>

                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: t.btnPrimaryBg }]} onPress={handleSave} activeOpacity={0.8}>
                  <Text style={[styles.saveBtnText, { color: t.btnPrimaryFg }]}>Adicionar e Salvar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>

        {toastMessage && (
          <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
            <Feather name="check-circle" size={16} color={t.green} style={{ marginRight: 8 }} />
            <Text style={[styles.toastText, { color: t.ink }]}>{toastMessage}</Text>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  backdropPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  keyboardContainer: {
    width: '100%',
    zIndex: 2,
  },
  modalCard: {
    width: '100%',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '500',
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 16,
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  saveBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  toast: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2C2C2C',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    zIndex: 999,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
