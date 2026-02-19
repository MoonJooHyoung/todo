import React, { useState, useEffect } from "react";
import { 
  ListItem, 
  ListItemText, 
  InputBase, 
  Checkbox,
  ListItemSecondaryAction,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";

const Todo = (props) => {
  const [item, setItem] = useState(props.item);
  const [readOnly, setReadOnly] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { editItem, deleteItem } = props;

  // 부모로부터 받은 item이 변경될 때 상태 동기화
  useEffect(() => {
    setItem(props.item);
  }, [props.item]);

  // 제목을 수정할 때 호출되는 함수
  const editEventHandler = (e) => {
    setItem({...item, title: e.target.value}); // 제목 수정
  };

  // 제목 클릭 시 readOnly 상태 해제
  const turnOffReadOnly = () => {
    setReadOnly(false);
  };

  // Checkbox 상태 변경 함수
  const checkboxEventHandler = (e) => {
    item.done = e.target.checked; 
    editItem(item); // 수정된 아이템을 부모로 전달
    // 서버와 동기화하는 API 호출 예시
    // updateItemStatus(item.id, item.done);
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

  return (
    <ListItem>
      {/* checkboxEventHandler 함수로 체크박스 상태 제어 */}
      <Checkbox checked={item.done} onChange={checkboxEventHandler} />
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
      <ListItemSecondaryAction>
        <IconButton aria-label="Delete Todo" onClick={deleteEventHandler}>
          <DeleteOutlined />
        </IconButton>
      </ListItemSecondaryAction>

      {/* Snackbar for feedback */}
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
    </ListItem>
  );
};

export default Todo;