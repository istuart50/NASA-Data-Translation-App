import { useState, useMemo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { School, searchSchoolsByZipcode } from '@/services/overpass';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ROOF_COLORS = [
  { label: 'White', color: '#f0f0f0', cooling: 8, textColor: '#333' },
  { label: 'Light Gray', color: '#c0c0c0', cooling: 5, textColor: '#333' },
  { label: 'Tan', color: '#d2b48c', cooling: 3, textColor: '#333' },
  { label: 'Brown', color: '#8B4513', cooling: 1, textColor: '#fff' },
  { label: 'Dark Gray', color: '#505050', cooling: 0, textColor: '#fff' },
  { label: 'Black', color: '#1a1a1a', cooling: -2, textColor: '#fff' },
];

const MAX_TREES = 8;
const COOLING_PER_TREE = 1.5;
const GOAL_TEMP_REDUCTION = 10;

type GamePhase = 'zipcode' | 'school' | 'simulation';

function Stars({ cooled }: { cooled: number }) {
  const stars = cooled >= 15 ? 3 : cooled >= 10 ? 2 : cooled >= 5 ? 1 : 0;
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3].map((s) => (
        <Text key={s} style={[styles.star, s <= stars && styles.starLit]}>★</Text>
      ))}
    </View>
  );
}

