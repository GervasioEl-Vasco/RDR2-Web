<?php
// api/comments.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000"); // Ganti dengan domain frontend Anda
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/komentar.php';
require_once __DIR__ . '/../includes/session.php';

$database = new Database();
$db = $database->getConnection();
$comment = new CharacterComment($db);

$data = json_decode(file_get_contents("php://input"));
$response = array();

// Periksa login untuk operasi selain GET
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    if (!AppSessionHandler::isLoggedIn()) {
        $response['success'] = false;
        $response['message'] = 'Anda harus login untuk melakukan aksi ini';
        echo json_encode($response);
        exit();
    }
}

switch($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $character = $_GET['character'] ?? '';
        
        if(!empty($character)) {
            $stmt = $comment->getByCharacter($character);
            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Get average rating
            $ratingData = $comment->getAverageRating($character);
            
            $response['success'] = true;
            $response['comments'] = $comments;
            $response['rating_data'] = $ratingData;
        } else {
            $stmt = $comment->getAll();
            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $response['success'] = true;
            $response['comments'] = $comments;
        }
        break;
        
    case 'POST':
        if(empty($data->character_name) || empty($data->comment) || empty($data->rating)) {
            $response['success'] = false;
            $response['message'] = 'Semua field harus diisi';
        } else {
            $comment->user_id = AppSessionHandler::getUserId();
            $comment->character_name = $data->character_name;
            $comment->comment = $data->comment;
            $comment->rating = $data->rating;
            
            if($comment->create()) {
                $response['success'] = true;
                $response['message'] = 'Komentar berhasil ditambahkan';
            } else {
                $response['success'] = false;
                $response['message'] = 'Gagal menambahkan komentar';
            }
        }
        break;
        
    case 'PUT':
        $comment->id = $data->id;
        $comment->user_id = AppSessionHandler::getUserId();
        $comment->comment = $data->comment;
        $comment->rating = $data->rating;
        
        if($comment->update()) {
            $response['success'] = true;
            $response['message'] = 'Komentar berhasil diupdate';
        } else {
            $response['success'] = false;
            $response['message'] = 'Gagal mengupdate komentar';
        }
        break;
        
    case 'DELETE':
        $comment_id = $_GET['id'] ?? $data->id ?? 0;
        
        if(AppSessionHandler::isAdmin()) {
            $comment->id = $comment_id;
            if($comment->adminDelete()) {
                $response['success'] = true;
                $response['message'] = 'Komentar berhasil dihapus (admin)';
            } else {
                $response['success'] = false;
                $response['message'] = 'Gagal menghapus komentar';
            }
        } else {
            $comment->id = $comment_id;
            $comment->user_id = AppSessionHandler::getUserId();
            
            if($comment->delete()) {
                $response['success'] = true;
                $response['message'] = 'Komentar berhasil dihapus';
            } else {
                $response['success'] = false;
                $response['message'] = 'Gagal menghapus komentar';
            }
        }
        break;
        
    default:
        $response['success'] = false;
        $response['message'] = 'Method tidak diizinkan';
}

echo json_encode($response);
?>