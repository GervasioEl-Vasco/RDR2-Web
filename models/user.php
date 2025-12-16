<?php
// models/User.php

class User {
    private $conn;
    private $table = "users";

    public $id;
    public $username;
    public $email;
    public $password;
    public $user_type;
    public $created_at;
    public $last_login;

    public function __construct($db) {
        $this->conn = $db;
    }

    // CREATE - Register user
    public function register() {
        $query = "INSERT INTO " . $this->table . " 
                  SET username = :username, email = :email, 
                      password = :password, user_type = :user_type";
        
        try {
            $stmt = $this->conn->prepare($query);
            
            $this->password = password_hash($this->password, PASSWORD_BCRYPT);
            
            $stmt->bindParam(":username", $this->username);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":password", $this->password);
            $stmt->bindParam(":user_type", $this->user_type);
            
            if($stmt->execute()) {
                return true;
            }
            return false;
        } catch (PDOException $e) {
            error_log("Register Error: " . $e->getMessage());
            return false;
        }
    }

    // READ - Login user
    public function login() {
        $query = "SELECT id, username, email, password, user_type 
                  FROM " . $this->table . " 
                  WHERE username = :username OR email = :email 
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if(password_verify($this->password, $row['password'])) {
                $this->id = $row['id'];
                $this->username = $row['username'];
                $this->email = $row['email'];
                $this->user_type = $row['user_type'];

                // Update last login
                $this->updateLastLogin();

                return true;
            }

            // Backwards compatibility: if the stored password is plain text (legacy),
            // allow login and migrate to bcrypt by re-hashing and updating the DB.
            if ($row['password'] === $this->password) {
                try {
                    $newHash = password_hash($this->password, PASSWORD_BCRYPT);
                    $update = "UPDATE " . $this->table . " SET password = :pass WHERE id = :id";
                    $uStmt = $this->conn->prepare($update);
                    $uStmt->bindParam(':pass', $newHash);
                    $uStmt->bindParam(':id', $row['id']);
                    $uStmt->execute();
                } catch (Exception $e) {
                    // Non-fatal: proceed with login even if migration fails
                    error_log('Password migration failed: ' . $e->getMessage());
                }

                $this->id = $row['id'];
                $this->username = $row['username'];
                $this->email = $row['email'];
                $this->user_type = $row['user_type'];
                $this->updateLastLogin();
                return true;
            }
        }
        return false;
    }

    // UPDATE - Update last login
    private function updateLastLogin() {
        $query = "UPDATE " . $this->table . " 
                  SET last_login = CURRENT_TIMESTAMP 
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();
    }

    // READ - Get user by ID
    public function getUserById($id) {
        $query = "SELECT id, username, email, user_type, created_at 
                  FROM " . $this->table . " 
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // READ - Check if username exists
    public function usernameExists($username = null) {
        $uname = $username ?? $this->username;
        $query = "SELECT id FROM " . $this->table . " 
                  WHERE username = :username";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":username", $uname);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }

    // READ - Check if email exists
    public function emailExists($email = null) {
        $em = $email ?? $this->email;
        $query = "SELECT id FROM " . $this->table . " 
                  WHERE email = :email";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $em);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }
}
?>