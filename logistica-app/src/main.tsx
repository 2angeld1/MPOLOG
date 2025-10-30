import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Importa FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Agrega todos los iconos sólidos a la biblioteca
library.add(fas);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
