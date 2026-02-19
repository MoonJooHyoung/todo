package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.CorsFilter;

import com.example.demo.security.JwtAuthenticationFilter;

import lombok.extern.slf4j.Slf4j;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@EnableWebSecurity
@Configuration
@Slf4j
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public WebSecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        log.debug("Configuring HTTP Security settings");

        return http
                // CSRF 비활성화
                .csrf(csrf -> csrf.disable())

                // HTTP Basic 인증 비활성화
                .httpBasic(httpBasic -> httpBasic.disable())

                // Stateless 세션 관리 설정
                .sessionManagement(sessionManagement -> 
                    sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 경로별 접근 권한 설정 (OPTIONS는 CORS preflight용으로 인증 없이 허용)
                .authorizeHttpRequests(authorize -> authorize
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers("/", "/auth/**").permitAll()
                    .anyRequest().authenticated()
                )

                // CORS 설정
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // JWT 필터 추가 (CORS 필터 이후에 추가)
                .addFilterBefore(jwtAuthenticationFilter, CorsFilter.class)

                // 설정 완료 후 빌드
                .build();
    }

    // CORS 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 프론트엔드 URL이 환경에 따라 다를 수 있으므로, 환경에 맞게 설정
        String frontendUrl = System.getenv("FRONTEND_URL"); // 예를 들어 환경 변수로 설정
        configuration.setAllowedOrigins(List.of(frontendUrl != null ? frontendUrl : "http://localhost:3000")); 

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        // 모든 경로에 대해 CORS 설정 적용
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
