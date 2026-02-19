import './App.css';
import Todo from './Todo';
import React, { useEffect, useState } from 'react';
import { Container, List, Paper, Grid, Button, AppBar, Toolbar, Typography } from '@mui/material';
import AddTodo from './AddTodo';
import { call, signout } from './service/ApiService';

function App() {
  const [items, setItems] = useState([]); // 할 일 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // 초기 데이터를 API를 통해 불러옵니다.
  useEffect(() => {
    setLoading(true); // 로딩 상태 시작
    call("/todo", "GET", null)
      .then((response) => {
        if (response && response.data) {
          setItems(response.data);
        } else {
          console.error("No data returned from API");
        }
      })
      .catch((error) => console.error("Failed to load items:", error))
      .finally(() => setLoading(false)); // 로딩 상태 종료
  }, []);

  // 아이템 추가
  const addItem = (item) => {
    item.done = false;

    setLoading(true); // 로딩 상태 시작
    call("/todo", "POST", item)
      .then((response) => {
        if (response && response.data) {
          setItems(response.data);
        } else {
          console.error("API response error", response);
        }
      })
      .catch((error) => console.error("API request error", error))
      .finally(() => setLoading(false)); // 로딩 상태 종료
  };

  // 아이템 삭제
  const deleteItem = (item) => {
    setLoading(true); // 로딩 상태 시작
    call("/todo", "DELETE", item)
      .then((response) => {
        if (response && response.data) {
          setItems(response.data);
        } else {
          console.error("Failed to delete item", response);
        }
      })
      .catch((error) => {
        console.error("Error deleting item", error);
      })
      .finally(() => setLoading(false)); // 로딩 상태 종료
  };

  // 아이템 수정
  const editItem = (item) => {
    setLoading(true); // 로딩 상태 시작
    call("/todo", "PUT", item)
      .then((response) => {
        if (response && response.data) {
          setItems(response.data);
        } else {
          console.error("아이템 업데이트 실패", response);
        }
      })
      .catch((error) => {
        console.error("업데이트 에러", error);
      })
      .finally(() => setLoading(false)); // 로딩 상태 종료
  };

  let todoItems = items.length > 0 && (
    <Paper style={{ margin: 16 }}>
      <List>
        {items.map((item) => (
          <Todo
            item={item}
            key={item.id}
            deleteItem={deleteItem}
            editItem={editItem}
          />
        ))}
      </List>
    </Paper>
  );

  // navigationBar 추가
  let navigationBar = (
    <AppBar position="static" sx={{ backgroundColor: 'green' }}>
      <Toolbar>
        <Grid justifyContent={'space-between'} container>
          <Grid item>
            <Typography variant="h6">오늘의 할일</Typography>
          </Grid>
          <Grid item>
            <Button color="inherit" raised onClick={signout}>
              로그아웃
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );

  // 로딩중이 아닐 때 렌더링할 부분
  let todoListPage = (
    <div>
      {navigationBar} {/* 네비게이션 바 렌더링 */}
      <Container maxWidth="md">
        <AddTodo addItem={addItem} />
        <div className="TodoList">{todoItems}</div>
      </Container>
    </div>
  );

  // 로딩 중일 때 렌더링 할 부분
  let loadingPage = <h1> 로딩중... </h1>;

  // 로딩 상태에 따라 렌더링할 내용을 결정
  let content = loading ? loadingPage : todoListPage;

  return (
    <div className="App">{content}</div>
  );
}

export default App;
