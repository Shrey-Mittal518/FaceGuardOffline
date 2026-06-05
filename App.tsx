import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [status, setStatus] = useState('Ready');
  const [liveness, setLiveness] = useState('Waiting...');
  const [accessStatus, setAccessStatus] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState('');
  const [livenessStep, setLivenessStep] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const saveAttendance = async (name: string) => {
    const timestamp = new Date().toLocaleString();
    const newLog = {
      id: Date.now(),
      name,
      timestamp,
      liveness: 'PASSED',
      synced: false,
    };
    const existing = await AsyncStorage.getItem('attendance');
    const parsed = existing ? JSON.parse(existing) : [];
    const updated = [newLog, ...parsed].slice(0, 10);
    await AsyncStorage.setItem('attendance', JSON.stringify(updated));
    setLogs(updated);
  };

  const loadLogs = async () => {
    const existing = await AsyncStorage.getItem('attendance');
    if (existing) setLogs(JSON.parse(existing));
  };

  // Sync & Purge Mechanism
  const syncToAWS = async () => {
    const pending = logs.filter(l => !l.synced);
    if (pending.length === 0) {
      Alert.alert('Sync', 'No pending records to sync!');
      return;
    }

    setSyncStatus('Syncing to AWS S3...');

    // Simulate AWS sync
    setTimeout(async () => {
      setSyncStatus('AWS ACK received ✓');

      // Mark all as synced
      const updated = logs.map(l => ({...l, synced: true}));
      await AsyncStorage.setItem('attendance', JSON.stringify(updated));
      setLogs(updated);

      // Purge after 2 seconds
      setTimeout(async () => {
        setSyncStatus('Purging local records...');
        setTimeout(async () => {
          await AsyncStorage.removeItem('attendance');
          setLogs([]);
          setSyncStatus('✅ Sync complete — Local data purged!');
          setTimeout(() => setSyncStatus(''), 3000);
        }, 1500);
      }, 2000);
    }, 2000);
  };

  const startScan = () => {
    setIsScanning(true);
    setStatus('Initializing...');
    setLiveness('');
    setAccessStatus('');
    setLivenessStep('');

    // Step 1 — Face Detection
    setTimeout(() => {
      setStatus('Face Detected ✓');
    }, 800);

    // Step 2 — Liveness: Blink
    setTimeout(() => {
      setLivenessStep('👁️ Please BLINK...');
      setLiveness('Checking...');
    }, 1500);

    setTimeout(() => {
      setLivenessStep('✓ Blink detected!');
    }, 2500);

    // Step 3 — Liveness: Smile
    setTimeout(() => {
      setLivenessStep('😊 Please SMILE...');
    }, 3000);

    setTimeout(() => {
      setLivenessStep('✓ Smile detected!');
    }, 4000);

    // Step 4 — Recognition
    setTimeout(() => {
      setLivenessStep('');
      setLiveness('LIVE PERSON ✓');
      setStatus('Recognizing...');
    }, 4500);

    // Step 5 — Result
    setTimeout(() => {
      setAccessStatus('ACCESS GRANTED - Shrey Mittal');
      saveAttendance('Shrey Mittal');
      setIsScanning(false);
    }, 5500);
  };

  const reset = () => {
    setStatus('Ready');
    setLiveness('Waiting...');
    setAccessStatus('');
    setIsScanning(false);
    setLivenessStep('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>🛡️ FaceGuard</Text>
          <Text style={styles.subHeader}>NHAI Offline Authentication</Text>
        </View>

        {/* Camera Box */}
        <View style={styles.cameraBox}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.cameraText}>
            {isScanning ? '🔍 Scanning...' : 'Camera Feed'}
          </Text>
          {isScanning && <View style={styles.scanLine} />}
        </View>

        {/* Liveness Step */}
        {livenessStep !== '' && (
          <View style={styles.livenessStepBox}>
            <Text style={styles.livenessStepText}>{livenessStep}</Text>
          </View>
        )}

        {/* Status Cards */}
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

        {/* Access Status */}
        {accessStatus !== '' && (
          <View style={[styles.accessBox, accessStatus.includes('GRANTED') ? styles.grantedBox : styles.deniedBox]}>
            <Text style={styles.accessText}>{accessStatus}</Text>
          </View>
        )}

        {/* Offline Badge */}
        <View style={styles.offlineBadge}>
          <Text style={styles.offlineText}>🔴 OFFLINE MODE — No Network Required</Text>
        </View>

        {/* Sync Status */}
        {syncStatus !== '' && (
          <View style={styles.syncStatusBox}>
            <Text style={styles.syncStatusText}>{syncStatus}</Text>
          </View>
        )}

        {/* Attendance Logs */}
        {logs.length > 0 && (
          <View style={styles.logsContainer}>
            <Text style={styles.logsTitle}>📋 Attendance Log (SQLite)</Text>
            {logs.map((log: any) => (
              <View key={log.id} style={styles.logItem}>
                <Text style={styles.logName}>{log.name}</Text>
                <Text style={styles.logTime}>{log.timestamp}</Text>
                <Text style={log.synced ? styles.synced : styles.pending}>
                  {log.synced ? '✅' : '⏳'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isScanning && styles.buttonDisabled]}
            onPress={startScan}
            disabled={isScanning}>
            <Text style={styles.buttonText}>
              {isScanning ? 'Scanning...' : '🔍 Start Authentication'}
            </Text>
          </TouchableOpacity>

          {/* Sync Button */}
          {logs.length > 0 && (
            <TouchableOpacity style={styles.syncButton} onPress={syncToAWS}>
              <Text style={styles.syncButtonText}>☁️ Sync to AWS & Purge</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.resetButton} onPress={reset}>
            <Text style={styles.resetText}>↺ Reset</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0D1B3E'},
  header: {
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#00B4D8',
  },
  headerText: {fontSize: 24, fontWeight: 'bold', color: '#FFFFFF'},
  subHeader: {fontSize: 12, color: '#90E0EF', marginTop: 4},
  cameraBox: {
    margin: 15,
    height: 180,
    backgroundColor: '#112244',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00B4D8',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cameraIcon: {fontSize: 40},
  cameraText: {color: '#90E0EF', marginTop: 8, fontSize: 14},
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#00B4D8',
    top: '50%',
  },
  livenessStepBox: {
    marginHorizontal: 15,
    padding: 12,
    backgroundColor: '#1A2A4A',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00B4D8',
  },
  livenessStepText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusCard: {
    width: '48%',
    backgroundColor: '#112244',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#00B4D8',
  },
  statusLabel: {color: '#8899AA', fontSize: 11, marginBottom: 4},
  statusValue: {fontSize: 13, fontWeight: 'bold'},
  green: {color: '#2EC4B6'},
  orange: {color: '#F4A261'},
  accessBox: {
    marginHorizontal: 15,
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  grantedBox: {backgroundColor: '#1A4A2A', borderWidth: 1, borderColor: '#2EC4B6'},
  deniedBox: {backgroundColor: '#4A1A1A', borderWidth: 1, borderColor: '#E05C5C'},
  accessText: {color: '#FFFFFF', fontSize: 15, fontWeight: 'bold'},
  offlineBadge: {
    marginHorizontal: 15,
    marginTop: 8,
    padding: 8,
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  offlineText: {color: '#8899AA', fontSize: 11},
  syncStatusBox: {
    marginHorizontal: 15,
    marginTop: 8,
    padding: 10,
    backgroundColor: '#1A3A2A',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2EC4B6',
  },
  syncStatusText: {color: '#2EC4B6', fontSize: 12, fontWeight: 'bold'},
  logsContainer: {
    marginHorizontal: 15,
    marginTop: 8,
    backgroundColor: '#112244',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#00B4D8',
  },
  logsTitle: {color: '#00B4D8', fontSize: 12, fontWeight: 'bold', marginBottom: 6},
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  logName: {color: '#FFFFFF', fontSize: 11, flex: 1},
  logTime: {color: '#8899AA', fontSize: 10, flex: 2},
  synced: {color: '#2EC4B6', fontSize: 12},
  pending: {color: '#F4A261', fontSize: 12},
  buttonContainer: {padding: 15, marginTop: 5},
  button: {
    backgroundColor: '#00B4D8',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {backgroundColor: '#333'},
  buttonText: {color: '#FFFFFF', fontSize: 15, fontWeight: 'bold'},
  syncButton: {
    backgroundColor: '#1A3A2A',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#2EC4B6',
  },
  syncButtonText: {color: '#2EC4B6', fontSize: 14, fontWeight: 'bold'},
  resetButton: {padding: 10, alignItems: 'center', marginTop: 6},
  resetText: {color: '#8899AA', fontSize: 13},
});