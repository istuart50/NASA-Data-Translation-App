import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getResourceById, CATEGORY_CONFIG } from '@/data/nasa-resources';
import { simplifyArticle, chatAboutArticle, isConfigured } from '@/services/gemini';

const PROFILE_KEY = '@climate_app_profile';

type ChatMessage = {
  id: number;
  role: 'user' | 'ai';
  text: string;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function NasaArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const resource = getResourceById(id ?? '');

  const [grade, setGrade] = useState('');
  const [simplified, setSimplified] = useState('');
  const [simplifying, setSimplifying] = useState(false);
  const [simplifiedVisible, setSimplifiedVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [nextMsgId, setNextMsgId] = useState(0);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [webLoading, setWebLoading] = useState(true);
  const chatScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY).then((raw) => {
      if (raw) {
        const profile = JSON.parse(raw);
        setGrade(profile.grade || '8');
      }
    });
  }, []);

  if (!resource) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Resource not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const config = CATEGORY_CONFIG[resource.category];

  const gradeAge = Math.max(10, Math.min(18, parseInt(grade, 10) + 5)) || 13;

  async function handleSimplify() {
    setSimplifying(true);
    setSimplified('');
    setSimplifiedVisible(true);
    try {
      const result = await simplifyArticle(
        resource!.title,
        resource!.description,
        resource!.url,
        gradeAge,
      );
      setSimplified(result);
    } catch (e: any) {
      setSimplified(`Oops! Something went wrong: ${e.message}`);
    } finally {
      setSimplifying(false);
    }
  }

  async function handleSendChat() {
    const question = chatInput.trim();
    if (!question || chatLoading) return;

    const userMsg: ChatMessage = { id: nextMsgId, role: 'user', text: question };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setNextMsgId((prev) => prev + 1);
    setChatLoading(true);

    setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const reply = await chatAboutArticle(
        resource!.title,
        resource!.description,
        question,
        gradeAge,
      );
      const aiMsg: ChatMessage = { id: nextMsgId + 1, role: 'ai', text: reply };
      setChatMessages((prev) => [...prev, aiMsg]);
      setNextMsgId((prev) => prev + 2);
    } catch (e: any) {
      const errMsg: ChatMessage = {
        id: nextMsgId + 1,
        role: 'ai',
        text: `Oops! I had trouble answering that: ${e.message}`,
      };
      setChatMessages((prev) => [...prev, errMsg]);
      setNextMsgId((prev) => prev + 2);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.screenContainer}>
        {/* WebView showing the actual website */}
        <View style={styles.webviewContainer}>
          {webLoading && (
            <View style={styles.webLoading}>
              <ActivityIndicator size="large" color="#2b6cb0" />
              <Text style={styles.webLoadingText}>Loading {resource.title}...</Text>
            </View>
          )}
          <WebView
            source={{ uri: resource.url }}
            style={styles.webview}
            onLoadStart={() => setWebLoading(true)}
            onLoadEnd={() => setWebLoading(false)}
            startInLoadingState={false}
          />
        </View>

        {/* Simplified Overlay */}
        {simplifiedVisible && (
          <View style={styles.simplifiedOverlay}>
            <View style={styles.simplifiedHeader}>
              <Text style={styles.simplifiedTitle}>Simplified for you</Text>
              <TouchableOpacity onPress={() => setSimplifiedVisible(false)}>
                <Text style={styles.simplifiedClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.simplifiedScroll}>
              {simplifying ? (
                <View style={styles.simplifiedLoading}>
                  <ActivityIndicator color="#2b6cb0" size="large" />
                  <Text style={styles.simplifiedLoadingText}>Rewriting for your level...</Text>
                </View>
              ) : (
                <Text style={styles.simplifiedText}>{simplified}</Text>
              )}
            </ScrollView>
          </View>
        )}

        {/* Floating Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={handleSimplify}
            activeOpacity={0.8}
            disabled={simplifying}
          >
            <Text style={styles.helpButtonText}>
              {simplifying ? 'Simplifying...' : '🤔 I don\'t understand'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => setAiPanelOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.chatButtonText}>💬 Ask AI</Text>
          </TouchableOpacity>
        </View>

        {/* AI Panel Modal */}
        <Modal
          visible={aiPanelOpen}
          animationType="slide"
          transparent
          onRequestClose={() => setAiPanelOpen(false)}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setAiPanelOpen(false)}
            >
              <Pressable style={styles.aiPanel} onPress={() => {}}>
                {/* Panel Header */}
                <View style={styles.panelHandle} />
                <View style={styles.panelHeader}>
                  <Text style={styles.panelTitle}>AI Helper</Text>
                  <TouchableOpacity onPress={() => setAiPanelOpen(false)}>
                    <Text style={styles.panelClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  ref={chatScrollRef}
                  style={styles.panelScroll}
                  contentContainerStyle={styles.panelScrollContent}
                >
                  {/* Resource context */}
                  <View style={[styles.contextBadge, { backgroundColor: config.bg }]}>
                    <Text style={[styles.contextBadgeText, { color: config.color }]} numberOfLines={1}>
                      Reading: {resource.title}
                    </Text>
                  </View>

                  {/* Chat Messages */}
                  {chatMessages.length > 0 && (
                    <View style={styles.chatDivider}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>Chat</Text>
                      <View style={styles.dividerLine} />
                    </View>
                  )}

                  {chatMessages.map((msg) => (
                    <View
                      key={msg.id}
                      style={[
                        styles.chatBubble,
                        msg.role === 'user' ? styles.userBubble : styles.aiBubble,
                      ]}
                    >
                      {msg.role === 'ai' && <Text style={styles.aiLabel}>AI Tutor</Text>}
                      <Text
                        style={[
                          styles.chatText,
                          msg.role === 'user' ? styles.userText : styles.aiText,
                        ]}
                      >
                        {msg.text}
                      </Text>
                    </View>
                  ))}

                  {chatLoading && (
                    <View style={[styles.chatBubble, styles.aiBubble]}>
                      <Text style={styles.aiLabel}>AI Tutor</Text>
                      <View style={styles.typingRow}>
                        <ActivityIndicator color="#2b6cb0" size="small" />
                        <Text style={styles.typingText}>Thinking...</Text>
                      </View>
                    </View>
                  )}
                </ScrollView>

                {/* Chat Input */}
                <View style={styles.chatInputRow}>
                  <TextInput
                    style={styles.chatInput}
                    placeholder="Ask a question about this page..."
                    placeholderTextColor="#a0aec0"
                    value={chatInput}
                    onChangeText={setChatInput}
                    multiline
                    maxLength={500}
                  />
                  <TouchableOpacity
                    style={[
                      styles.sendButton,
                      (!chatInput.trim() || chatLoading) && styles.sendButtonDisabled,
                    ]}
                    onPress={handleSendChat}
                    disabled={!chatInput.trim() || chatLoading}
                  >
                    <Text style={styles.sendButtonText}>Send</Text>
                  </TouchableOpacity>
                </View>

                {!isConfigured() && (
                  <View style={styles.apiWarning}>
                    <Text style={styles.apiWarningText}>
                      AI features need a Gemini API key. Add yours in services/gemini.ts
                    </Text>
                  </View>
                )}
              </Pressable>
            </Pressable>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  screenContainer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#e53e3e',
  },

  // WebView
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  webLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    zIndex: 10,
  },
  webLoadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#718096',
  },

  // Simplified overlay
  simplifiedOverlay: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  simplifiedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  simplifiedTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a365d',
  },
  simplifiedClose: {
    fontSize: 20,
    color: '#a0aec0',
    fontWeight: '600',
    padding: 4,
  },
  simplifiedScroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  simplifiedLoading: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 12,
  },
  simplifiedLoadingText: {
    fontSize: 15,
    color: '#718096',
  },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  helpButton: {
    flex: 1,
    backgroundColor: '#e53e3e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  chatButton: {
    flex: 1,
    backgroundColor: '#2b6cb0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Modal / AI Panel
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  aiPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.75,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  panelHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e0',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a365d',
  },
  panelClose: {
    fontSize: 22,
    color: '#a0aec0',
    fontWeight: '600',
    padding: 4,
  },
  panelScroll: {
    flex: 1,
  },
  panelScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  // Context badge
  contextBadge: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  contextBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },

  simplifiedText: {
    fontSize: 15,
    color: '#4a5568',
    lineHeight: 24,
    paddingBottom: 16,
  },

  // Chat divider
  chatDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 12,
    color: '#a0aec0',
    fontWeight: '600',
  },

  // Chat bubbles
  chatBubble: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: '#2b6cb0',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#f7fafc',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2b6cb0',
    marginBottom: 4,
  },
  chatText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#2d3748',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#718096',
    fontStyle: 'italic',
  },

  // Chat input
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#f7fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#2d3748',
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: '#2b6cb0',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#cbd5e0',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // API warning
  apiWarning: {
    backgroundColor: '#fff5f5',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
    marginTop: 8,
  },
  apiWarningText: {
    fontSize: 12,
    color: '#c53030',
    textAlign: 'center',
    lineHeight: 18,
  },
});
