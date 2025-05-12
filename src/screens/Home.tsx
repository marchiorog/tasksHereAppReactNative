import React, { useState, useCallback  } from 'react';
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
import { getAuth } from "firebase/auth";
import { query, where } from '../services/firebaseConfig'; 

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

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: item.cor }]}>
      <View style={styles.cardIcon}>
        <Text style={styles.icon}>{item.icone}</Text>
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardTime}>{item.horario}</Text>
      </View>
      <Ionicons name="checkmark-circle" size={28} color="green" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
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
    marginBottom: height * 0.04,
    textAlign: 'center',
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
});
