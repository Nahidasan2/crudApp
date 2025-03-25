import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";

const MyApp = () => {
  const [task, setTask] = useState("");
  const router = useRouter(); // Gunakan router untuk navigasi

  const addTask = async () => {
    if (task.trim() === "") {
      alert("Task tidak boleh kosong!");
      return;
    }

    try {
      await addDoc(collection(db, "Tugas"), { text: task });
      setTask("");
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Manager</Text>

      <TextInput
        style={styles.input}
        placeholder="Tambahkan tugas baru..."
        placeholderTextColor="black"
        value={task}
        onChangeText={setTask}
      />

      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>Tambah</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.listButton} onPress={() => router.push("/TaskListScreen")}>
        <Text style={styles.buttonText}>Lihat List</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  input: { backgroundColor: "white", color: "black", borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
  addButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 5, alignItems: "center" },
  listButton: { marginTop: 10, backgroundColor: "#007bff", padding: 10, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  addButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default MyApp;
