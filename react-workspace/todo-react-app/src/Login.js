import React, { useState } from "react";
import { Container, Grid, Typography, TextField, Button, CircularProgress, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { signin } from "./service/ApiService";

function Login() {
    const [loading, setLoading] = useState(false);  // 로딩 상태 관리
    const [error, setError] = useState("");  // 에러 메시지 상태
    const [username, setUsername] = useState("");  // 사용자 이름 상태
    const [password, setPassword] = useState("");  // 패스워드 상태

    const handleSubmit = (event) => {
        event.preventDefault();  // 기본 폼 제출 방지
        setLoading(true);  // 로딩 시작
        setError("");  // 에러 메시지 초기화

        signin({ username, password })
            .then((response) => {
                if (response && response.token) {
                    localStorage.setItem("ACCESS_TOKEN", response.token);
                    window.location.href = "/";
                }
            })
            .catch((error) => {
                console.error("Login failed:", error);
                const msg = error && error.message;
                if (msg === "USER_NOT_FOUND") {
                    setError("아이디가 없습니다.");
                } else if (msg === "WRONG_PASSWORD") {
                    setError("비밀번호가 틀렸습니다.");
                } else {
                    setError(msg || "로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.");
                }
            })
            .finally(() => {
                setLoading(false);  // 로딩 끝
            });
    };

    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: "10%" }}>
            <Grid container spacing={2}>
                <Grid item xs={12} style={{ marginBottom: "20px", color: "darkgreen" }}>
                    <Typography component="h1" variant="h5">
                        로그인
                    </Typography>
                </Grid>
            </Grid>

            <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="username"
                            label="아이디"
                            name="username"
                            autoComplete="username"
                            error={!!error}
                            value={username} // 상태에 저장된 username을 바인딩
                            onChange={(e) => setUsername(e.target.value)} // 상태 업데이트
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="패스워드"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={!!error}
                            helperText={error}
                            value={password} // 상태에 저장된 password를 바인딩
                            onChange={(e) => setPassword(e.target.value)} // 상태 업데이트
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                backgroundColor: "green",
                                color: "white",
                                "&:hover": { backgroundColor: "darkgreen" },
                            }}
                        >
                            {loading ? <CircularProgress size={24} /> : "로그인"}
                        </Button>
                    </Grid>

                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <Link component={RouterLink} to="/signup" variant="body2" sx={{ color: "darkgreen" }}>
                            계정이 없으신가요? 회원가입
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default Login;