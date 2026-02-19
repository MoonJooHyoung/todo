package com.example.demo.persistence;

import com.example.demo.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;  // Optional 사용

import java.util.List;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    // 사용자명과 패스워드를 기준으로 사용자 찾기
    UserEntity findByUsernameAndPassword(String username, String password);

    // 사용자명이 이미 존재하는지 확인
    boolean existsByUsername(String username);

    // 모든 사용자 조회 (JpaRepository가 자동으로 제공)
     List<UserEntity> findAll(); // 이 메서드는 자동으로 제공되므로 추가할 필요 없음

    // 사용자 ID로 삭제 (JpaRepository가 자동으로 제공)
     void deleteById(UUID id); // 이 메서드는 자동으로 제공되므로 추가할 필요 없음
     
     // username으로 사용자 조회
     Optional<UserEntity> findByUsername(String username);  // Optional을 반환
     
}