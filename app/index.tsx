import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = '@climate_app_profile';

type Profile = {
  name: string;
  email: string;
  school: string;
  grade: string;
  location: string;
};

const emptyProfile: Profile = { name: '', email: '', school: '', grade: '', location: '' };

export default function DashboardScreen() {
  const router = useRouter();
  const [profileVisible, setProfileVisible] = useState(false);
  const [setupVisible, setSetupVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [draft, setDraft] = useState<Profile>(emptyProfile);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY).then((raw) => {
      if (raw) {
        setProfile(JSON.parse(raw));
      } else {
        setDraft(emptyProfile);
        setSetupVisible(true);
      }
    });
  }, []);

  const saveProfile = async (data: Profile) => {
    setProfile(data);
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(data));
  };

  const handleSetupSave = () => {
    saveProfile(draft);
    setSetupVisible(false);
  };

  const handleEditSave = () => {
    saveProfile(draft);
    setEditing(false);
  };

  const startEditing = () => {
    setDraft({ ...profile });
    setEditing(true);
  };

  const openProfile = () => {
    setEditing(false);
    setProfileVisible(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Climate App</Text>
            <Text style={styles.subtitle}>Dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={openProfile}
            activeOpacity={0.7}
          >
            <Text style={styles.profileIconText}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* First-Time Setup Modal */}
        <Modal
          visible={setupVisible}
          animationType="fade"
          transparent
          onRequestClose={() => {}}
        >
          <View style={styles.setupOverlay}>
            <View style={styles.setupCard}>
              <Text style={styles.setupTitle}>Welcome!</Text>
              <Text style={styles.setupSubtitle}>Tell us a bit about yourself to get started.</Text>

              <View style={styles.profileField}>
                <Text style={styles.fieldLabel}>Name</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Enter your name"
                  placeholderTextColor="#999"
                  value={draft.name}
                  onChangeText={(v) => setDraft({ ...draft, name: v })}
                />
              </View>
              <View style={styles.profileField}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Enter email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={draft.email}
                  onChangeText={(v) => setDraft({ ...draft, email: v })}
                />
              </View>
              <View style={styles.profileField}>
                <Text style={styles.fieldLabel}>School</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Enter your school"
                  placeholderTextColor="#999"
                  value={draft.school}
                  onChangeText={(v) => setDraft({ ...draft, school: v })}
                />
              </View>
              <View style={styles.profileField}>
                <Text style={styles.fieldLabel}>Grade</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="Enter your grade"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  value={draft.grade}
                  onChangeText={(v) => setDraft({ ...draft, grade: v })}
                />
              </View>
              <View style={styles.profileField}>
                <Text style={styles.fieldLabel}>Location</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="City, State"
                  placeholderTextColor="#999"
                  value={draft.location}
                  onChangeText={(v) => setDraft({ ...draft, location: v })}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSetupSave} activeOpacity={0.8}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Profile Modal */}
        <Modal
          visible={profileVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setProfileVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setProfileVisible(false)}>
            <Pressable style={styles.profileCard} onPress={() => {}}>
              <View style={styles.profileHeader}>
                <Text style={styles.profileTitle}>My Profile</Text>
                <View style={styles.profileActions}>
                  {!editing && (
                    <TouchableOpacity onPress={startEditing} style={styles.editButton}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => setProfileVisible(false)}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {editing ? (
                <>
                  <View style={styles.profileField}>
                    <Text style={styles.fieldLabel}>Name</Text>
                    <TextInput
                      style={styles.fieldInput}
                      value={draft.name}
                      onChangeText={(v) => setDraft({ ...draft, name: v })}
                      placeholder="Enter your name"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.profileField}>
                    <Text style={styles.fieldLabel}>Email</Text>
                    <TextInput
                      style={styles.fieldInput}
                      value={draft.email}
                      onChangeText={(v) => setDraft({ ...draft, email: v })}
                      placeholder="Enter email"
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={styles.profileField}>
                    <Text style={styles.fieldLabel}>School</Text>
                    <TextInput
                      style={styles.fieldInput}
                      value={draft.school}
                      onChangeText={(v) => setDraft({ ...draft, school: v })}
                      placeholder="Enter your school"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.profileField}>
                    <Text style={styles.fieldLabel}>Grade</Text>
                    <TextInput
                      style={styles.fieldInput}
                      value={draft.grade}
                      onChangeText={(v) => setDraft({ ...draft, grade: v })}
                      placeholder="Enter your grade"
                      placeholderTextColor="#999"
                      keyboardType="number-pad"
                    />
                  </View>
                  <View style={styles.profileField}>
                    <Text style={styles.fieldLabel}>Location</Text>
                    <TextInput
                      style={styles.fieldInput}
                      value={draft.location}
                      onChangeText={(v) => setDraft({ ...draft, location: v })}
                      placeholder="City, State"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <TouchableOpacity style={styles.saveButton} onPress={handleEditSave} activeOpacity={0.8}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.profileField}>
                    <Text style={styles.fieldLabel}>Name</Text>
                    <Text style={styles.fieldValue}>{profile.name || '—'}</Text>
                  </View>
                  <View style={styles.profileField}>
                    <Text style={styles.fieldLabel}>Email</Text>
                    <Text style={styles.fieldValue}>{profile.email || '—'}</Text>
                  </View>
                  <View style={styles.profileField}>
                    <Text style={styles.fieldLabel}>School</Text>
                    <Text style={styles.fieldValue}>{profile.school || '—'}</Text>
                  </View>
                  <View style={styles.profileField}>
                    <Text style={styles.fieldLabel}>Grade</Text>
                    <Text style={styles.fieldValue}>{profile.grade || '—'}</Text>
                  </View>
                  <View style={styles.profileField}>
                    <Text style={styles.fieldLabel}>Location</Text>
                    <Text style={styles.fieldValue}>{profile.location || '—'}</Text>
                  </View>
                </>
              )}
            </Pressable>
          </Pressable>
        </Modal>

        {/* Navigation Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.navButton, styles.gamesButton]}
            onPress={() => router.push('/learning-games')}
            activeOpacity={0.8}
          >
            <Text style={styles.navButtonIcon}>🎮</Text>
            <Text style={styles.navButtonTitle}>Learning Games</Text>
            <Text style={styles.navButtonDesc}>
              Explore how cooling strategies affect school temperatures
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nasaButton]}
            onPress={() => router.push('/nasa-search')}
            activeOpacity={0.8}
          >
            <Text style={styles.navButtonIcon}>🛰️</Text>
            <Text style={styles.navButtonTitle}>NASA Data Search</Text>
            <Text style={styles.navButtonDesc}>
              Search and explore NASA climate datasets
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileIconText: {
    fontSize: 24,
  },
  /* Setup modal */
  setupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  setupCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  setupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 4,
  },
  setupSubtitle: {
    fontSize: 15,
    color: '#718096',
    marginBottom: 20,
  },
  /* Profile modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginTop: 2,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
  },
  closeButton: {
    fontSize: 20,
    color: '#a0aec0',
    fontWeight: '600',
    padding: 4,
  },
  editButton: {
    backgroundColor: '#ebf4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2b6cb0',
  },
  saveButton: {
    backgroundColor: '#2b6cb0',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  profileField: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldInput: {
    backgroundColor: '#f7fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#2d3748',
  },
  fieldValue: {
    fontSize: 15,
    color: '#2d3748',
    paddingVertical: 4,
  },
  buttonsContainer: {
    gap: 16,
  },
  navButton: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  gamesButton: {
    backgroundColor: '#2b6cb0',
  },
  nasaButton: {
    backgroundColor: '#2c5282',
  },
  navButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  navButtonTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  navButtonDesc: {
    fontSize: 14,
    color: '#bee3f8',
    lineHeight: 20,
  },
});
