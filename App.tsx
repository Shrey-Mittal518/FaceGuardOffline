import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

export default function App() {
  const [status, setStatus] = useState('Ready');
  const [liveness, setLiveness] = useState('Blink karo...');
  const [accessStatus, setAccessStatus] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setStatus('Scanning...');
    setLiveness('Blink karo...');
    setAccessStatus('');
    setTimeout(() => { setStatus('Face Detected ✓'); }, 1000);
    setTimeout(() => { setLiveness('LIVE PERSON ✓'); }, 2500);
    setTimeout(() => {
      setAccessStatus('ACCESS GRANTED - Shrey');
      setIsScanning(false);
    }, 4000);
  };

  const reset = () => {
    setStatus('Ready');
    setLiveness('Blink karo...');
    setAccessStatus('');
    setIsScanning(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🛡️ FaceGuard</Text>
        <Text style={styles.subHeader}>NHAI Offline Authentication</Text>
      </View>

      <View style={styles.cameraBox}>
        <Text style={styles.cameraIcon}>📷</Text>
        <Text style={styles.cameraText}>
          {isScanning ? '🔍 Scanning...' : 'Camera Feed'}
        </Text>
        {isScanning && <View style={styles.scanLine} />}
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Face Detection</Text>
          <Text style={[styles.statusValue, status.includes('✓') ? styles.green : styles.orange]}>
            {status}
          </Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Liveness</Text>
          <Text style={[styles.statusValue, liveness.includes('✓') ? styles.green : styles.orange]}>
            {liveness}
          </Text>
        </View>
      </View>

      {accessStatus !== '' && (
        <View style={[styles.accessBox, accessStatus.includes('GRANTED') ? styles.grantedBox : styles.deniedBox]}>
          <Text style={styles.accessText}>{accessStatus}</Text>
        </View>
      )}

      <View style={styles.offlineBadge}>
        <Text style={styles.offlineText}>🔴 OFFLINE MODE — No Network Required</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isScanning && styles.buttonDisabled]}
          onPress={startScan}
          disabled={isScanning}>
          <Text style={styles.buttonText}>
            {isScanning ? 'Scanning...' : '🔍 Start Authentication'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={reset}>
          <Text style={styles.resetText}>↺ Reset</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B3E' },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#00B4D8',
  },
  headerText: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  subHeader: { fontSize: 13, color: '#90E0EF', marginTop: 4 },
  cameraBox: {
    margin: 20,
    height: 220,
    backgroundColor: '#112244',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00B4D8',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cameraIcon: { fontSize: 50 },
  cameraText: { color: '#90E0EF', marginTop: 10, fontSize: 16 },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#00B4D8',
    top: '50%',
  },
  statusContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  statusCard: {
    width: '48%',
    backgroundColor: '#112244',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#00B4D8',
  },
  statusLabel: { color: '#8899AA', fontSize: 12, marginBottom: 6 },
  statusValue: { fontSize: 14, fontWeight: 'bold' },
  green: { color: '#2EC4B6' },
  orange: { color: '#F4A261' },
  accessBox: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  grantedBox: { backgroundColor: '#1A4A2A', borderWidth: 1, borderColor: '#2EC4B6' },
  deniedBox: { backgroundColor: '#4A1A1A', borderWidth: 1, borderColor: '#E05C5C' },
  accessText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  offlineBadge: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  offlineText: { color: '#8899AA', fontSize: 12 },
  buttonContainer: { padding: 20, marginTop: 10 },
  button: {
    backgroundColor: '#00B4D8',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#333' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  resetButton: { padding: 12, alignItems: 'center', marginTop: 8 },
  resetText: { color: '#8899AA', fontSize: 14 },
});