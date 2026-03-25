import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { School, getZipcodes, getSchoolsByZipcode } from '@/data/bay-area-schools';

const ROOF_COLORS = [
  { label: 'White', color: '#f0f0f0', cooling: 8 },
  { label: 'Light Gray', color: '#c0c0c0', cooling: 5 },
  { label: 'Tan', color: '#d2b48c', cooling: 3 },
  { label: 'Brown', color: '#8B4513', cooling: 1 },
  { label: 'Dark Gray', color: '#505050', cooling: 0 },
  { label: 'Black', color: '#1a1a1a', cooling: -2 },
];

const MAX_TREES = 8;
const COOLING_PER_TREE = 1.5; // °F per tree

type GamePhase = 'zipcode' | 'school' | 'simulation';

export default function LearningGamesScreen() {
  const [phase, setPhase] = useState<GamePhase>('zipcode');
  const [zipcodeQuery, setZipcodeQuery] = useState('');
  const [selectedZipcode, setSelectedZipcode] = useState('');
  const [matchingSchools, setMatchingSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [roofColorIndex, setRoofColorIndex] = useState(4); // default: dark gray
  const [treeCount, setTreeCount] = useState(0);

  const allZipcodes = useMemo(() => getZipcodes(), []);
  const matchingZipcodes = zipcodeQuery.length > 0
    ? allZipcodes.filter((z) => z.startsWith(zipcodeQuery))
    : [];

  const roofColor = ROOF_COLORS[roofColorIndex];

  const currentTemp = useMemo(() => {
    if (!selectedSchool) return 0;
    const base = selectedSchool.baseTemp;
    const roofCooling = roofColor.cooling;
    const treeCooling = treeCount * COOLING_PER_TREE;
    return Math.round((base - roofCooling - treeCooling) * 10) / 10;
  }, [selectedSchool, roofColor, treeCount]);

  const tempColor = useMemo(() => {
    if (currentTemp >= 95) return '#dc2626';
    if (currentTemp >= 90) return '#ea580c';
    if (currentTemp >= 85) return '#f59e0b';
    if (currentTemp >= 80) return '#eab308';
    if (currentTemp >= 75) return '#84cc16';
    return '#22c55e';
  }, [currentTemp]);

  function selectZipcode(zip: string) {
    setSelectedZipcode(zip);
    setMatchingSchools(getSchoolsByZipcode(zip));
    setPhase('school');
  }

  function selectSchool(school: School) {
    setSelectedSchool(school);
    setRoofColorIndex(4);
    setTreeCount(0);
    setPhase('simulation');
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

  // --- Zipcode entry phase ---
  if (phase === 'zipcode') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <Text style={styles.heading}>Find Your School</Text>
          <Text style={styles.description}>
            Enter a Bay Area zipcode to find schools in that area.
          </Text>

          <TextInput
            style={styles.zipcodeInput}
            placeholder="Enter zipcode (e.g. 94112)"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            maxLength={5}
            value={zipcodeQuery}
            onChangeText={setZipcodeQuery}
          />

          {zipcodeQuery.length >= 1 && (
            <View style={styles.resultsList}>
              {matchingZipcodes.length > 0 ? (
                matchingZipcodes.map((zip) => (
                  <TouchableOpacity
                    key={zip}
                    style={styles.zipItem}
                    onPress={() => selectZipcode(zip)}
                  >
                    <Text style={styles.zipItemText}>{zip}</Text>
                    <Text style={styles.zipItemArrow}>→</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResults}>
                  No schools found for this zipcode. Try another Bay Area zipcode.
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- School selection phase ---
  if (phase === 'school') {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backText}>← Change Zipcode</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Schools in {selectedZipcode}</Text>
          <Text style={styles.description}>
            Choose a school to start the cooling simulation.
          </Text>

          <View style={styles.resultsList}>
            {matchingSchools.map((school, i) => (
              <TouchableOpacity
                key={`${school.name}-${i}`}
                style={styles.schoolItem}
                onPress={() => selectSchool(school)}
              >
                <View>
                  <Text style={styles.schoolName}>{school.name}</Text>
                  <Text style={styles.schoolCity}>{school.city}</Text>
                </View>
                <Text style={styles.schoolTemp}>{school.baseTemp}°F</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- Simulation phase ---
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>← Choose Another School</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>{selectedSchool?.name}</Text>
        <Text style={styles.schoolCity}>{selectedSchool?.city} · {selectedSchool?.zipcode}</Text>

        {/* Temperature Display */}
        <View style={[styles.tempDisplay, { borderColor: tempColor }]}>
          <Text style={styles.tempLabel}>Current Temperature</Text>
          <Text style={[styles.tempValue, { color: tempColor }]}>{currentTemp}°F</Text>
          <Text style={styles.tempBaseline}>
            Baseline: {selectedSchool?.baseTemp}°F
          </Text>
          {currentTemp < (selectedSchool?.baseTemp ?? 0) && (
            <Text style={styles.tempSaved}>
              Cooled by {((selectedSchool?.baseTemp ?? 0) - currentTemp).toFixed(1)}°F!
            </Text>
          )}
        </View>

        {/* School Building Visual */}
        <View style={styles.sceneContainer}>
          <View style={styles.sky}>
            <Text style={styles.sunEmoji}>☀️</Text>
          </View>
          <View style={styles.groundScene}>
            {/* Trees on left */}
            <View style={styles.treeSide}>
              {Array.from({ length: Math.min(treeCount, 4) }).map((_, i) => (
                <View key={`left-${i}`} style={styles.tree}>
                  <View style={styles.treeTop} />
                  <View style={styles.treeTrunk} />
                </View>
              ))}
            </View>

            {/* Building */}
            <View style={styles.building}>
              <View style={[styles.roof, { backgroundColor: roofColor.color }]}>
                <View style={[styles.roofPeak, { borderBottomColor: roofColor.color }]} />
              </View>
              <View style={styles.buildingBody}>
                <View style={styles.windowRow}>
                  <View style={styles.window} />
                  <View style={styles.window} />
                  <View style={styles.window} />
                </View>
                <View style={styles.windowRow}>
                  <View style={styles.window} />
                  <View style={styles.door} />
                  <View style={styles.window} />
                </View>
              </View>
            </View>

            {/* Trees on right */}
            <View style={styles.treeSide}>
              {Array.from({ length: Math.max(treeCount - 4, 0) }).map((_, i) => (
                <View key={`right-${i}`} style={styles.tree}>
                  <View style={styles.treeTop} />
                  <View style={styles.treeTrunk} />
                </View>
              ))}
            </View>
          </View>
          <View style={styles.ground} />
        </View>

        {/* Roof Color Control */}
        <View style={styles.controlSection}>
          <Text style={styles.controlTitle}>Roof Color</Text>
          <Text style={styles.controlHint}>
            Lighter roofs reflect sunlight and keep buildings cooler
          </Text>
          <View style={styles.colorOptions}>
            {ROOF_COLORS.map((rc, i) => (
              <TouchableOpacity
                key={rc.label}
                style={[
                  styles.colorOption,
                  { backgroundColor: rc.color },
                  i === roofColorIndex && styles.colorOptionSelected,
                  rc.color === '#f0f0f0' && { borderWidth: 1, borderColor: '#ccc' },
                ]}
                onPress={() => setRoofColorIndex(i)}
              >
                {i === roofColorIndex && (
                  <Text style={[
                    styles.colorCheck,
                    { color: i <= 2 ? '#333' : '#fff' },
                  ]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.colorLabel}>
            {roofColor.label} roof ({roofColor.cooling > 0 ? `-${roofColor.cooling}` : `+${Math.abs(roofColor.cooling)}`}°F)
          </Text>
        </View>

        {/* Tree Control */}
        <View style={styles.controlSection}>
          <Text style={styles.controlTitle}>Trees Around School</Text>
          <Text style={styles.controlHint}>
            Trees provide shade and cool the air through evapotranspiration
          </Text>
          <View style={styles.treeControl}>
            <TouchableOpacity
              style={[styles.treeButton, treeCount === 0 && styles.treeButtonDisabled]}
              onPress={() => setTreeCount(Math.max(0, treeCount - 1))}
              disabled={treeCount === 0}
            >
              <Text style={styles.treeButtonText}>−</Text>
            </TouchableOpacity>
            <View style={styles.treeCountDisplay}>
              <Text style={styles.treeCountText}>{treeCount}</Text>
              <Text style={styles.treeCountLabel}>trees</Text>
            </View>
            <TouchableOpacity
              style={[styles.treeButton, treeCount === MAX_TREES && styles.treeButtonDisabled]}
              onPress={() => setTreeCount(Math.min(MAX_TREES, treeCount + 1))}
              disabled={treeCount === MAX_TREES}
            >
              <Text style={styles.treeButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.colorLabel}>
            {treeCount} trees (−{(treeCount * COOLING_PER_TREE).toFixed(1)}°F)
          </Text>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Impact Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Base temperature</Text>
            <Text style={styles.summaryValue}>{selectedSchool?.baseTemp}°F</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Roof color effect</Text>
            <Text style={[styles.summaryValue, { color: '#2b6cb0' }]}>
              {roofColor.cooling > 0 ? '−' : '+'}{Math.abs(roofColor.cooling)}°F
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tree shade effect</Text>
            <Text style={[styles.summaryValue, { color: '#22863a' }]}>
              −{(treeCount * COOLING_PER_TREE).toFixed(1)}°F
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.summaryTotalLabel}>Result</Text>
            <Text style={[styles.summaryTotalValue, { color: tempColor }]}>{currentTemp}°F</Text>
          </View>
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: '#718096',
    marginBottom: 20,
    lineHeight: 22,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 15,
    color: '#2b6cb0',
    fontWeight: '600',
  },
  zipcodeInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: '#2d3748',
    letterSpacing: 2,
  },
  resultsList: {
    marginTop: 16,
    gap: 8,
  },
  zipItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  zipItemText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    letterSpacing: 1,
  },
  zipItemArrow: {
    fontSize: 18,
    color: '#2b6cb0',
  },
  noResults: {
    fontSize: 15,
    color: '#a0aec0',
    textAlign: 'center',
    padding: 20,
  },
  schoolItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  schoolCity: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  schoolTemp: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e53e3e',
  },

  // Temperature Display
  tempDisplay: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tempLabel: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tempValue: {
    fontSize: 56,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  tempBaseline: {
    fontSize: 13,
    color: '#a0aec0',
  },
  tempSaved: {
    fontSize: 15,
    color: '#22863a',
    fontWeight: '600',
    marginTop: 6,
  },

  // Building Visual
  sceneContainer: {
    backgroundColor: '#87CEEB',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    height: 220,
  },
  sky: {
    height: 50,
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingTop: 8,
  },
  sunEmoji: {
    fontSize: 32,
  },
  groundScene: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  treeSide: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    minWidth: 50,
    justifyContent: 'center',
  },
  tree: {
    alignItems: 'center',
  },
  treeTop: {
    width: 28,
    height: 36,
    backgroundColor: '#22863a',
    borderRadius: 14,
  },
  treeTrunk: {
    width: 6,
    height: 14,
    backgroundColor: '#8B4513',
  },
  building: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  roof: {
    width: 140,
    height: 24,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  roofPeak: {
    position: 'absolute',
    top: -16,
    left: 30,
    width: 0,
    height: 0,
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  buildingBody: {
    width: 140,
    height: 80,
    backgroundColor: '#d4a574',
    padding: 8,
    justifyContent: 'space-around',
  },
  windowRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  window: {
    width: 24,
    height: 24,
    backgroundColor: '#87CEEB',
    borderWidth: 2,
    borderColor: '#8B7355',
  },
  door: {
    width: 22,
    height: 30,
    backgroundColor: '#8B4513',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginTop: -6,
  },
  ground: {
    height: 30,
    backgroundColor: '#6aaa3a',
  },

  // Roof Color Controls
  controlSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  controlTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 4,
  },
  controlHint: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 14,
    lineHeight: 18,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#2b6cb0',
  },
  colorCheck: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  colorLabel: {
    fontSize: 14,
    color: '#4a5568',
    fontWeight: '500',
  },

  // Tree Controls
  treeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 10,
  },
  treeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2b6cb0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  treeButtonDisabled: {
    backgroundColor: '#cbd5e0',
  },
  treeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 28,
  },
  treeCountDisplay: {
    alignItems: 'center',
  },
  treeCountText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#22863a',
  },
  treeCountLabel: {
    fontSize: 13,
    color: '#718096',
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 15,
    color: '#4a5568',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2d3748',
  },
  summaryTotal: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
    marginTop: 4,
    paddingTop: 12,
  },
  summaryTotalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2d3748',
  },
  summaryTotalValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
