import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ImageBackground, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../config/firebaseConfig'; // Pastikan path sesuai struktur proyekmu

const MyApp = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<{ id: string; text: string }[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data dari Firestore saat aplikasi dimulai
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

  // Fungsi untuk menambahkan atau memperbarui tugas
  const addTask = async () => {
    if (task.trim() === '') {
      Alert.alert('Peringatan', 'Task tidak boleh kosong!');
      return;
    }

    try {
      if (editingId) {
        // Update tugas yang sudah ada
        const taskRef = doc(db, "Tugas", editingId);
        await updateDoc(taskRef, { text: task });

        setTasks(tasks.map(t => (t.id === editingId ? { id: editingId, text: task } : t)));
        setEditingId(null);
      } else {
        // Tambah tugas baru
        const docRef = await addDoc(collection(db, "Tugas"), { text: task });
        setTasks([...tasks, { id: docRef.id, text: task }]);
      }
      setTask('');
    } catch (error) {
      console.error("Error adding/updating task: ", error);
    }
  };

  // Fungsi untuk mengedit tugas
  const editTask = (id: string, text: string) => {
    setTask(text);
    setEditingId(id);
  };

  // Fungsi untuk menghapus tugas dari Firestore
  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "Tugas", id));
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  return (
    <ImageBackground
    //   source={require('../assets/images/yanagi.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>CRUD</Text>

        <TextInput
          style={styles.input}
          placeholder="Tambahkan tugas baru..."
          placeholderTextColor="black"
          value={task}
          onChangeText={setTask}
        />

        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>{editingId ? 'Update' : 'Tambah'}</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <Text style={styles.taskText}>{item.text}</Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => editTask(item.id, item.text)}>
                    <Icon name="edit" size={24} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteTask(item.id)}>
                    <Icon name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    color: 'black',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taskText: {
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default MyApp;