export default function LearningGamesScreen() {
  const [phase, setPhase] = useState<GamePhase>('zipcode');
  const [zipcodeQuery, setZipcodeQuery] = useState('');
  const [selectedZipcode, setSelectedZipcode] = useState('');
  const [matchingSchools, setMatchingSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [roofColorIndex, setRoofColorIndex] = useState(4);
  const [treeCount, setTreeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const animatedTemp = useRef(new Animated.Value(0)).current;
  const celebrateAnim = useRef(new Animated.Value(0)).current;
  const tempScale = useRef(new Animated.Value(1)).current;

  const roofColor = ROOF_COLORS[roofColorIndex];

  const currentTemp = useMemo(() => {
    if (!selectedSchool) return 0;
    const base = selectedSchool.baseTemp;
    const roofCooling = roofColor.cooling;
    const treeCooling = treeCount * COOLING_PER_TREE;
    return Math.round((base - roofCooling - treeCooling) * 10) / 10;
  }, [selectedSchool, roofColor, treeCount]);

  const cooledBy = selectedSchool ? Math.max(0, selectedSchool.baseTemp - currentTemp) : 0;
  const goalReached = cooledBy >= GOAL_TEMP_REDUCTION;

  useEffect(() => {
    if (!selectedSchool) return;
    Animated.spring(animatedTemp, {
      toValue: currentTemp,
      useNativeDriver: false,
      friction: 6,
    }).start();
    Animated.sequence([
      Animated.timing(tempScale, { toValue: 1.15, duration: 120, useNativeDriver: true }),
      Animated.spring(tempScale, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();
  }, [currentTemp]);

  useEffect(() => {
    if (goalReached) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.sequence([
        Animated.timing(celebrateAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(celebrateAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(celebrateAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [goalReached]);

  const tempColor = useMemo(() => {
    if (currentTemp >= 95) return '#ef4444';
    if (currentTemp >= 90) return '#f97316';
    if (currentTemp >= 85) return '#f59e0b';
    if (currentTemp >= 80) return '#eab308';
    if (currentTemp >= 75) return '#84cc16';
    return '#22c55e';
  }, [currentTemp]);

  async function handleZipcodeChange(text: string) {
    setZipcodeQuery(text);
    setSearchError(null);
    if (text.length === 5) {
      setIsLoading(true);
      try {
        const schools = await searchSchoolsByZipcode(text);
        setSelectedZipcode(text);
        setMatchingSchools(schools);
        setPhase('school');
      } catch {
        setSearchError('Could not fetch schools. Check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    }
  }

  function selectSchool(school: School) {
    setSelectedSchool(school);
    setRoofColorIndex(4);
    setTreeCount(0);
    animatedTemp.setValue(school.baseTemp);
    celebrateAnim.setValue(0);
    setPhase('simulation');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  function changeRoof(index: number) {
    setRoofColorIndex(index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function changeTrees(delta: number) {
    const next = Math.min(MAX_TREES, Math.max(0, treeCount + delta));
    if (next !== treeCount) {
      setTreeCount(next);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  function goBack() {
    if (phase === 'simulation') {
      setPhase('school');
      setSelectedSchool(null);
    } else if (phase === 'school') {
      setPhase('zipcode');
      setSelectedZipcode('');
      setZipcodeQuery('');
    }
  }

  // ── ZIP CODE SCREEN ─────────────────────────────────────────────────────────
  if (phase === 'zipcode') {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <LinearGradient colors={['#1e3a8a', '#3b82f6', '#7dd3fc']} style={styles.flex}>
          <SafeAreaView style={styles.flex}>
            <View style={styles.zipScreen}>
              <Text style={styles.zipEmoji}>🌍</Text>
              <Text style={styles.zipTitle}>Cool School{'\n'}Challenge!</Text>
              <Text style={styles.zipSubtitle}>
                Enter your zipcode to find a school near you
              </Text>
              <View style={styles.zipInputWrapper}>
                <TextInput
                  style={styles.zipInput}
                  placeholder="ZIP CODE"
                  placeholderTextColor="#94a3b8"
                  keyboardType="number-pad"
                  maxLength={5}
                  value={zipcodeQuery}
                  onChangeText={handleZipcodeChange}
                  textAlign="center"
                />
              </View>

              {isLoading && (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.loadingText}>Finding schools…</Text>
                </View>
              )}
              {searchError && <Text style={styles.errorText}>{searchError}</Text>}

              <View style={styles.howToPlay}>
                <Text style={styles.howTitle}>How to play</Text>
                <Text style={styles.howText}>🏫  Pick a school near you</Text>
                <Text style={styles.howText}>🎨  Change the roof color</Text>
                <Text style={styles.howText}>🌳  Plant trees around it</Text>
                <Text style={styles.howText}>⭐  Cool it by 10°F to win!</Text>
              </View>

              <Text style={styles.attribution}>
                School data © OpenStreetMap contributors (ODbL)
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </>
    );
  }

  // ── SCHOOL SELECTION ────────────────────────────────────────────────────────
  if (phase === 'school') {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <LinearGradient colors={['#1e3a8a', '#3b82f6']} style={styles.flex}>
          <SafeAreaView style={styles.flex}>
            <View style={styles.schoolHeader}>
              <TouchableOpacity onPress={goBack} style={styles.backBtn}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.schoolHeaderTitle}>Pick Your School!</Text>
              <Text style={styles.schoolHeaderSub}>{selectedZipcode} · {matchingSchools.length} schools found</Text>
            </View>

            <ScrollView
              style={styles.flex}
              contentContainerStyle={styles.schoolList}
              showsVerticalScrollIndicator={false}
            >
              {matchingSchools.length === 0 ? (
                <View style={styles.noResultsCard}>
                  <Text style={styles.noResultsEmoji}>🔍</Text>
                  <Text style={styles.noResultsText}>No schools found for this zipcode. Try a nearby one!</Text>
                </View>
              ) : (
                matchingSchools.map((school, i) => (
                  <TouchableOpacity
                    key={`${school.name}-${i}`}
                    style={styles.schoolCard}
                    onPress={() => selectSchool(school)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.schoolCardLeft}>
                      <Text style={styles.schoolCardEmoji}>🏫</Text>
                      <View>
                        <Text style={styles.schoolCardName}>{school.name}</Text>
                        <Text style={styles.schoolCardCity}>{school.city}</Text>
                      </View>
                    </View>
                    <View style={styles.schoolCardRight}>
                      <Text style={styles.schoolCardTemp}>{school.baseTemp}°F</Text>
                      <Text style={styles.schoolCardToday}>today</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
              <Text style={styles.attributionDark}>
                School data © OpenStreetMap contributors (ODbL)
              </Text>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </>
    );
  }

  // ── SIMULATION / GAME ───────────────────────────────────────────────────────
  const progressPct = Math.min(1, cooledBy / GOAL_TEMP_REDUCTION);
  const celebrateScale = celebrateAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.gameScreen}>

        {/* Scene */}
        <View style={styles.scene}>
          <LinearGradient
            colors={currentTemp >= 90 ? ['#f97316', '#fbbf24'] : ['#38bdf8', '#7dd3fc']}
            style={styles.sky}
          >
            <Text style={styles.sun}>{currentTemp >= 90 ? '🥵' : '☀️'}</Text>
          </LinearGradient>

          <View style={styles.groundRow}>
            {/* Left trees */}
            <View style={styles.treeSide}>
              {Array.from({ length: Math.min(treeCount, 4) }).map((_, i) => (
                <View key={i} style={styles.tree}>
                  <View style={styles.treeTop} />
                  <View style={styles.treeTrunk} />
                </View>
              ))}
            </View>

            {/* Building */}
            <View style={styles.building}>
              <View style={[styles.roofPeakTriangle, { borderBottomColor: roofColor.color }]} />
              <View style={[styles.roofFlat, { backgroundColor: roofColor.color }]} />
              <View style={styles.facade}>
                <View style={styles.windowRow}>
                  <View style={styles.window} /><View style={styles.window} /><View style={styles.window} />
                </View>
                <View style={styles.windowRow}>
                  <View style={styles.window} /><View style={styles.door} /><View style={styles.window} />
                </View>
              </View>
            </View>

            {/* Right trees */}
            <View style={styles.treeSide}>
              {Array.from({ length: Math.max(treeCount - 4, 0) }).map((_, i) => (
                <View key={i} style={styles.tree}>
                  <View style={styles.treeTop} />
                  <View style={styles.treeTrunk} />
                </View>
              ))}
            </View>
          </View>
          <View style={styles.ground} />
        </View>

        {/* HUD */}
        <ScrollView style={styles.hud} contentContainerStyle={styles.hudContent} showsVerticalScrollIndicator={false}>

          {/* Top bar */}
          <View style={styles.hudTopBar}>
            <TouchableOpacity onPress={goBack} style={styles.backBtn}>
              <Text style={styles.backBtnText}>← Schools</Text>
            </TouchableOpacity>
            <Text style={styles.schoolNameHUD} numberOfLines={1}>{selectedSchool?.name}</Text>
          </View>

          {/* Temperature + stars */}
          <Animated.View style={[styles.tempCard, { transform: [{ scale: celebrateScale }] }]}>
            <View style={styles.tempRow}>
              <View style={styles.tempBlock}>
                <Text style={styles.tempBlockLabel}>NOW</Text>
                <Animated.Text style={[styles.tempBig, { color: tempColor, transform: [{ scale: tempScale }] }]}>
                  {currentTemp}°F
                </Animated.Text>
              </View>
              <View style={styles.tempArrow}>
                <Text style={styles.tempArrowText}>→</Text>
              </View>
              <View style={styles.tempBlock}>
                <Text style={styles.tempBlockLabel}>GOAL</Text>
                <Text style={styles.tempGoal}>{Math.round(selectedSchool!.baseTemp - GOAL_TEMP_REDUCTION)}°F</Text>
              </View>
            </View>

            <Stars cooled={cooledBy} />

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPct * 100}%` }]} />
            </View>
            <Text style={styles.progressLabel}>
              {cooledBy > 0 ? `Cooled by ${cooledBy.toFixed(1)}°F!` : `Cool it by ${GOAL_TEMP_REDUCTION}°F to win ⭐`}
            </Text>

            {goalReached && (
              <Text style={styles.goalBanner}>🎉 You did it! Keep going for more stars!</Text>
            )}
          </Animated.View>

          {/* Roof color */}
          <View style={styles.controlCard}>
            <Text style={styles.controlTitle}>🎨  Roof Color</Text>
            <Text style={styles.controlHint}>Lighter roofs reflect sunlight and stay cooler</Text>
            <View style={styles.roofOptions}>
              {ROOF_COLORS.map((rc, i) => (
                <TouchableOpacity
                  key={rc.label}
                  style={[
                    styles.roofSwatch,
                    { backgroundColor: rc.color },
                    i === roofColorIndex && styles.roofSwatchActive,
                  ]}
                  onPress={() => changeRoof(i)}
                  activeOpacity={0.8}
                >
                  {i === roofColorIndex && (
                    <Text style={[styles.roofCheck, { color: rc.textColor }]}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.controlValue}>
              {roofColor.label} · {roofColor.cooling > 0 ? `-${roofColor.cooling}` : `+${Math.abs(roofColor.cooling)}`}°F
            </Text>
          </View>

          {/* Trees */}
          <View style={styles.controlCard}>
            <Text style={styles.controlTitle}>🌳  Trees</Text>
            <Text style={styles.controlHint}>Trees shade the building and cool the air</Text>
            <View style={styles.treeRow}>
              <TouchableOpacity
                style={[styles.treeBtn, treeCount === 0 && styles.treeBtnOff]}
                onPress={() => changeTrees(-1)}
                disabled={treeCount === 0}
              >
                <Text style={styles.treeBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.treeCountBox}>
                <Text style={styles.treeCountNum}>{treeCount}</Text>
                <Text style={styles.treeCountSub}>trees  ·  −{(treeCount * COOLING_PER_TREE).toFixed(1)}°F</Text>
              </View>
              <TouchableOpacity
                style={[styles.treeBtn, treeCount === MAX_TREES && styles.treeBtnOff]}
                onPress={() => changeTrees(1)}
                disabled={treeCount === MAX_TREES}
              >
                <Text style={styles.treeBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Impact Summary</Text>
            {[
              { label: 'Base temperature', value: `${selectedSchool?.baseTemp}°F`, color: '#64748b' },
              { label: 'Roof saves', value: roofColor.cooling > 0 ? `−${roofColor.cooling}°F` : `+${Math.abs(roofColor.cooling)}°F`, color: '#3b82f6' },
              { label: 'Trees save', value: `−${(treeCount * COOLING_PER_TREE).toFixed(1)}°F`, color: '#22c55e' },
            ].map((row) => (
              <View key={row.label} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={[styles.summaryVal, { color: row.color }]}>{row.value}</Text>
              </View>
            ))}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Result</Text>
              <Text style={[styles.summaryTotalVal, { color: tempColor }]}>{currentTemp}°F</Text>
            </View>
          </View>

        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  // ── ZIP SCREEN ──────────────────────────────────────────────────────────────
  zipScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  zipEmoji: { fontSize: 56, marginBottom: 12 },
  zipTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 10,
  },
  zipSubtitle: {
    fontSize: 16,
    color: '#bfdbfe',
    textAlign: 'center',
    marginBottom: 28,
  },
  zipInputWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  zipInput: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 24,
    fontSize: 28,
    fontWeight: '800',
    color: '#1e3a8a',
    letterSpacing: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  loadingText: { color: '#fff', fontSize: 15 },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  howToPlay: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginTop: 8,
    marginBottom: 20,
    gap: 8,
  },
  howTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 4,
  },
  howText: { color: '#e0f2fe', fontSize: 15 },
  attribution: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },

  // ── SCHOOL SELECTION ────────────────────────────────────────────────────────
  schoolHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  schoolHeaderTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginTop: 8,
  },
  schoolHeaderSub: { color: '#bfdbfe', fontSize: 14, marginTop: 2 },
  schoolList: { paddingHorizontal: 16, paddingBottom: 32, gap: 10 },
  schoolCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  schoolCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  schoolCardEmoji: { fontSize: 28 },
  schoolCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e3a8a',
    flexShrink: 1,
  },
  schoolCardCity: { fontSize: 13, color: '#64748b', marginTop: 2 },
  schoolCardRight: { alignItems: 'flex-end', marginLeft: 8 },
  schoolCardTemp: { fontSize: 22, fontWeight: '800', color: '#f97316' },
  schoolCardToday: { fontSize: 11, color: '#94a3b8' },
  noResultsCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  noResultsEmoji: { fontSize: 40 },
  noResultsText: { color: '#e0f2fe', textAlign: 'center', fontSize: 15, lineHeight: 22 },
  attributionDark: { color: 'rgba(255,255,255,0.35)', fontSize: 11, textAlign: 'center', marginTop: 8 },

  // ── BACK BUTTON ─────────────────────────────────────────────────────────────
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  backBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // ── GAME SCREEN ─────────────────────────────────────────────────────────────
  gameScreen: { flex: 1, backgroundColor: '#0f172a' },

  // Scene
  scene: { height: 240 },
  sky: { flex: 1, paddingTop: 16, paddingRight: 20, alignItems: 'flex-end' },
  sun: { fontSize: 36 },
  groundRow: {
    position: 'absolute',
    bottom: 36,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
  },
  treeSide: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    minWidth: 60,
    justifyContent: 'center',
  },
  tree: { alignItems: 'center' },
  treeTop: { width: 32, height: 40, backgroundColor: '#16a34a', borderRadius: 16 },
  treeTrunk: { width: 7, height: 16, backgroundColor: '#92400e' },
  building: { alignItems: 'center', marginHorizontal: 8 },
  roofPeakTriangle: {
    width: 0, height: 0,
    borderLeftWidth: 50, borderRightWidth: 50, borderBottomWidth: 20,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
  },
  roofFlat: { width: 160, height: 22, borderTopLeftRadius: 2, borderTopRightRadius: 2 },
  facade: {
    width: 160,
    height: 90,
    backgroundColor: '#e2c9a0',
    padding: 10,
    justifyContent: 'space-around',
  },
  windowRow: { flexDirection: 'row', justifyContent: 'space-around' },
  window: {
    width: 28, height: 28,
    backgroundColor: '#7dd3fc',
    borderWidth: 2, borderColor: '#92400e',
  },
  door: {
    width: 24, height: 34,
    backgroundColor: '#78350f',
    borderTopLeftRadius: 4, borderTopRightRadius: 4,
    marginTop: -6,
  },
  ground: { height: 36, backgroundColor: '#16a34a' },

  // HUD
  hud: { flex: 1, backgroundColor: '#f8fafc' },
  hudContent: { padding: 16, gap: 12, paddingBottom: 32 },
  hudTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  schoolNameHUD: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1e3a8a',
  },

  // Temp card
  tempCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tempBlock: { alignItems: 'center', flex: 1 },
  tempBlockLabel: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1.5 },
  tempBig: { fontSize: 52, fontWeight: '900', lineHeight: 60 },
  tempArrow: { paddingHorizontal: 8 },
  tempArrowText: { fontSize: 24, color: '#cbd5e1' },
  tempGoal: { fontSize: 36, fontWeight: '800', color: '#22c55e', lineHeight: 44 },

  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 },
  star: { fontSize: 32, color: '#e2e8f0' },
  starLit: { color: '#f59e0b' },

  progressTrack: {
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 6,
  },
  progressLabel: { fontSize: 13, color: '#64748b', textAlign: 'center' },
  goalBanner: {
    marginTop: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 10,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#16a34a',
  },

  // Controls
  controlCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  controlTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a', marginBottom: 2 },
  controlHint: { fontSize: 13, color: '#94a3b8', marginBottom: 14, lineHeight: 18 },
  controlValue: { fontSize: 13, fontWeight: '600', color: '#475569', marginTop: 10 },

  roofOptions: { flexDirection: 'row', gap: 10 },
  roofSwatch: {
    width: 46, height: 46, borderRadius: 23,
    justifyContent: 'center', alignItems: 'center',
  },
  roofSwatchActive: { borderWidth: 3, borderColor: '#3b82f6' },
  roofCheck: { fontSize: 20, fontWeight: '900' },

  treeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  treeBtn: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: '#3b82f6',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  treeBtnOff: { backgroundColor: '#e2e8f0', shadowOpacity: 0 },
  treeBtnText: { fontSize: 28, color: '#fff', fontWeight: '900', lineHeight: 32 },
  treeCountBox: { alignItems: 'center' },
  treeCountNum: { fontSize: 42, fontWeight: '900', color: '#16a34a', lineHeight: 48 },
  treeCountSub: { fontSize: 12, color: '#64748b' },

  // Summary
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 14 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: { fontSize: 14, color: '#64748b' },
  summaryVal: { fontSize: 14, fontWeight: '700' },
  summaryDivider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 4 },
  summaryTotalLabel: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  summaryTotalVal: { fontSize: 22, fontWeight: '900' },
});
