<?php
// includes/session.php

session_start();

class AppSessionHandler {
    
    public static function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }
    
    public static function login($user_id, $username, $user_type) {
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $username;
        $_SESSION['user_type'] = $user_type;
        $_SESSION['login_time'] = time();
    }
    
    public static function logout() {
        session_unset();
        session_destroy();
    }
    
    public static function getUserId() {
        return $_SESSION['user_id'] ?? null;
    }
    
    public static function getUsername() {
        return $_SESSION['username'] ?? null;
    }
    
    public static function getUserType() {
        return $_SESSION['user_type'] ?? null;
    }
    
    public static function isAdmin() {
        return ($_SESSION['user_type'] ?? '') === 'admin';
    }
    
    public static function checkLogin() {
        if (!self::isLoggedIn()) {
            header("Location: ../login.php");
            exit();
        }
    }
    
    public static function checkAdmin() {
        self::checkLogin();
        if (!self::isAdmin()) {
            header("Location: ../index.php");
            exit();
        }
    }
}
?>