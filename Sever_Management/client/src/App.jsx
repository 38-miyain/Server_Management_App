import { useEffect, useState } from 'react';
import axios from 'axios';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import darkTheme from './theme';
import Main from './pages/Home';

function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        try {
          const res = await axios.get('http://localhost:3001/api/tasks');
          setTasks(res.data);
        } catch (error) {
          console.error('タスク取得エラー:', error);
        }
      };

      fetchTasks();
    }
  }, [user]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Main user={user} setUser={setUser} tasks={tasks} />
      </Router>
    </ThemeProvider>
  );
}

export default App;