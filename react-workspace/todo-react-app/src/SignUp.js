import React, { useState } from "react";
import {
    Container,
    Grid,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { signup } from "./service/ApiService";

function Signup() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        if (password.length < 6) {
            setError("비밀번호는 6자 이상이어야 합니다.");
            setLoading(false);
            return;
        }
        if (password !== passwordConfirm) {
            setError("비밀번호가 일치하지 않습니다.");
            setLoading(false);
            return;
        }

        signup({ username, password })
            .then((response) => {
                alert("회원가입이 완료되었습니다. 로그인해 주세요.");
                window.location.href = "/login";
            })
            .catch((err) => {
                console.error("Signup failed:", err);
                const message =
                    err.message || "회원가입에 실패했습니다. 아이디가 이미 사용 중이거나 입력을 확인해 주세요.";
                setError(message);
            })
            .finally(() => setLoading(false));
    };

    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: "10%" }}>
            <Grid container spacing={2}>
                <Grid item xs={12} style={{ marginBottom: "20px", color: "darkgreen" }}>
                    <Typography component="h1" variant="h5">
                        회원가입
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
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="패스워드 (6자 이상)"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            error={!!error}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="passwordConfirm"
                            label="패스워드 확인"
                            type="password"
                            id="passwordConfirm"
                            autoComplete="new-password"
                            error={!!error}
                            helperText={error}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
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
                            {loading ? <CircularProgress size={24} /> : "가입하기"}
                        </Button>
                    </Grid>

                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <Link component={RouterLink} to="/login" variant="body2" sx={{ color: "darkgreen" }}>
                            이미 계정이 있으신가요? 로그인
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default Signup;
