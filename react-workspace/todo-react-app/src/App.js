import './App.css';
import Todo from './Todo';
import React, { useEffect, useState } from 'react';
import { Box, Container, List, ListItem, ListItemText, Paper, Grid, Button, AppBar, Toolbar, Typography } from '@mui/material';
import AddTodo from './AddTodo';
import { call, signout } from './service/ApiService';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null); // 목록 로드 실패 시 한글 메시지

  // 초기 데이터를 API를 통해 불러옵니다.
  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    call("/todo", "GET", null)
      .then((response) => {
        if (response && response.data) {
          setItems(response.data);
        } else {
          console.error("No data returned from API");
        }
      })
      .catch((error) => {
        console.error("Failed to load items:", error);
        setLoadError(error.message || "목록을 불러올 수 없습니다.");
      })
      .finally(() => setLoading(false));
  }, []);

  // 아이템 추가
  const addItem = (item) => {
    item.done = false;
    item.completed = false;
    setLoading(true);
    call("/todo", "POST", item)
      .then((response) => {
        if (response && response.data) {
          setItems(response.data);
        } else {
          console.error("API response error", response);
        }
      })
      .catch((error) => alert(error.message || "추가 중 오류가 발생했습니다."))
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
      .catch((error) => alert(error.message || "삭제 중 오류가 발생했습니다."))
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
      .catch((error) => alert(error.message || "수정 중 오류가 발생했습니다."))
      .finally(() => setLoading(false)); // 로딩 상태 종료
  };

  // 오늘의 할 일: completed가 아닌 것 (체크만 된 항목도 여기 있고, 완료 버튼 누른 것만 completed)
  const todoList = items.filter((i) => !i.completed);
  const completedList = items.filter((i) => i.completed);

  // 메인: 오늘의 할 일 제목 → 입력칸 → todolist 순서 (패널 하나로 통일, 정가운데)
  let todaySection = (
    <Paper
      elevation={1}
      sx={{
        padding: 2,
        width: "100%",
        maxWidth: 560,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}>
        오늘의 할 일
      </Typography>
      <AddTodo addItem={addItem} />
      <List dense sx={{ mt: 1 }}>
        {todoList.length === 0 ? (
          <ListItem>
            <ListItemText secondary="할 일이 없습니다." />
          </ListItem>
        ) : (
          todoList.map((item) => (
            <Todo
              item={item}
              key={item.id}
              deleteItem={deleteItem}
              editItem={editItem}
              showCompleteButton
              isTodayList
            />
          ))
        )}
      </List>
    </Paper>
  );

  // 좌측: 완료한 일
  let completedSection = (
    <Paper
      sx={{
        padding: 2,
        bgcolor: "grey.50",
        minWidth: 280,
        width: 320,
        maxWidth: 380,
        height: "fit-content",
        position: "sticky",
        top: 16,
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 600, display: "block", pb: 1, color: "text.secondary" }}>
        완료한 일
      </Typography>
      <List dense disablePadding sx={{ "& .MuiListItem-root": { py: 0.25 } }}>
        {completedList.length === 0 ? (
          <ListItem>
            <ListItemText secondary="없음" primaryTypographyProps={{ variant: "caption" }} secondaryTypographyProps={{ variant: "caption" }} />
          </ListItem>
        ) : (
          completedList.map((item) => (
            <Todo
              item={item}
              key={item.id}
              deleteItem={deleteItem}
              editItem={editItem}
              isTodayList={false}
            />
          ))
        )}
      </List>
    </Paper>
  );

  let navigationBar = (
    <AppBar position="static" sx={{ backgroundColor: 'green' }}>
      <Toolbar>
        <Grid justifyContent={'space-between'} container>
          <Grid item>
            <Typography variant="h6">오늘의 할일</Typography>
          </Grid>
          <Grid item>
            <Button color="inherit" onClick={signout}>
              로그아웃
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );

  let todoListPage = (
    <div>
      {navigationBar}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          gap: 2,
          px: 2,
          py: 2,
          alignItems: "flex-start",
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ flexShrink: 0 }}>{completedSection}</Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", minWidth: 0 }}>
          {todaySection}
        </Box>
      </Box>
    </div>
  );

  // 로딩 중일 때
  let loadingPage = <h1> 로딩중... </h1>;
  // 목록 로드 실패 시 한글 메시지 표시
  let errorPage = loadError && (
    <div style={{ padding: 24, textAlign: "center", color: "#d32f2f" }}>
      <p><strong>{loadError}</strong></p>
      <p style={{ fontSize: 14 }}>백엔드(8081)가 실행 중인지 확인해 주세요.</p>
    </div>
  );

  let content;
  if (loading) {
    content = loadingPage;
  } else if (loadError) {
    content = (
      <div>
        {navigationBar}
        <Container maxWidth="md">{errorPage}</Container>
      </div>
    );
  } else {
    content = todoListPage;
  }

  return (
    <div className="App">{content}</div>
  );
}

export default App;
