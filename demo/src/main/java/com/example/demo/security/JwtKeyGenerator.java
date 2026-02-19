package com.example.demo.security;

import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

public class JwtKeyGenerator {
    public static void main(String[] args) {
        // 512 비트 크기의 안전한 키 생성
        SecretKey key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS512);

        // 키 출력 (Base64 인코딩)
        String base64Key = java.util.Base64.getEncoder().encodeToString(key.getEncoded());
        System.out.println("Base64 encoded secret key: " + base64Key);
    }
}