import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../components/Navigation';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { db } from '../services/firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

type AdicionarTarefaContaScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdicionarTarefa'>;

type Props = {
  navigation: AdicionarTarefaContaScreenNavigationProp;
};

export default function AdicionarTarefa({ navigation }: Props) {
  const [titulo, setTitulo] = useState('');
  const [icone, setIcone] = useState('');
  const [cor, setCor] = useState('#ffffff');
  const [data, setData] = useState('');

  const predefinedColors = [
    '#FFF4E3', '#E3FFE3', '#F9E6FF', 
    '#E3F9FF', '#FFFCE3', '#E3FFF4',
  ];

  const handleSave = async () => {
    try {
      const user = getAuth().currentUser;

      if (!user) {
        Alert.alert('Erro', 'Você precisa estar autenticado para salvar uma tarefa.');
        return;
      }

      await addDoc(collection(db, "tarefas"), {
        titulo: titulo,
        icone: icone,
        cor: cor,
        horario: data,
        userId: user.uid,
      });

      setTitulo('');
      setIcone('');
      setCor('#ffffff');
      setData('');

      Alert.alert('Sucesso', 'Lembrete salvo com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar o lembrete:', error);
      Alert.alert('Erro', 'Não foi possível salvar o lembrete.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <Text style={styles.label}>Nome:</Text>
          <CustomInput 
            value={titulo} 
            onChangeText={setTitulo} 
            placeholder="Digite o nome"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Ícone:</Text>       
          <CustomInput 
            value={icone} 
            onChangeText={setIcone} 
            placeholder="Escolha um emoji"
            placeholderTextColor="#aaa"
            keyboardType="default"
          />

          <Text style={styles.label}>Horário:</Text>
          <CustomInput 
            value={data}
            onChangeText={setData}
            placeholder="Digite um horário"
            placeholderTextColor="#aaa"
            keyboardType="default"
          />

          <Text style={styles.label}>Cor:</Text>
          <View style={styles.colorPalette}>
            {predefinedColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorOption, { backgroundColor: color, borderWidth: cor === color ? 3 : 0 }]}
                onPress={() => setCor(color)}
              />
            ))}
          </View>

          <CustomButton title="Salvar" style={styles.saveButton} onPress={handleSave} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    marginTop: height * 0.04,
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.04,
    textAlign: 'center',
  },
  label: {
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
    color: '#555',
  },
  colorPalette: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: height * 0.02,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  saveButton: {
    marginTop: height * 0.05,
  },
});
