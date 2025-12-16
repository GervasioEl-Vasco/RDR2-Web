<?php
// models/QuizAttempt.php

class QuizAttempt {
    private $conn;
    private $table = 'quiz_attempts';

    public $id;
    public $quiz_id;
    public $user_id;
    public $score;
    public $total_questions;
    public $answers; // JSON string
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // CREATE
    public function create() {
        $query = "INSERT INTO " . $this->table . " SET quiz_id = :quiz_id, user_id = :user_id, score = :score, total_questions = :total_questions, answers = :answers";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':quiz_id', $this->quiz_id);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':score', $this->score);
        $stmt->bindParam(':total_questions', $this->total_questions);
        $stmt->bindParam(':answers', $this->answers);
        if ($stmt->execute()) return true;
        return false;
    }

    // READ - get attempts by user
    public function getByUser($user_id) {
        $query = "SELECT qa.*, q.title FROM " . $this->table . " qa JOIN quizzes q ON qa.quiz_id = q.id WHERE qa.user_id = :user_id ORDER BY qa.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        return $stmt;
    }

    // READ - get attempts by quiz (admin)
    public function getByQuiz($quiz_id) {
        $query = "SELECT qa.*, u.username FROM " . $this->table . " qa LEFT JOIN users u ON qa.user_id = u.id WHERE qa.quiz_id = :quiz_id ORDER BY qa.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':quiz_id', $quiz_id);
        $stmt->execute();
        return $stmt;
    }
}

?>
