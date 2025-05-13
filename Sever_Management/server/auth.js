const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = path.join(__dirname, 'users.json'); // 絶対パスを指定

// ログインエンドポイント
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'ユーザー名とパスワードが必要です' });
  }

  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    console.log('Loaded users:', users);

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      console.log('ログイン成功:', username);
      res.json({ success: true, message: 'ログイン成功' });
    } else {
      console.log('ログイン失敗: 無効な資格情報');
      res.status(401).json({ success: false, message: 'ユーザー名またはパスワードが無効です' });
    }
  } catch (error) {
    console.error('ログインエラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ユーザー登録エンドポイント
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'ユーザー名とパスワードが必要です' });
  }

  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));

    if (users.some(user => user.username === username)) {
      console.log('登録失敗: ユーザー名が既に存在します');
      return res.status(409).json({ message: 'このユーザー名は既に存在します' });
    }

    users.push({ username, password });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    console.log('ユーザーが登録されました:', { username, password });
    res.status(201).json({ message: 'ユーザーが登録されました' });
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// サーバー起動
app.listen(3001, () => {
  console.log('Auth server running on port 3001');
});