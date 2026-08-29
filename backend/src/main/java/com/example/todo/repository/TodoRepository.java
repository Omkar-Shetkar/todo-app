package com.example.todo.repository;

import com.example.todo.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    List<Todo> findByCompleted(boolean completed);

    List<Todo> findAllByOrderByCreatedAtDesc();

    List<Todo> findByCompletedOrderByCreatedAtDesc(boolean completed);

    @Modifying
    @Query("DELETE FROM Todo t WHERE t.completed = true")
    void deleteByCompletedTrue();
}
