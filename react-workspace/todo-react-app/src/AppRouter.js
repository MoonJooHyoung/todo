import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./Login";
import Signup from "./SignUp";

function AppRouter() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path="/" element={<Layout><App /></Layout>} />
                <Route path="/login" element={<Layout><Login /></Layout>} />
                <Route path="/signup" element={<Layout><Signup /></Layout>} />
            </Routes>
        </BrowserRouter>
    );
}

function Layout({ children }) {
    return <div>{children}</div>;
}

export default AppRouter;