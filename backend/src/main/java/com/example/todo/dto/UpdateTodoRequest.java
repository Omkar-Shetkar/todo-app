package com.example.todo.dto;

import jakarta.validation.constraints.Size;

public class UpdateTodoRequest {

    @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
    private String title;

    private Boolean completed;

    public UpdateTodoRequest() {
    }

    public UpdateTodoRequest(String title, Boolean completed) {
        this.title = title;
        this.completed = completed;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }
}
