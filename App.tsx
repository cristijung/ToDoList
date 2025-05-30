// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import TodoScreen from './src/screens/TodoScreen'; // <--- SEM barra e caminho ajustado para incluir 'src'

export default function App() {
  return (
    <>
      <TodoScreen />
      <StatusBar style="auto" />
    </>
  );
}