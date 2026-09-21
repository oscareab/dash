import { useEffect, useState } from 'react';
import axios from 'axios';

import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
  const [authenticated, setAuthenticated] = useState(null);
  const [serverName, setServerName] = useState(null);
  const [authEnabled, setAuthEnabled] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await axios.get('/config');

        const name = response.data.name;
        const auth = response.data.authEnabled;

        setServerName(name);
        setAuthEnabled(auth);

        if (auth) {
          try {
            await axios.get('/check-auth');
            setAuthenticated(true);
          } catch {
            setAuthenticated(false);
          }
        } else {
          setAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to load config:', error);
        setAuthenticated(false);
      }
    };

    initialize();
  }, []);

  if (authenticated === null) {
    return <div>Loading...</div>;
  }

  if (authenticated) {
    return (
      <Dashboard
        onLogout={() => setAuthenticated(false)}
        serverName={serverName}
        authEnabled={authEnabled}
      />
    );
  }

  return <Login
    onLogin={() => setAuthenticated(true)}
    serverName={serverName}
  />;
}

export default App;
