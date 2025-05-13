import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, AppBar, Toolbar } from '@mui/material';
import { Routes, Route, Link } from 'react-router-dom';
import Manage from './manage';
import Login from './Login';

export default function Home({ user, setUser, tasks }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {user ? (
        <>
          {/* ヘッダー */}
          <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #003366, #004080)' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                サーバー管理システム
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  color="inherit"
                  sx={{ mr: 2, borderColor: '#ffffff', color: '#ffffff' }}
                  component={Link}
                  to="/manage" // 管理者ページへのリンク
                >
                  管理者ページ
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setUser(null)}
                >
                  ログアウト
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

          {/* メインコンテンツ */}
          <Routes>
            <Route
              path="/"
              element={
                <Box sx={{ p: 3, textAlign: 'center', flexGrow: 1 }}>
                  <Typography variant="h4" gutterBottom>
                    ようこそ、{user}さん！
                  </Typography>
                  <TableContainer component={Paper} sx={{ backgroundColor: 'background.paper' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'text.primary' }}>ユーザー名</TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>タスク名</TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>CPU使用率</TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>メモリ使用量</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tasks.map((task, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ color: 'text.secondary' }}>{task.username}</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>{task.task}</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>{task.cpu}</TableCell>
                            <TableCell sx={{ color: 'text.secondary' }}>{task.memory}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              }
            />
            <Route path="/manage" element={<Manage />} />
          </Routes>
        </>
      ) : (
        <Login onLogin={setUser} />
      )}
    </Box>
  );
}
