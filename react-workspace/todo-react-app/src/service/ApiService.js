import { API_BASE_URL } from "../api-config";

export function call(api, method, request) {
    // 헤더 생성
    let headers = new Headers({
        "Content-Type": "application/json",
    });

    // 로컬 스토리지에서 ACCESS TOKEN 가져오기
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    if (accessToken && accessToken !== null) {
        headers.append("Authorization", "Bearer " + accessToken); // 공백 추가
    }

    const url = API_BASE_URL + api;

    // 요청 옵션 설정
    let options = {
        headers: headers,
        method: method,
    };

    if (request) {
        options.body = JSON.stringify(request); // 요청 바디 설정
    }

    // URL과 options 출력 (디버깅용)
    console.log("Request URL:", url);
    console.log("Request Options:", options);

    // API 호출
    return fetch(url, options)
        .then((response) => {
            if (!response.ok) {
                if (response.status === 403) {
                    console.error("Access denied. Redirecting to login.");
                    window.location.href = "/login";
                }
                throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
            }
            return response.json(); // JSON 응답 반환
        })
        .catch((error) => {
            console.error("HTTP Error occurred:", error);
            throw error;
        });
}

export function signin(userDTO) {
    return call("/auth/signin", "POST", userDTO)
        .then((response) => {
            // 서버 응답에서 토큰 확인
            if (response.token) {
                console.log("Login successful, response:", response);
                // 로컬 스토리지에 토큰 저장
                localStorage.setItem("ACCESS_TOKEN", response.token);
                // 메인 화면으로 리디렉트
                window.location.href = "/";
                return response; // 응답 반환
            } else {
                console.error("Token is missing in the response.");
                alert("로그인 실패: 서버 응답에 토큰이 없습니다.");
                throw new Error("Invalid response structure");
            }
        })
        .catch((error) => {
            console.error("Error during login:", error);
            alert("로그인 중 오류 발생: " + error.message);
        });
}

export function signout() {
    localStorage.setItem("ACCESS_TOKEN", null);
    window.location.href = "/login";
}

export function signup(userDTO) {
    return call("/auth/signup", "POST", userDTO);
}