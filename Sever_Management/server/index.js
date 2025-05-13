const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const { getRunningTasks } = require('./utils/tasks'); // tasks.jsをインポート

const app = express();
const PORT = 3001;

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ユーザー登録エンドポイント
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'ユーザー名とパスワードが必要です' });
  }

  try {
    // ユーザー情報を読み込む
    const users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

    // ユーザー名が既に存在するか確認
    if (users.some((user) => user.username === username)) {
      return res.status(409).json({ message: 'このユーザー名は既に存在します' });
    }

    // 新しいユーザーを追加
    users.push({ username, password });
    fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));

    res.status(201).json({ message: 'ユーザーが登録されました' });
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ログインエンドポイント
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const USERS_FILE = './users.json';

  // ユーザー情報をファイルから読み込む
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false, message: '認証失敗' });
});

// タスク取得エンドポイント
app.get('/api/tasks', (req, res) => {
  const tasks = getRunningTasks();
  res.json(tasks);
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server launched → http://localhost:${PORT}`);
});