import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import PropTypes from "prop-types";

const AddTodo = (props) => {
    const [item, setItem] = useState({ title: "" });
    const { addItem } = props;

    const enterKeyEventHandler = (e) => {
        if (e.key === "Enter") onButtonClick();
    };

    const onButtonClick = () => {
        if (item.title.trim()) {
            addItem(item);
            setItem({ title: "" });
        } else {
            alert("내용을 입력해주세요.");
        }
    };

    const onInputChange = (e) => {
        setItem({ title: e.target.value });
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "stretch",
                gap: 0,
                marginTop: 2,
                "& .MuiOutlinedInput-root": { borderRadius: "4px 0 0 4px" },
                "& .MuiButton-root": { borderRadius: "0 4px 4px 0", minWidth: 48 },
            }}
        >
            <TextField
                placeholder="Add Todo here"
                size="small"
                fullWidth
                onChange={onInputChange}
                onKeyDown={enterKeyEventHandler}
                value={item.title}
                sx={{ "& .MuiOutlinedInput-root": { height: 40 } }}
            />
            <Button
                color="secondary"
                variant="outlined"
                onClick={onButtonClick}
                sx={{ height: 40, px: 1.5 }}
            >
                +
            </Button>
        </Box>
    );
};

// PropTypes를 사용하여 props를 명시적으로 정의
AddTodo.propTypes = {
    addItem: PropTypes.func.isRequired, // addItem은 필수 함수
};

export default AddTodo;