import StatusDeviceScreen from '../screens/StatusDeviceScreen';
import SensorDataScreen from '../screens/SensorDataScreen';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation, state }) {
  const currentRoute = state.routeNames[state.index];

  const MenuItem = ({ icon, label, routeName }) => {
    const isActive = currentRoute === routeName;
    return (
      <TouchableOpacity
        style={[styles.menuItem, isActive && styles.menuItemActive]}
        onPress={() => navigation.navigate(routeName)}
      >
        <Text style={styles.menuIcon}>{icon}</Text>
        <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <DrawerContentScrollView style={styles.drawerContainer}>
      {/* Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.drawerAvatar}>
          <Text style={styles.drawerAvatarText}>H</Text>
        </View>
        <Text style={styles.drawerName}>Hani Yustri</Text>
        <Text style={styles.drawerEmail}>hani@ppns.ac.id</Text>
      </View>

      {/* Menu Utama */}
      <View style={styles.section}>
        <MenuItem icon="🏠" label="Dashboard" routeName="Dashboard" />
      </View>

      {/* Monitoring */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>MONITORING</Text>
        <MenuItem icon="📡" label="Data Sensor" routeName="SensorData" />
        <MenuItem icon="📋" label="Riwayat Data" routeName="History" />
      </View>

      {/* Status Device */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>STATUS DEVICE</Text>
        <MenuItem icon="💡" label="Status LED" routeName="StatusDevice" />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Pengguna */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>PENGGUNA</Text>
        <MenuItem icon="👤" label="Profil" routeName="Profile" />
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.menuIcon}>🚪</Text>
          <Text style={[styles.menuLabel, { color: '#cc3333' }]}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.drawerFooter}>
        <Text style={styles.footerText}>🌿 SmartEnv Monitor</Text>
        <Text style={styles.footerSub}>Semester Genap 2025-2026</Text>
      </View>
    </DrawerContentScrollView>
  );
}

function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#ffffff',
          width: 260,
        },
        headerStyle: {
          backgroundColor: '#2d9e6b',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="SensorData" component={SensorDataScreen} options={{ title: 'Data Sensor' }} />
      <Drawer.Screen name="History" component={HistoryScreen} options={{ title: 'Riwayat Data' }} />
      <Drawer.Screen name="StatusDevice" component={StatusDeviceScreen} options={{ title: 'Status Device' }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil Saya' }} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={MainDrawer} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#2d9e6b',
    padding: 20,
    marginBottom: 8,
  },
  drawerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  drawerAvatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d9e6b',
  },
  drawerName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  drawerEmail: {
    color: '#c8f0dc',
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginTop: 12,
    marginBottom: 4,
    marginLeft: 8,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 2,
  },
  menuItemActive: {
    backgroundColor: '#f0faf4',
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 14,
    color: '#2d5a3d',
    fontWeight: '500',
  },
  menuLabelActive: {
    color: '#2d9e6b',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#e8f5ee',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  drawerFooter: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    color: '#2d9e6b',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 4,
  },
  footerSub: {
    color: '#94a3b8',
    fontSize: 11,
  },
});