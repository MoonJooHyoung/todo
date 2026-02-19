import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import App from "./App";
import Login from "./Login";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <Layout>
                            <App />
                        </Layout>
                    } 
                />
                <Route 
                    path="/login" 
                    element={
                        <Layout>
                            <Login />
                        </Layout>
                    } 
                />
            </Routes>
        </BrowserRouter>
    );
}

function Layout({ children }) {
    return (
        <div>
            {children}
            <Box sx={{ padding: "16px", marginTop: "20px", textAlign: "center" }}>
                <Copyright />
            </Box>
        </div>
    );
}

function Copyright() {
    return (
        <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ padding: 1, marginTop: 1 }}
        >
            {"Copyright © "}
            fsoftwareengineer, {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

export default AppRouter;