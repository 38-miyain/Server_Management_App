import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, RadioGroup, FormControlLabel, Radio, Paper } from '@mui/material';

export default function Manage() {
  const [method, setMethod] = useState('invite'); // 'invite' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');
  const navigate = useNavigate();

  const handleGenerateInvite = () => {
    const token = Math.random().toString(36).substring(2, 15);
    const url = `http://localhost:5173/register?token=${token}`;
    setInviteUrl(url);
    alert('招待URLが生成されました！');
  };

  const handleRegisterUser = async () => {
    if (!username || !password) {
      alert('ユーザー名とパスワードを入力してください');
      return;
    }
  
    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      if (res.ok) {
        const data = await res.json(); // レスポンスをJSONとしてパース
        alert(data.message); // サーバーからのメッセージを表示
        setUsername('');
        setPassword('');
        navigate('/'); // ホームページにリダイレクト
      } else {
        const errorData = await res.json(); // エラーメッセージを取得
        alert(errorData.message || 'ユーザー登録に失敗しました');
      }
    } catch (error) {
      console.error('ユーザー登録エラー:', error);
      alert('エラーが発生しました');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#1b1b1b',
        color: '#ffffff',
        gap: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        管理者ページ
      </Typography>
      <Paper sx={{ p: 3, width: '80%', maxWidth: 600, backgroundColor: '#2a2a2a' }}>
        <Typography variant="h6" gutterBottom>
          ユーザー追加方法を選択してください
        </Typography>
        <RadioGroup
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          sx={{ mb: 3 }}
        >
          <FormControlLabel value="invite" control={<Radio />} label="招待URLを作成する" />
          <FormControlLabel value="register" control={<Radio />} label="ユーザー名とパスワードを登録する" />
        </RadioGroup>

        {method === 'invite' && (
          <Box>
            <Button variant="contained" color="primary" onClick={handleGenerateInvite}>
              招待URLを生成
            </Button>
            {inviteUrl && (
              <Typography variant="body1" sx={{ mt: 2, wordBreak: 'break-word' }}>
                招待URL: <a href={inviteUrl} style={{ color: '#64b5f6' }}>{inviteUrl}</a>
              </Typography>
            )}
          </Box>
        )}

        {method === 'register' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="ユーザー名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              InputLabelProps={{ style: { color: '#b0b0b0' } }}
              sx={{ input: { color: '#ffffff' } }}
            />
            <TextField
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              InputLabelProps={{ style: { color: '#b0b0b0' } }}
              sx={{ input: { color: '#ffffff' } }}
            />
            <Button variant="contained" color="primary" onClick={handleRegisterUser}>
              ユーザーを登録
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}