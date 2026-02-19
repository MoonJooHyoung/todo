package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.model.UserEntity;
import com.example.demo.persistence.UserRepository;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 사용자 생성
    public UserEntity create(final UserEntity userEntity) {
        if (userEntity == null || userEntity.getUsername() == null || userEntity.getPassword() == null) {
            throw new IllegalArgumentException("UserEntity나 username, password가 null입니다.");
        }
        final String username = userEntity.getUsername();
        if (userRepository.existsByUsername(username)) {
            log.warn("Username already exists: {}", username);
            throw new RuntimeException("이미 존재하는 사용자 이름입니다.");
        }

        log.info("Creating new user with username: {}", username);
        return userRepository.save(userEntity);
    }

    // 자격 증명으로 사용자 조회
    public UserEntity getByCredentials(String username, String password, PasswordEncoder passwordEncoder) {
        // 사용자 조회 (Optional 반환)
        Optional<UserEntity> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isPresent()) {
            UserEntity user = optionalUser.get();  // 값이 있을 경우 꺼내서 사용

            // 비밀번호 비교
            boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());

            if (passwordMatches) {
                return user;  // 비밀번호가 일치하면 사용자 반환
            }
        }

        return null;  // 사용자 없음 또는 비밀번호 불일치
    }

    // 모든 사용자 조회
    public List<UserEntity> getAllUsers() {
        try {
            List<UserEntity> users = userRepository.findAll(); // 모든 사용자 조회
            if (users.isEmpty()) {
                log.warn("No users found in the system.");
            }
            return users;
        } catch (Exception e) {
            log.error("Error fetching users", e);
            throw new RuntimeException("Failed to fetch users");
        }
    }

    // 사용자 삭제
    public void deleteUser(String userId) {
        try {
            UUID uuid = UUID.fromString(userId); // String을 UUID로 변환
            if (userRepository.existsById(uuid)) {
                userRepository.deleteById(uuid); // 사용자 삭제
                log.info("User with id {} has been deleted", userId);
            } else {
                log.warn("User with id {} not found", userId);
                throw new RuntimeException("User not found");
            }
        } catch (IllegalArgumentException e) {
            log.error("Invalid UUID format for userId: {}", userId, e);
            throw new RuntimeException("Invalid UUID format");
        } catch (Exception e) {
            log.error("Error deleting user with id: {}", userId, e);
            throw new RuntimeException("Failed to delete user");
        }
    }
}