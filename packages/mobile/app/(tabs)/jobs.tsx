import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { jobsApi } from "../../src/lib/api";
import { useAuthStore } from "../../src/store/authStore";

export default function JobsScreen() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadJobs = async () => {
    try {
      // Default to Pretoria coordinates
      const response = await jobsApi.getNearby({
        lat: -25.7479,
        lng: 28.2293,
        radius: 50,
      });
      setJobs(response.data);
    } catch (error: any) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadJobs();
    } else {
      router.replace("/login");
    }
  }, [token]);

  const onRefresh = () => {
    setRefreshing(true);
    loadJobs();
  };

  const renderJob = ({ item }: { item: any }) => {
    const job = item.job;
    return (
      <TouchableOpacity
        style={styles.jobCard}
        onPress={() => router.push(`/jobs/${job.id}`)}
      >
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.jobDescription} numberOfLines={2}>
          {job.description}
        </Text>
        <View style={styles.jobFooter}>
          <Text style={styles.jobPrice}>
            R{job.budgetAmount || "Negotiable"}
          </Text>
          <Text style={styles.jobDistance}>
            {item.distance?.toFixed(1)}km away
          </Text>
        </View>
        <Text style={styles.jobMeta}>
          {job.bidsCount || 0} bids • {job.viewsCount || 0} views
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading jobs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.job.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No jobs found nearby</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  list: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  jobPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0d9488",
  },
  jobDistance: {
    fontSize: 14,
    color: "#6b7280",
  },
  jobMeta: {
    fontSize: 12,
    color: "#9ca3af",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
  },
});

