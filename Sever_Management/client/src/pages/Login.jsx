import { Button, TextField, Box, Typography } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/api/login', { username, password }); // エンドポイントを確認
      if (res.data.success) {
        onLogin(username);
      }
    } catch (err) {
      setError('ログイン失敗: ユーザー名またはパスワードが違います');
    }
  };
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <Typography variant="h5">ログイン</Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2} width={300}>
          <TextField label="ユーザー名" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField label="パスワード" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained">ログイン</Button>
        </Box>
      </form>
    </Box>
  );
}
