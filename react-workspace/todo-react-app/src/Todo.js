import React, { useState, useEffect } from "react";
import { 
  ListItem, 
  ListItemText, 
  InputBase, 
  Checkbox,
  ListItemSecondaryAction,
  IconButton,
  Snackbar,
  Alert,
  Button
} from "@mui/material";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";

const Todo = (props) => {
  const [item, setItem] = useState({ ...props.item, completed: props.item.completed === true });
  const [readOnly, setReadOnly] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { editItem, deleteItem, showCompleteButton = false, isTodayList = false } = props;

  useEffect(() => {
    setItem({ ...props.item, completed: props.item.completed === true });
  }, [props.item]);

  // 제목을 수정할 때 호출되는 함수
  const editEventHandler = (e) => {
    setItem({...item, title: e.target.value}); // 제목 수정
  };

  // 제목 클릭 시 readOnly 상태 해제
  const turnOffReadOnly = () => {
    setReadOnly(false);
  };

  // 체크만 함 (완료한 일로는 안 넘어감)
  const checkboxEventHandler = (e) => {
    const updated = { ...item, done: e.target.checked, completed: item.completed };
    setItem(updated);
    editItem(updated);
  };

  // 완료 버튼: 완료한 일로 이동 (completed=true)
  const completeEventHandler = () => {
    const updated = { ...item, done: true, completed: true };
    setItem(updated);
    editItem(updated);
    setSnackbarMessage("완료한 일로 이동했습니다.");
    setOpenSnackbar(true);
  };

  // 삭제 이벤트 핸들러
  const deleteEventHandler = () => {
    deleteItem(item);
    setSnackbarMessage("할 일이 삭제되었습니다.");
    setOpenSnackbar(true);
  };

  // Enter 키 입력 시 readOnly 상태로 복귀하고 부모 컴포넌트에 수정된 내용 전달
  const turnOnReadOnly = (e) => {
    if (e.key === "Enter" && !readOnly) {
      setReadOnly(true);
      editItem(item); // 제목 수정 후 Enter를 누르면 부모 컴포넌트에 수정 내용 전달
      setSnackbarMessage("할 일이 수정되었습니다.");
      setOpenSnackbar(true);
    } else if (e.key === "Escape") {
      setReadOnly(true);  // Esc 키로 수정 취소
      setItem(props.item);  // 원래 제목으로 복구
    }
  };

  const isChecked = item.done === true;
  const showCompleteBtn = showCompleteButton && !item.completed;

  return (
    <>
      <ListItem
        sx={{
          ...(isTodayList && isChecked && {
            bgcolor: "#e3f2fd",
            borderRadius: 1,
            "& .MuiInputBase-input": { color: "rgba(0,0,0,0.87)" },
          }),
        }}
      >
        <Checkbox checked={isChecked} onChange={checkboxEventHandler} />
        <ListItemText>
          <InputBase
            inputProps={{
              "aria-label": "naked",
              readOnly: readOnly,
            }}
            onClick={turnOffReadOnly}
            onKeyDown={turnOnReadOnly}
            onChange={editEventHandler}
            type="text"
            id={item.id}
            name={item.id}
            value={item.title}
            multiline={true}
            fullWidth={true}
          />
        </ListItemText>
        <ListItemSecondaryAction sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {showCompleteBtn && (
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={completeEventHandler}
              sx={{ mr: 0.5 }}
            >
              완료
            </Button>
          )}
          <IconButton aria-label="Delete Todo" onClick={deleteEventHandler}>
            <DeleteOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Todo;