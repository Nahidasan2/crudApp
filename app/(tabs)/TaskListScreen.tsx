import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";

const TaskListScreen = () => {
  const [tasks, setTasks] = useState<{ id: string; text: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Gunakan router untuk navigasi

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Tugas"));
        const taskList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          text: doc.data().text,
        }));
        setTasks(taskList);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "Tugas", id));
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List Tugas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskText}>{item.text}</Text>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Icon name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Kembali</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, marginTop: 20, textAlign: "center" },
  taskItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: 10, borderRadius: 5, marginVertical: 5, borderWidth: 1, borderColor: "#ddd" },
  taskText: { fontSize: 16 },
  backButton: { marginTop: 20, backgroundColor: "#007bff", padding: 10, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default TaskListScreen;
