<?php
// api/quiz_attempt.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000"); // Ganti dengan domain frontend Anda
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/quiz_attempt.php';
require_once __DIR__ . '/../includes/session.php';

$database = new Database();
$db = $database->getConnection();
$attempt = new QuizAttempt($db);

$data = json_decode(file_get_contents("php://input"));
$response = array();

switch($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        // Must be logged in
        if (!AppSessionHandler::isLoggedIn()) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Login required']);
            exit();
        }

        $quiz_id = $data->quiz_id ?? 0;
        $score = $data->score ?? 0;
        $total = $data->total_questions ?? 0;
        $answers = $data->answers ?? null;

        if (!$quiz_id || $total <= 0) {
            $response['success'] = false;
            $response['message'] = 'Invalid payload';
            break;
        }

        $attempt->quiz_id = $quiz_id;
        $attempt->user_id = AppSessionHandler::getUserId();
        $attempt->score = $score;
        $attempt->total_questions = $total;
        $attempt->answers = $answers ? json_encode($answers, JSON_UNESCAPED_UNICODE) : null;

        if ($attempt->create()) {
            $response['success'] = true;
            $response['message'] = 'Attempt recorded';
        } else {
            $response['success'] = false;
            $response['message'] = 'Failed to record attempt';
        }
        break;

    case 'GET':
        // If admin and query params present, return those; else return current user's attempts
        $user_id = $_GET['user_id'] ?? null;
        $quiz_id = $_GET['quiz_id'] ?? null;

        if ($user_id) {
            if (!AppSessionHandler::isAdmin()) {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Admin access required']);
                exit();
            }
            $stmt = $attempt->getByUser($user_id);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $response['success'] = true;
            $response['attempts'] = $rows;
            break;
        }

        if ($quiz_id) {
            if (!AppSessionHandler::isAdmin()) {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Admin access required']);
                exit();
            }
            $stmt = $attempt->getByQuiz($quiz_id);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $response['success'] = true;
            $response['attempts'] = $rows;
            break;
        }

        // Default: return current user's attempts
        if (!AppSessionHandler::isLoggedIn()) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Login required']);
            exit();
        }

        $currentUserId = AppSessionHandler::getUserId();
        $stmt = $attempt->getByUser($currentUserId);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $response['success'] = true;
        $response['attempts'] = $rows;
        break;

    default:
        $response['success'] = false;
        $response['message'] = 'Method not allowed';
}

echo json_encode($response);

?>
