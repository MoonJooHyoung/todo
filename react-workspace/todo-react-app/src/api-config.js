let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === "localhost") {
    backendHost = "http://localhost:8081"; // 로컬 개발 환경
} else if (hostname === "staging.example.com") {
    backendHost = "https://staging.example.com/api"; // 스테이징 환경
} else if (hostname === "www.example.com") {
    backendHost = "https://www.example.com/api"; // 프로덕션 환경
} else {
    backendHost = "https://default.example.com/api"; // 기본값 (예: 백업 서버)
}

// API URL을 다른 파일에서 사용할 수 있도록 export
export const API_BASE_URL = backendHost;