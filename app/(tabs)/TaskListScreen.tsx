import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";

const TaskListScreen = () => {
  const [tasks, setTasks] = useState<{ id: string; text: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newText, setNewText] = useState("");
  const router = useRouter();

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

  const startEditing = (id: string, text: string) => {
    setEditingTask(id);
    setNewText(text);
  };

  const saveTask = async (id: string) => {
    if (newText.trim() === "") {
      alert("Tugas tidak boleh kosong!");
      return;
    }
    try {
      await updateDoc(doc(db, "Tugas", id), { text: newText });
      setTasks(tasks.map(task => (task.id === id ? { ...task, text: newText } : task)));
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task: ", error);
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
              {editingTask === item.id ? (
                <TextInput
                  style={styles.input}
                  value={newText}
                  onChangeText={setNewText}
                  autoFocus
                />
              ) : (
                <Text style={styles.taskText}>{item.text}</Text>
              )}

              <View style={styles.buttons}>
                {editingTask === item.id ? (
                  <TouchableOpacity onPress={() => saveTask(item.id)}>
                    <Icon name="save" size={24} color="green" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => startEditing(item.id, item.text)}>
                    <Icon name="edit" size={24} color="blue" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                  <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
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
  taskText: { fontSize: 16, flex: 1 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 5, borderRadius: 5, flex: 1 },
  buttons: { flexDirection: "row", gap: 10 },
  backButton: { marginTop: 20, backgroundColor: "#007bff", padding: 10, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default TaskListScreen;
