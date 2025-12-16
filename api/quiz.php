<?php
// api/quiz.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/quiz.php';
require_once __DIR__ . '/../includes/session.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
	http_response_code(500);
	echo json_encode(['success' => false, 'message' => 'Database connection failed']);
	exit();
}

$quiz = new Quiz($db);

// Helper: check admin
function require_admin() {
	if (!AppSessionHandler::isAdmin()) {
		http_response_code(403);
		echo json_encode(['success' => false, 'message' => 'Admin only']);
		exit();
	}
}

// GET: all quizzes or single quiz
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	if (isset($_GET['id'])) {
		$stmt = $quiz->getById($_GET['id']);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		if ($row) {
			$row['questions'] = $row['questions'];
			echo json_encode(['success' => true, 'quiz' => $row]);
		} else {
			echo json_encode(['success' => false, 'message' => 'Quiz not found']);
		}
	} else {
		$stmt = $quiz->getAll();
		$quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode(['success' => true, 'quizzes' => $quizzes]);
	}
	exit();
}

// POST: create quiz (admin only)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	require_admin();
	$data = json_decode(file_get_contents("php://input"), true);
	if (!$data || !isset($data['title'], $data['questions'])) {
		echo json_encode(['success' => false, 'message' => 'Invalid data']);
		exit();
	}
	$quiz->title = $data['title'];
	$quiz->description = $data['description'] ?? '';
	$quiz->questions = $data['questions'];
	$quiz->created_by = AppSessionHandler::getUserId();
	if ($quiz->create()) {
		echo json_encode(['success' => true, 'id' => $quiz->id]);
	} else {
		echo json_encode(['success' => false, 'message' => 'Failed to create quiz']);
	}
	exit();
}

// PUT: update quiz (admin only)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
	require_admin();
	$data = json_decode(file_get_contents("php://input"), true);
	$id = $_GET['id'] ?? null;
	if (!$id || !$data || !isset($data['title'], $data['questions'])) {
		echo json_encode(['success' => false, 'message' => 'Invalid data']);
		exit();
	}
	$quiz->id = $id;
	$quiz->title = $data['title'];
	$quiz->description = $data['description'] ?? '';
	$quiz->questions = $data['questions'];
	if ($quiz->update()) {
		echo json_encode(['success' => true]);
	} else {
		echo json_encode(['success' => false, 'message' => 'Failed to update quiz']);
	}
	exit();
}

// DELETE: delete quiz (admin only)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
	require_admin();
	$id = $_GET['id'] ?? null;
	if (!$id) {
		echo json_encode(['success' => false, 'message' => 'Quiz ID required']);
		exit();
	}
	$quiz->id = $id;
	if ($quiz->delete()) {
		echo json_encode(['success' => true]);
	} else {
		echo json_encode(['success' => false, 'message' => 'Failed to delete quiz']);
	}
	exit();
}

// OPTIONS: preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(200);
	exit();
}
