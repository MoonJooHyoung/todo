import React, { useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import PropTypes from "prop-types"; // PropTypes 추가

const AddTodo = (props) => {
    // 사용자의 입력을 저장할 오브젝트
    const [item, setItem] = useState({ title: "" });
    const { addItem } = props; // props에서 addItem 추출

    // Enter 키 이벤트 핸들러
    const enterKeyEventHandler = (e) => {
        if (e.key === "Enter") {
            onButtonClick();
        }
    };

    // 버튼 클릭 시 호출되는 함수
    const onButtonClick = () => {
        if (item.title.trim()) { // 공백 입력 방지
            console.log("Added item:", item); // 추가된 아이템 로그 출력
            addItem(item); // 부모로 아이템 전달
            setItem({ title: "" }); // 입력 초기화
        } else {
            alert("내용을 입력해주세요."); // 공백 입력 방지 알림
        }
    };

    // 입력 변경 시 호출되는 함수
    const onInputChange = (e) => {
        setItem({ title: e.target.value });
    };

    return (
        <Grid container style={{ marginTop: 20 }}>
            <Grid item xs={11} md={11} style={{ padding: 16 }}>
                <TextField 
                    placeholder="Add Todo here"
                    fullWidth
                    onChange={onInputChange}
                    onKeyDown={enterKeyEventHandler} // onKeyPress -> onKeyDown 변경
                    value={item.title}
                />
            </Grid>
            <Grid item xs={1} md={1}>
                <Button 
                    fullWidth
                    style={{ height: "100%" }}
                    color="secondary"
                    variant="outlined"
                    onClick={onButtonClick}
                >
                    +
                </Button>
            </Grid>
        </Grid>
    );
};

// PropTypes를 사용하여 props를 명시적으로 정의
AddTodo.propTypes = {
    addItem: PropTypes.func.isRequired, // addItem은 필수 함수
};

export default AddTodo;