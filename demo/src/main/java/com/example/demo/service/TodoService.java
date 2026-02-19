package com.example.demo.service;

import com.example.demo.model.TodoEntity;
import com.example.demo.persistence.TodoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class TodoService {

    @Autowired
    private TodoRepository repository;

    public String testService() {
        // TodoEntity 생성
        TodoEntity entity = TodoEntity.builder().title("My first todo item").build();
        // TodoEntity 저장
        TodoEntity savedEntity = repository.save(entity);  // 저장된 엔티티를 변수에 할당
        // TodoEntity 검색 (Optional 처리)
        TodoEntity retrievedEntity = repository.findById(savedEntity.getId().toString())  // UUID -> String 변환
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        return retrievedEntity.getTitle();
    }

    public List<TodoEntity> create(final TodoEntity entity) {
        // Validations
        validate(entity);

        TodoEntity savedEntity = repository.save(entity);  // 저장된 엔티티를 변수에 할당
        log.info("Entity Id : {} is saved.", savedEntity.getId());
        return repository.findByUserId(entity.getUserId());
    }

    private void validate(final TodoEntity entity) {
        if (entity == null) {
            log.warn("Entity cannot be null.");
            throw new RuntimeException("Entity cannot be null.");
        }

        if (entity.getUserId() == null) {
            log.warn("Unknown user.");
            throw new RuntimeException("Unknown user.");
        }
    }

    public List<TodoEntity> retrieve(final String userId) {
        return repository.findByUserId(userId);
    }

    public List<TodoEntity> update(final TodoEntity entity) {
        // (1) 저장할 엔티티가 유효한지 확인한다.
        validate(entity);

        // (2) 넘겨받은 엔티티 id를 이용해 TodoEntity를 가져온다.
        Optional<TodoEntity> original = repository.findById(entity.getId().toString());  // UUID -> String 변환

        if (original.isPresent()) {
            // (3) 반환된 TodoEntity가 존재하면 값을 새 entity의 값으로 덮어 씌운다.
            TodoEntity todo = original.get();
            todo.setTitle(entity.getTitle());
            todo.setDone(entity.isDone());

            // (4) 데이터베이스에 새 값을 저장한다.
            repository.save(todo);
        } else {
            // 엔티티가 없으면 예외 처리
            throw new RuntimeException("Todo not found for id: " + entity.getId());
        }

        // 2.3.2 Retrieve Todo에서 만든 메서드를 이용해 유저의 모든 Todo 리스트를 리턴한다.
        return retrieve(entity.getUserId());
    }

    public List<TodoEntity> delete(final TodoEntity entity) {
        // (1) 저장할 엔티티가 유효한지 확인한다.
        validate(entity);

        try {
            // (2) 엔티티를 삭제한다.
            repository.delete(entity);
        } catch (Exception e) {
            // (3) 예외 발생시 id와 exception을 로깅한다.
            log.error("Error deleting entity with id: {}", entity.getId(), e);

            // (4) 예외 처리
            throw new RuntimeException("Error deleting entity " + entity.getId());
        }
        // (5) 새 Todo리스트를 가져와 리턴한다.
        return retrieve(entity.getUserId());
    }

}