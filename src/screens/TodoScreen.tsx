// src/screens/TodoScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para persistência
import AddTodo from '../components/AddTodo';
import TodoItem from '../components/TodoItem';
import { Todo } from '../types'; // Importe a interface

const STORAGE_KEY = '@MeuTodoList:todos';

const TodoScreen: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Carregar todos do AsyncStorage ao iniciar
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTodos !== null) {
          setTodos(JSON.parse(storedTodos));
        }
      } catch (e) {
        console.error("Failed to load todos.", e);
        Alert.alert("Erro", "Não foi possível carregar as tarefas.");
      }
    };
    loadTodos();
  }, []);

  // Salvar todos no AsyncStorage sempre que a lista mudar
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (e) {
        console.error("Failed to save todos.", e);
        Alert.alert("Erro", "Não foi possível salvar as tarefas.");
      }
    };
    saveTodos();
  }, [todos]);


  const handleAddTodo = (text: string) => {
    const newTodo: Todo = {
      id: Math.random().toString(36).substring(2, 15), // ID simples
      text,
      completed: false,
    };
    setTodos(prevTodos => [newTodo, ...prevTodos]); // Adiciona no início da lista
  };

  const handleToggleComplete = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => {
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
          },
          style: "destructive"
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Lista de Tarefas 📋</Text>
      <AddTodo onAdd={handleAddTodo} />
      {todos.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma tarefa ainda. Adicione uma! 🎉</Text>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTodo}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: Platform.OS === 'android' ? 25 : 50, // Ajuste para status bar
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#777',
  },
});

export default TodoScreen;