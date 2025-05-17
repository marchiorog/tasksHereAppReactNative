import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import { db, collection, getDocs } from '../services/firebaseConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../components/Navigation';
import { getAuth, signOut } from "firebase/auth";
import { auth, query, where } from '../services/firebaseConfig';
import { deleteDoc, doc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function Home({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [tarefas, setTarefas] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchTarefas = async () => {
        try {
          const user = getAuth().currentUser;

          if (!user) {
            Alert.alert('Erro', 'Usuário não autenticado.');
            return;
          }

          const tarefasRef = collection(db, 'tarefas');
          const q = query(tarefasRef, where('userId', '==', user.uid));
          const tarefasSnapshot = await getDocs(q);
          const tarefasList = tarefasSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTarefas(tarefasList);
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível carregar as tarefas.');
          console.error(error);
        }
      };

      fetchTarefas();
    }, [])
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tarefas', id));
      setTarefas((prev) => prev.filter((tarefa) => tarefa.id !== id));
      Alert.alert('Sucesso', 'Tarefa concluída com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a tarefa.');
      console.error(error);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.navigate('Login');
    }).catch((error) => {
      console.error('Erro ao fazer logout: ', error);
    });
  };


  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: item.cor }]}>
      <View style={styles.cardIcon}>
        <Text style={styles.icon}>{item.icone}</Text>
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardTime}>{item.horario}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Ionicons name="checkmark-circle" size={28} color="green" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="exit-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <SearchBar
          placeholder="Buscar"
          value={search}
          onChangeText={(text) => setSearch(text)}
        />

        <Text style={styles.subtitle}>Minhas tarefas</Text>

        <FlatList
          data={tarefas.filter((tarefa) =>
            tarefa.titulo.toLowerCase().includes(search.toLowerCase())
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        />

        {/* Botão Flutuante */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AdicionarTarefa')}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    marginTop: height * 0.07,
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.07,
    textAlign: 'center',
    paddingLeft: height * 0.03,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subtitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    marginTop: height * 0.02,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    gap: 12,
  },
  icon: {
    fontSize: 22,
    textAlign: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  cardTime: {
    fontSize: 14,
    color: '#000',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 0,
    backgroundColor: '#00668B',
    width: 56,
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
