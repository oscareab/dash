import { useEffect, useState } from 'react';
import axios from 'axios';

import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    axios
      .get('/hello')
      .then(() => {
        setAuthenticated(true);
      })
      .catch(() => {
        setAuthenticated(false);
      });
  }, []);

  if (authenticated === null) {
    return <div>Loading...</div>;
  }

  if (authenticated) {
    return <Dashboard onLogout={() => setAuthenticated(false)}/>;
  }

  return <Login onLogin={() => setAuthenticated(true)} />;
}

export default App;