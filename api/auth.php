<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://rdr2.beevolution24.my.id");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

ini_set('session.cookie_secure', 1);
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Lax');

session_start();

// LOAD DEPENDENCIES
require_once $_SERVER['DOCUMENT_ROOT'] . '/config/database.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/models/user.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/includes/session.php';

// DATABASE
$db = (new Database())->getConnection();
if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB error']);
    exit;
}

$user = new User($db);

// INPUT (JSON / FORM)
$raw  = file_get_contents("php://input");
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

// ACTION
$action   = $_GET['action'] ?? '';
$response = ['success' => false];

// AUTH CHECK
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'check') {

    echo json_encode([
        'success' => AppSessionHandler::isLoggedIn(),
        'user' => AppSessionHandler::isLoggedIn() ? [
            'id' => AppSessionHandler::getUserId(),
            'username' => AppSessionHandler::getUsername(),
            'user_type' => AppSessionHandler::getUserType()
        ] : null
    ]);
    exit;
}

// POST ACTIONS
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // -------- REGISTER --------
    if ($action === 'register') {

        $user->username  = trim($data['username'] ?? '');
        $user->email     = trim($data['email'] ?? '');
        $user->password  = trim($data['password'] ?? '');
        $user->user_type = 'member';

        if (!$user->username || !$user->email || !$user->password) {
            $response['message'] = 'Semua field wajib diisi';
        } elseif ($user->usernameExists()) {
            $response['message'] = 'Username sudah digunakan';
        } elseif ($user->emailExists()) {
            $response['message'] = 'Email sudah digunakan';
        } elseif ($user->register()) {
            $response = ['success' => true, 'message' => 'Registrasi berhasil'];
        } else {
            $response['message'] = 'Registrasi gagal';
        }
    }

    elseif ($action === 'login') {

        $user->username = trim($data['username_email'] ?? $data['username'] ?? '');
        $user->email    = $user->username;
        $user->password = trim($data['password'] ?? '');

        if (!$user->username || !$user->password) {
            $response['message'] = 'Username dan password wajib';
        } elseif ($user->login()) {

            AppSessionHandler::login(
                $user->id,
                $user->username,
                $user->user_type
            );

            $response = [
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'user_type' => $user->user_type
                ]
            ];
        } else {
            $response['message'] = 'Login gagal';
        }
    }

    elseif ($action === 'logout') {
        AppSessionHandler::logout();
        $response = ['success' => true];
    }

    else {
        $response['message'] = 'Aksi tidak valid';
    }

    echo json_encode($response);
    exit;
}
