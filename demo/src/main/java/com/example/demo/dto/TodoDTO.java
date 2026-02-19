package com.example.demo.dto;

import com.example.demo.model.TodoEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TodoDTO {
    private UUID id;  // UUID로 변경
    private String title;
    private boolean done;

    // 엔티티를 DTO로 변환하는 생성자
    public TodoDTO(final TodoEntity entity) {
        this.id = entity.getId();  // UUID 그대로 사용
        this.title = entity.getTitle();
        this.done = entity.isDone();
    }

    // DTO를 엔티티로 변환하는 메소드
    public static TodoEntity toEntity(final TodoDTO dto) {
        return TodoEntity.builder()
                         .id(dto.getId())  // UUID 그대로 사용
                         .title(dto.getTitle())
                         .done(dto.isDone())
                         .build();
    }
}
