import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, Alert, ActivityIndicator } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../components/Navigation';
import { auth } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

type CadastroScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cadastro'>;

type Props = {
  navigation: CadastroScreenNavigationProp;
};

export default function Cadastro({ navigation }: Props) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCadastro = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      setIsLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      navigation.navigate('Login');
    } catch (error: any) {
      let message = 'Não foi possível criar a conta. Tente novamente.';

      if (error.code === 'auth/email-already-in-use') {
        message = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'E-mail inválido.';
      } else if (error.code === 'auth/weak-password') {
        message = 'A senha precisa ter pelo menos 6 caracteres.';
      }

      console.error('Erro ao criar conta:', error.message);
      Alert.alert('Erro', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Crie uma conta</Text>
          <CustomInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
          />
          <CustomInput
            value={password}
            onChangeText={setPassword}
            placeholder="Senha"
            placeholderTextColor="#aaa"
            secureTextEntry
          />
          {isLoading ? (
            <ActivityIndicator size="large" color="#68BAE8" />
          ) : (
            <CustomButton title="Criar" onPress={handleCadastro} />
          )}

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.registerText}>
              Já tem uma conta? <Text style={styles.link}>Faça o login</Text>
            </Text>
          </TouchableOpacity>
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
    paddingTop: height * 0.1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logo: {
    width: width * 1,
    height: height * 0.3
  },
  title: {
    color: '#ACBC89',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#000',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginBottom: 28,
    width: '100%',
    textAlign: 'left',
  },
  registerText: {
    marginTop: 20,
    color: '#858585',
    fontSize: width * 0.04,
    textAlign: 'center',
  },
  link: {
    color: '#68BAE8',
    fontWeight: 'bold',
  },
  footerContainer: {
    marginTop: height * 0.15,
  },
  linkSobre: {
    color: '#ACBC89',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nomeText: {
    marginTop: 20,
    color: '#858585',
    fontSize: width * 0.04,
    textAlign: 'center',
  },
});
