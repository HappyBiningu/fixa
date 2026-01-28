import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { authApi } from "../src/lib/api";

export default function RegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    fullName: "",
    role: "client",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.phone) {
      Alert.alert("Error", "Phone number is required");
      return;
    }

    setLoading(true);
    try {
      await authApi.register(formData);
      Alert.alert("Success", "Please verify your phone number");
      setStep(2);
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP code");
      return;
    }

    setLoading(true);
    try {
      await authApi.verifyPhone({ phone: formData.phone, code: otp });
      Alert.alert("Success", "Phone verified! Please login.");
      router.push("/login");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Fixa today</Text>

          <Text style={styles.label}>I want to</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                formData.role === "client" && styles.roleButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, role: "client" })}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  formData.role === "client" && styles.roleButtonTextActive,
                ]}
              >
                Post Jobs
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                formData.role === "worker" && styles.roleButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, role: "worker" })}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  formData.role === "worker" && styles.roleButtonTextActive,
                ]}
              >
                Find Work
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Phone Number *"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password (optional)"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.linkText}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Phone</Text>
        <Text style={styles.subtitle}>
          Enter the code sent to {formData.phone}
        </Text>

        <TextInput
          style={[styles.input, styles.otpInput]}
          placeholder="OTP Code"
          value={otp}
          onChangeText={(text) => setOtp(text.replace(/\D/g, ""))}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>
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
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  roleButtonActive: {
    borderColor: "#0d9488",
    backgroundColor: "#f0fdfa",
  },
  roleButtonText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "600",
  },
  roleButtonTextActive: {
    color: "#0d9488",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  otpInput: {
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 8,
  },
  button: {
    backgroundColor: "#0d9488",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  linkText: {
    color: "#0d9488",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

