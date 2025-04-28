import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChakraProvider, Table, Thead, Tbody, Tr, Th, Td, Box, Heading } from '@chakra-ui/react';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/tasks');
        console.log(res.data); // デバッグ用: APIレスポンスを確認
        setTasks(res.data);
      } catch (error) {
        console.error('タスク取得エラー:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <ChakraProvider>
      <Box p={4}>
        <Heading as="h1" size="lg" mb={4}>
          サーバーの使用状況
        </Heading>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>ユーザー名</Th>
              <Th>タスク名</Th>
              <Th>CPU使用率</Th>
              <Th>メモリ使用量</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map((task, idx) => (
              <Tr key={idx}>
                <Td>{task.username}</Td>
                <Td>{task.task}</Td>
                <Td>{task.cpu}</Td>
                <Td>{task.memory}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </ChakraProvider>
  );
}

export default App;