package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.ResponseDTO;
import com.example.demo.dto.UserDTO;
import com.example.demo.model.UserEntity;
import com.example.demo.service.UserService;
import com.example.demo.security.TokenProvider;

import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private TokenProvider tokenProvider;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 사용자 등록
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        try {
            if (userDTO == null || userDTO.getPassword() == null || userDTO.getUsername() == null) {
                throw new RuntimeException("Invalid input: Username and Password must not be null");
            }
            
            if (userDTO.getPassword().length() < 6) {
                throw new RuntimeException("Password must be at least 6 characters");
            }

            // UserEntity 생성
            UserEntity user = UserEntity.builder()
                    .username(userDTO.getUsername())
                    .password(passwordEncoder.encode(userDTO.getPassword()))
                    .build();

            // 사용자 생성
            UserEntity registeredUser = userService.create(user);

            // 응답 DTO 생성
            UserDTO responseUserDTO = UserDTO.builder()
                    .id(registeredUser.getId().toString()) // UUID -> String 변환
                    .username(registeredUser.getUsername())
                    .build();

            log.info("User registered successfully: {}", userDTO.getUsername());
            return ResponseEntity.ok().body(responseUserDTO);
        } catch (RuntimeException e) {
            log.error("Registration error: {}", e.getMessage());
            ResponseDTO<String> responseDTO = ResponseDTO.<String>builder().error(e.getMessage()).build();
            return ResponseEntity.badRequest().body(responseDTO);
        } catch (Exception e) {
            log.error("Unexpected error during user registration", e);
            ResponseDTO<String> responseDTO = ResponseDTO.<String>builder().error("Internal server error").build();
            return ResponseEntity.status(500).body(responseDTO);
        }
    }

    // 사용자 로그인
    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@RequestBody UserDTO userDTO) {
        try {
            if (userDTO == null || userDTO.getUsername() == null || userDTO.getPassword() == null) {
                throw new RuntimeException("Invalid Username or Password");
            }

            // 사용자 인증 - 비밀번호 비교 추가
            UserEntity user = userService.getByCredentials(userDTO.getUsername(), userDTO.getPassword(), passwordEncoder);

            if (user != null) {
                // 토큰 생성
                final String token = tokenProvider.create(user);

                // 응답 DTO 생성
                final UserDTO responseUserDTO = UserDTO.builder()
                        .username(user.getUsername())
                        .id(user.getId().toString()) // UUID -> String 변환
                        .token(token)
                        .build();

                log.info("User logged in successfully: {}", userDTO.getUsername());
                return ResponseEntity.ok().body(responseUserDTO);
            } else {
                log.warn("Login failed for user: {}", userDTO.getUsername());
                ResponseDTO<String> responseDTO = ResponseDTO.<String>builder()
                        .error("Invalid credentials")
                        .build();
                return ResponseEntity.status(401).body(responseDTO);
            }
        } catch (RuntimeException e) {
            log.error("Authentication error: {}", e.getMessage());
            ResponseDTO<String> responseDTO = ResponseDTO.<String>builder().error(e.getMessage()).build();
            return ResponseEntity.badRequest().body(responseDTO);
        } catch (Exception e) {
            log.error("Unexpected error during authentication", e);
            ResponseDTO<String> responseDTO = ResponseDTO.<String>builder().error("Internal server error").build();
            return ResponseEntity.status(500).body(responseDTO);
        }
    }

    // 모든 사용자 조회
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserEntity> users = userService.getAllUsers();
            log.info("Retrieved {} users", users.size());
            return ResponseEntity.ok().body(users);
        } catch (Exception e) {
            log.error("Error retrieving users: ", e);
            ResponseDTO<String> responseDTO = ResponseDTO.<String>builder().error("Failed to retrieve users").build();
            return ResponseEntity.status(500).body(responseDTO);
        }
    }

    // 사용자 삭제
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") String userId) {
        try {
            userService.deleteUser(userId);
            log.info("User with ID {} deleted successfully", userId);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (RuntimeException e) {
            log.error("Error deleting user: {}", e.getMessage());
            ResponseDTO<String> responseDTO = ResponseDTO.<String>builder().error(e.getMessage()).build();
            return ResponseEntity.badRequest().body(responseDTO);
        } catch (Exception e) {
            log.error("Unexpected error during user deletion", e);
            ResponseDTO<String> responseDTO = ResponseDTO.<String>builder().error("Internal server error").build();
            return ResponseEntity.status(500).body(responseDTO);
        }
    }
}