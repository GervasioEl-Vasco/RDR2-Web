<?php
// models/CharacterComment.php

class CharacterComment {
    private $conn;
    private $table = "character_comments";

    public $id;
    public $user_id;
    public $character_name;
    public $comment;
    public $rating;
    public $created_at;
    public $username; // Untuk join dengan users

    public function __construct($db) {
        $this->conn = $db;
    }

    // CREATE - Add new comment
    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  SET user_id = :user_id, character_name = :character_name,
                      comment = :comment, rating = :rating";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":character_name", $this->character_name);
        $stmt->bindParam(":comment", $this->comment);
        $stmt->bindParam(":rating", $this->rating);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // READ - Get all comments with username
    public function getAll() {
        $query = "SELECT c.*, u.username 
                  FROM " . $this->table . " c 
                  INNER JOIN users u ON c.user_id = u.id 
                  ORDER BY c.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    // READ - Get comments by character
    public function getByCharacter($character_name) {
        $query = "SELECT c.*, u.username 
                  FROM " . $this->table . " c 
                  INNER JOIN users u ON c.user_id = u.id 
                  WHERE c.character_name = :character_name 
                  ORDER BY c.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":character_name", $character_name);
        $stmt->execute();
        
        return $stmt;
    }

    // UPDATE - Update comment
    public function update() {
        $query = "UPDATE " . $this->table . " 
                  SET comment = :comment, rating = :rating 
                  WHERE id = :id AND user_id = :user_id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":comment", $this->comment);
        $stmt->bindParam(":rating", $this->rating);
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":user_id", $this->user_id);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // DELETE - Delete comment
    public function delete() {
        $query = "DELETE FROM " . $this->table . " 
                  WHERE id = :id AND user_id = :user_id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":user_id", $this->user_id);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // DELETE - Admin delete any comment
    public function adminDelete() {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // READ - Get average rating for character
    public function getAverageRating($character_name) {
        $query = "SELECT AVG(rating) as avg_rating, COUNT(*) as total_comments 
                  FROM " . $this->table . " 
                  WHERE character_name = :character_name";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":character_name", $character_name);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>