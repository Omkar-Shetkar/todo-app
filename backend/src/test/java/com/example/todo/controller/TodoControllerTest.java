package com.example.todo.controller;

import com.example.todo.dto.CreateTodoRequest;
import com.example.todo.dto.UpdateTodoRequest;
import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        todoRepository.deleteAll();
    }

    @Test
    void shouldCreateNewTodoSuccessfully() throws Exception {
        CreateTodoRequest request = new CreateTodoRequest("Buy fresh groceries");

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.title", is("Buy fresh groceries")))
                .andExpect(jsonPath("$.completed", is(false)))
                .andExpect(jsonPath("$.createdAt", notNullValue()));
    }

    @Test
    void shouldRejectBlankTodoCreation() throws Exception {
        CreateTodoRequest request = new CreateTodoRequest("   ");

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldListAllTodos() throws Exception {
        Todo t1 = new Todo("First Task");
        Todo t2 = new Todo("Second Task", true);
        todoRepository.save(t1);
        todoRepository.save(t2);

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void shouldFilterTodosByCompletionStatus() throws Exception {
        Todo active = new Todo("Active Task", false);
        Todo completed = new Todo("Completed Task", true);
        todoRepository.save(active);
        todoRepository.save(completed);

        mockMvc.perform(get("/api/todos?completed=true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Completed Task")));

        mockMvc.perform(get("/api/todos?completed=false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Active Task")));
    }

    @Test
    void shouldToggleTodoStatus() throws Exception {
        Todo todo = todoRepository.save(new Todo("Toggle Me", false));

        mockMvc.perform(patch("/api/todos/" + todo.getId() + "/toggle"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed", is(true)));

        mockMvc.perform(patch("/api/todos/" + todo.getId() + "/toggle"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed", is(false)));
    }

    @Test
    void shouldUpdateTodoTitle() throws Exception {
        Todo todo = todoRepository.save(new Todo("Original Title", false));
        UpdateTodoRequest updateRequest = new UpdateTodoRequest("Updated Title", true);

        mockMvc.perform(put("/api/todos/" + todo.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Updated Title")))
                .andExpect(jsonPath("$.completed", is(true)));
    }

    @Test
    void shouldDeleteTodoById() throws Exception {
        Todo todo = todoRepository.save(new Todo("Delete Me", false));

        mockMvc.perform(delete("/api/todos/" + todo.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/todos/" + todo.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldClearCompletedTodos() throws Exception {
        todoRepository.save(new Todo("Keep Active 1", false));
        todoRepository.save(new Todo("Delete Completed 1", true));
        todoRepository.save(new Todo("Delete Completed 2", true));

        mockMvc.perform(delete("/api/todos/completed"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Keep Active 1")));
    }
}
