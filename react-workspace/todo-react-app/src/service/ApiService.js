import { API_BASE_URL } from "../api-config";

/** 네트워크/요청 오류 메시지를 한글로 변환 */
function toKoreanMessage(error) {
    const msg = error && error.message ? String(error.message) : "";
    if (msg.includes("Failed to fetch") || error?.name === "TypeError") {
        return "서버에 연결할 수 없습니다. 백엔드(8081)가 실행 중인지 확인해 주세요.";
    }
    if (msg.includes("401") || msg.includes("Unauthorized")) return "로그인이 필요합니다.";
    if (msg.includes("403") || msg.includes("Forbidden")) return "접근 권한이 없습니다.";
    if (msg.includes("404")) return "요청한 주소를 찾을 수 없습니다.";
    if (msg.includes("500")) return "서버 오류가 발생했습니다.";
    return msg || "요청 중 오류가 발생했습니다.";
}

export function call(api, method, request) {
    const isAuthEndpoint = api === "/auth/signin" || api === "/auth/signup";
    const raw = localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("token") || "";
    const accessToken = typeof raw === "string" ? raw.trim() : "";
    const hasValidToken = accessToken && accessToken !== "null" && accessToken !== "undefined" && accessToken.length > 20;

    const headers = {
        "Content-Type": "application/json",
    };
    if (!isAuthEndpoint && hasValidToken) {
        headers["Authorization"] = "Bearer " + accessToken;
    }

    const url = API_BASE_URL + api;
    const options = {
        method,
        headers,
        credentials: "include",
    };
    if (request) {
        options.body = JSON.stringify(request);
    }

    return fetch(url, options)
        .then(async (response) => {
            if (!response.ok) {
                const isAuthEndpoint = api === "/auth/signin" || api === "/auth/signup";
                // 로그인 실패(401) 시 서버가 준 error 코드를 그대로 전달 (아이디 없음/비밀번호 틀림 구분)
                if (response.status === 401 && api === "/auth/signin") {
                    let body = {};
                    try {
                        body = await response.json();
                    } catch (_) {}
                    const code = (body && body.error) ? body.error : "INVALID_CREDENTIALS";
                    throw new Error(code);
                }
                if ((response.status === 401 || response.status === 403) && !isAuthEndpoint) {
                    console.error("Access denied. Redirecting to login.");
                    localStorage.removeItem("ACCESS_TOKEN");
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                    throw new Error("세션이 만료되었거나 권한이 없습니다. 다시 로그인해 주세요.");
                }
                throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .catch((error) => {
            if (error.message === "USER_NOT_FOUND" || error.message === "WRONG_PASSWORD" || error.message === "INVALID_CREDENTIALS") {
                throw error;
            }
            if (error.message === "세션이 만료되었거나 권한이 없습니다. 다시 로그인해 주세요.") {
                throw error;
            }
            console.error("HTTP Error occurred:", error);
            throw new Error(toKoreanMessage(error));
        });
}

export function signin(userDTO) {
    return call("/auth/signin", "POST", userDTO)
        .then((response) => {
            if (response && response.token) {
                localStorage.setItem("ACCESS_TOKEN", response.token);
                window.location.href = "/";
                return response;
            }
            console.error("Token is missing in the response.");
            throw new Error("로그인 실패: 서버 응답에 토큰이 없습니다.");
        })
        .catch((error) => {
            console.error("Error during login:", error);
            // 로그인 전용 에러 코드는 그대로 전달해 Login에서 한글 메시지로 표시
            if (error.message === "USER_NOT_FOUND" || error.message === "WRONG_PASSWORD" || error.message === "INVALID_CREDENTIALS") {
                throw error;
            }
            throw new Error(toKoreanMessage(error));
        });
}

export function signout() {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("token");
    window.location.href = "/login";
}

export function signup(userDTO) {
    return call("/auth/signup", "POST", userDTO);
}