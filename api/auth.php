<?php
// api/auth.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../includes/session.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]);
    exit();
}

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

$response = array();

// Allow "check" to be performed via GET for client convenience
$action = $_GET['action'] ?? '';
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'check') {
    if (AppSessionHandler::isLoggedIn()) {
        $response['success'] = true;
        $response['user'] = array(
            'id' => AppSessionHandler::getUserId(),
            'username' => AppSessionHandler::getUsername(),
            'user_type' => AppSessionHandler::getUserType()
        );
    } else {
        $response['success'] = false;
        $response['message'] = 'Not logged in';
    }

    echo json_encode($response);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_GET['action'] ?? '';
    
    switch($action) {
        case 'register':
            // Validasi input
            $username = isset($data->username) ? trim($data->username) : '';
            $email = isset($data->email) ? trim($data->email) : '';
            $password = isset($data->password) ? trim($data->password) : '';
            
            if(empty($username) || empty($email) || empty($password)) {
                $response['success'] = false;
                $response['message'] = 'Semua field harus diisi';
            } elseif($user->usernameExists($username)) {
                $response['success'] = false;
                $response['message'] = 'Username sudah digunakan';
            } elseif($user->emailExists($email)) {
                $response['success'] = false;
                $response['message'] = 'Email sudah digunakan';
            } else {
                $user->username = $username;
                $user->email = $email;
                $user->password = $password;
                $user->user_type = 'member'; // Default user type
                
                try {
                    if($user->register()) {
                        $response['success'] = true;
                        $response['message'] = 'Registrasi berhasil! Silakan login.';
                    } else {
                        $response['success'] = false;
                        $response['message'] = 'Registrasi gagal. Coba lagi.';
                    }
                } catch (Exception $e) {
                    $response['success'] = false;
                    $response['message'] = 'Error: ' . $e->getMessage();
                }
            }
            break;
            
        case 'login':
            // Handle both username_email (dari API JS) dan username (dari form biasa)
            $username_input = $data->username_email ?? $data->username ?? '';
            $password_input = $data->password ?? '';
            
            if(empty($username_input) || empty($password_input)) {
                $response['success'] = false;
                $response['message'] = 'Username dan password harus diisi';
            } else {
                $user->username = $username_input;
                $user->email = $username_input; // Juga bisa login dengan email
                $user->password = $password_input;
                
                if($user->login()) {
                    AppSessionHandler::login($user->id, $user->username, $user->user_type);

                    $response['success'] = true;
                    $response['message'] = 'Login berhasil!';
                    $response['user'] = array(
                        'id' => $user->id,
                        'username' => $user->username,
                        'email' => $user->email,
                        'user_type' => $user->user_type
                    );
                } else {
                    // Log failed login for debugging (do not log password)
                    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
                    error_log("Failed login attempt for: $username_input from IP: $ip");

                    $response['success'] = false;
                    $response['message'] = 'Username/email atau password salah';
                }
            }
            break;
            
        case 'logout':
            AppSessionHandler::logout();
            $response['success'] = true;
            $response['message'] = 'Logout berhasil';
            break;
            
        case 'check':
            if(AppSessionHandler::isLoggedIn()) {
                $response['success'] = true;
                $response['user'] = array(
                    'id' => AppSessionHandler::getUserId(),
                    'username' => AppSessionHandler::getUsername(),
                    'user_type' => AppSessionHandler::getUserType()
                );
            } else {
                $response['success'] = false;
                $response['message'] = 'Not logged in';
            }
            break;
            
        default:
            $response['success'] = false;
            $response['message'] = 'Aksi tidak valid';
    }
}

echo json_encode($response);
?>