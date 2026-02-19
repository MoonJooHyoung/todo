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

    // 사용자 로그인 - 아이디 없음 / 비밀번호 틀림 구분하여 에러 코드 반환
    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@RequestBody UserDTO userDTO) {
        try {
            if (userDTO == null || userDTO.getUsername() == null || userDTO.getPassword() == null) {
                return ResponseEntity.badRequest()
                        .body(ResponseDTO.<String>builder().error("INVALID_INPUT").build());
            }

            var optionalUser = userService.findByUsername(userDTO.getUsername());
            if (optionalUser.isEmpty()) {
                log.warn("Login failed: user not found: {}", userDTO.getUsername());
                return ResponseEntity.status(401)
                        .body(ResponseDTO.<String>builder().error("USER_NOT_FOUND").build());
            }

            UserEntity user = optionalUser.get();
            if (!passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
                log.warn("Login failed: wrong password for user: {}", userDTO.getUsername());
                return ResponseEntity.status(401)
                        .body(ResponseDTO.<String>builder().error("WRONG_PASSWORD").build());
            }

            final String token = tokenProvider.create(user);
            final UserDTO responseUserDTO = UserDTO.builder()
                    .username(user.getUsername())
                    .id(user.getId().toString())
                    .token(token)
                    .build();
            log.info("User logged in successfully: {}", user.getUsername());
            return ResponseEntity.ok().body(responseUserDTO);
        } catch (Exception e) {
            log.error("Unexpected error during authentication", e);
            return ResponseEntity.status(500)
                    .body(ResponseDTO.<String>builder().error("Internal server error").build());
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