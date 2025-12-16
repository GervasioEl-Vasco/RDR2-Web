<?php
// models/Quiz.php

class Quiz {
    private $conn;
    private $table = 'quizzes';

    public $id;
    public $title;
    public $description;
    public $questions; // JSON string
    public $created_by;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // CREATE
    public function create() {
        $query = "INSERT INTO " . $this->table . " SET title = :title, description = :description, questions = :questions, created_by = :created_by";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':questions', $this->questions);
        $stmt->bindParam(':created_by', $this->created_by);
        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // READ - get all quizzes
    public function getAll() {
        $query = "SELECT q.*, u.username as creator FROM " . $this->table . " q LEFT JOIN users u ON q.created_by = u.id ORDER BY q.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // READ - get single quiz
    public function getById($id) {
        $query = "SELECT q.*, u.username as creator FROM " . $this->table . " q LEFT JOIN users u ON q.created_by = u.id WHERE q.id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt;
    }

    // UPDATE
    public function update() {
        $query = "UPDATE " . $this->table . " SET title = :title, description = :description, questions = :questions, updated_at = CURRENT_TIMESTAMP WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':questions', $this->questions);
        $stmt->bindParam(':id', $this->id);
        if ($stmt->execute()) return true;
        return false;
    }

    // DELETE
    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        if ($stmt->execute()) return true;
        return false;
    }
}

?>
