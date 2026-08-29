package com.example.todo.service;

import com.example.todo.dto.CreateTodoRequest;
import com.example.todo.dto.TodoResponse;
import com.example.todo.dto.UpdateTodoRequest;
import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Transactional(readOnly = true)
    public List<TodoResponse> getTodos(Boolean completed) {
        List<Todo> todos;
        if (completed != null) {
            todos = todoRepository.findByCompletedOrderByCreatedAtDesc(completed);
        } else {
            todos = todoRepository.findAllByOrderByCreatedAtDesc();
        }
        return todos.stream()
                .map(TodoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TodoResponse getTodoById(Long id) {
        Todo todo = findTodoOrThrow(id);
        return TodoResponse.fromEntity(todo);
    }

    public TodoResponse createTodo(CreateTodoRequest request) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title cannot be blank");
        }
        Todo todo = new Todo(request.getTitle().trim());
        Todo saved = todoRepository.save(todo);
        return TodoResponse.fromEntity(saved);
    }

    public TodoResponse updateTodo(Long id, UpdateTodoRequest request) {
        Todo todo = findTodoOrThrow(id);

        if (request.getTitle() != null) {
            if (request.getTitle().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title cannot be blank");
            }
            todo.setTitle(request.getTitle().trim());
        }

        if (request.getCompleted() != null) {
            todo.setCompleted(request.getCompleted());
        }

        Todo updated = todoRepository.save(todo);
        return TodoResponse.fromEntity(updated);
    }

    public TodoResponse toggleTodo(Long id) {
        Todo todo = findTodoOrThrow(id);
        todo.setCompleted(!todo.isCompleted());
        Todo updated = todoRepository.save(todo);
        return TodoResponse.fromEntity(updated);
    }

    public void deleteTodo(Long id) {
        Todo todo = findTodoOrThrow(id);
        todoRepository.delete(todo);
    }

    public void clearCompleted() {
        todoRepository.deleteByCompletedTrue();
    }

    private Todo findTodoOrThrow(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Todo not found with id: " + id));
    }
}
