package com.example.demo.security;

import com.example.demo.model.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Slf4j
@Service
public class TokenProvider {

    // SECRET_KEY 생성: 외부 설정 파일에서 로드하는 것이 권장됨
    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    /**
     * JWT 토큰 생성 메서드
     * @param userEntity 사용자 정보
     * @return 생성된 JWT 토큰
     */
    public String create(UserEntity userEntity) {
        // 만료 기한 설정: 현재 시간부터 1일 후
        Date expiryDate = Date.from(
                Instant.now().plus(1, ChronoUnit.DAYS)
        );

        // JWT 생성
        String jwtToken = Jwts.builder()
                .setSubject(userEntity.getId().toString()) // 사용자 ID를 토큰 subject로 설정
                .setIssuer("demo-app") // 발급자 정보
                .setIssuedAt(new Date()) // 발급 시간
                .setExpiration(expiryDate) // 만료 시간
                .signWith(SECRET_KEY, SignatureAlgorithm.HS512) // 서명 알고리즘과 키 설정
                .compact();

        log.info("Generated Token for User ID: {}", userEntity.getId());
        return jwtToken;
    }

    /**
     * JWT 검증 및 사용자 ID 추출 메서드
     * @param token 클라이언트로부터 받은 JWT 토큰
     * @return 사용자 ID (토큰의 subject 필드)
     */
    public String validateAndGetUserId(String token) {
        try {
            // 토큰 검증 및 클레임 파싱
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            log.info("Token Validated. User ID: {}", claims.getSubject());
            return claims.getSubject();
        } catch (Exception e) {
            log.error("Invalid JWT Token: {}", e.getMessage());
            throw new RuntimeException("Invalid JWT Token");
        }
    }
}
