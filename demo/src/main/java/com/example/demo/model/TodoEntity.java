package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "Todo")
public class TodoEntity {
    @Id
    @GeneratedValue
    private UUID id;
    private String userId;
    private String title;
    private boolean done;
    /** true면 '완료한 일' 목록에 표시, false면 '오늘의 할 일'에만 표시(체크는 done으로) */
    private boolean completed;
}
