<?php
// models/user.php

class user {

    private $conn;
    private $table = 'users';

    public $id = null;
    public $username = '';
    public $email = '';
    public $password = '';
    public $user_type = 'member';

    public function __construct($db) {
        $this->conn = $db;
    }

    // =========================
    // REGISTER
    // =========================
    public function register(): bool {
        $sql = "INSERT INTO {$this->table}
                (username, email, password, user_type)
                VALUES (:username, :email, :password, :user_type)";

        try {
            $stmt = $this->conn->prepare($sql);
            $hash = password_hash($this->password, PASSWORD_BCRYPT);

            return $stmt->execute([
                ':username'  => $this->username,
                ':email'     => $this->email,
                ':password'  => $hash,
                ':user_type' => $this->user_type
            ]);
        } catch (PDOException $e) {
            error_log('Register error: ' . $e->getMessage());
            return false;
        }
    }

    // =========================
    // LOGIN
    // =========================
    public function login(): bool {

        $sql = "SELECT id, username, email, password, user_type
                FROM {$this->table}
                WHERE username = :username OR email = :email
                LIMIT 1";

        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                ':username' => $this->username,
                ':email'    => $this->email
            ]);

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$row) {
                return false;
            }

            // bcrypt
            if (password_verify($this->password, $row['password'])) {
                $this->hydrateUser($row);
                $this->updateLastLogin();
                return true;
            }

            // legacy plaintext
            if ($row['password'] === $this->password) {
                $this->migratePassword($row['id'], $this->password);
                $this->hydrateUser($row);
                $this->updateLastLogin();
                return true;
            }

            return false;

        } catch (PDOException $e) {
            error_log('Login error: ' . $e->getMessage());
            return false;
        }
    }

    // =========================
    // EXISTS CHECK
    // =========================
    public function usernameExists($username = null): bool {
        $stmt = $this->conn->prepare(
            "SELECT id FROM {$this->table} WHERE username = :u LIMIT 1"
        );
        $stmt->execute([':u' => $username ?? $this->username]);
        return (bool)$stmt->fetch();
    }

    public function emailExists($email = null): bool {
        $stmt = $this->conn->prepare(
            "SELECT id FROM {$this->table} WHERE email = :e LIMIT 1"
        );
        $stmt->execute([':e' => $email ?? $this->email]);
        return (bool)$stmt->fetch();
    }

    // =========================
    // INTERNAL
    // =========================
    private function hydrateUser(array $row): void {
        $this->id        = (int)$row['id'];
        $this->username  = $row['username'];
        $this->email     = $row['email'];
        $this->user_type = $row['user_type'];
    }

    private function updateLastLogin(): void {
        try {
            $stmt = $this->conn->prepare(
                "UPDATE {$this->table} SET last_login = NOW() WHERE id = :id"
            );
            $stmt->execute([':id' => $this->id]);
        } catch (PDOException $e) {
            error_log('Last login update failed: ' . $e->getMessage());
        }
    }

    private function migratePassword($id, $plainPassword): void {
        try {
            $hash = password_hash($plainPassword, PASSWORD_BCRYPT);
            $stmt = $this->conn->prepare(
                "UPDATE {$this->table} SET password = :p WHERE id = :id"
            );
            $stmt->execute([':p' => $hash, ':id' => $id]);
        } catch (PDOException $e) {
            error_log('Password migration failed: ' . $e->getMessage());
        }
    }
}
