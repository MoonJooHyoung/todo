package com.example.demo.controller;

import com.example.demo.dto.ResponseDTO;
import com.example.demo.dto.TodoDTO;
import com.example.demo.model.TodoEntity;
import com.example.demo.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("todo")
public class TodoController {

	@Autowired
	private TodoService service;

	/** 로그인한 사용자 ID (JWT에서 설정됨). 없으면 null */
	private String getUserId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.getPrincipal() != null) {
			return auth.getPrincipal().toString();
		}
		return null;
	}

	@GetMapping("/test")
	public ResponseEntity<?> testTodo() {
		String str = service.testService();
		List<String> list = new ArrayList<>();
		list.add(str);
		ResponseDTO<String> response = ResponseDTO.<String>builder().data(list).build();
		return ResponseEntity.ok().body(response);
	}

	@PostMapping
	public ResponseEntity<?> createTodo(@RequestBody TodoDTO dto) {
		try {
			String userId = getUserId();
			if (userId == null) {
				return ResponseEntity.status(401).body(ResponseDTO.<TodoDTO>builder().error("로그인이 필요합니다.").build());
			}
			TodoEntity entity = TodoDTO.toEntity(dto);
			entity.setId(null);
			entity.setUserId(userId);
			List<TodoEntity> entities = service.create(entity);
			List<TodoDTO> dtos = entities.stream().map(TodoDTO::new).collect(Collectors.toList());
			return ResponseEntity.ok().body(ResponseDTO.<TodoDTO>builder().data(dtos).build());
		} catch (Exception e) {
			String error = e.getMessage();
			return ResponseEntity.badRequest().body(ResponseDTO.<TodoDTO>builder().error(error).build());
		}
	}

	@GetMapping
	public ResponseEntity<?> retrieveTodoList() {
		String userId = getUserId();
		if (userId == null) {
			return ResponseEntity.status(401).body(ResponseDTO.<TodoDTO>builder().error("로그인이 필요합니다.").build());
		}
		List<TodoEntity> entities = service.retrieve(userId);
		List<TodoDTO> dtos = entities.stream().map(TodoDTO::new).collect(Collectors.toList());
		return ResponseEntity.ok().body(ResponseDTO.<TodoDTO>builder().data(dtos).build());
	}

	@PutMapping
	public ResponseEntity<?> updateTodo(@RequestBody TodoDTO dto) {
		String userId = getUserId();
		if (userId == null) {
			return ResponseEntity.status(401).body(ResponseDTO.<TodoDTO>builder().error("로그인이 필요합니다.").build());
		}
		TodoEntity entity = TodoDTO.toEntity(dto);
		entity.setUserId(userId);
		List<TodoEntity> entities = service.update(entity);
		List<TodoDTO> dtos = entities.stream().map(TodoDTO::new).collect(Collectors.toList());
		return ResponseEntity.ok().body(ResponseDTO.<TodoDTO>builder().data(dtos).build());
	}

	@DeleteMapping
	public ResponseEntity<?> deleteTodo(@RequestBody TodoDTO dto) {
		try {
			String userId = getUserId();
			if (userId == null) {
				return ResponseEntity.status(401).body(ResponseDTO.<TodoDTO>builder().error("로그인이 필요합니다.").build());
			}
			TodoEntity entity = TodoDTO.toEntity(dto);
			entity.setUserId(userId);
			List<TodoEntity> entities = service.delete(entity);
			List<TodoDTO> dtos = entities.stream().map(TodoDTO::new).collect(Collectors.toList());
			return ResponseEntity.ok().body(ResponseDTO.<TodoDTO>builder().data(dtos).build());
		} catch (Exception e) {
			String error = e.getMessage();
			return ResponseEntity.badRequest().body(ResponseDTO.<TodoDTO>builder().error(error).build());
		}
	}
}
