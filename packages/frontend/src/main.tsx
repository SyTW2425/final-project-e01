import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store, persistor } from "./store/store";
import './index.css';
import App from './App.tsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Router>
    </Provider>
  </StrictMode>
);
