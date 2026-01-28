import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../src/store/authStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.name}>{user?.fullName || "User"}</Text>
          <Text style={styles.phone}>{user?.phone}</Text>
          <Text style={styles.role}>
            {user?.role === "client"
              ? "Client"
              : user?.role === "worker"
              ? "Worker"
              : "Both"}
          </Text>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>My Jobs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>My Bids</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0d9488",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: "#0d9488",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  menu: {
    gap: 12,
  },
  menuItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  menuText: {
    fontSize: 16,
    color: "#111827",
  },
  logoutButton: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
  },
  logoutText: {
    color: "#dc2626",
    fontWeight: "600",
  },
});

