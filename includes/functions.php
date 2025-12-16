<?php
// includes/functions.php

// 1. Fungsi untuk sanitasi input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// 2. Fungsi untuk validasi email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// 3. Fungsi untuk validasi password strength
function validatePassword($password) {
    // Minimal 8 karakter, mengandung huruf besar, kecil, dan angka
    $pattern = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/';
    return preg_match($pattern, $password);
}

// 4. Fungsi untuk format tanggal Indonesia
function formatDateIndonesia($date_string) {
    $months = array(
        'January' => 'Januari',
        'February' => 'Februari',
        'March' => 'Maret',
        'April' => 'April',
        'May' => 'Mei',
        'June' => 'Juni',
        'July' => 'Juli',
        'August' => 'Agustus',
        'September' => 'September',
        'October' => 'Oktober',
        'November' => 'November',
        'December' => 'Desember'
    );
    
    $date = new DateTime($date_string);
    $formatted = $date->format('d F Y H:i');
    
    return strtr($formatted, $months);
}

// 5. Fungsi untuk generate rating stars
function generateStars($rating) {
    $stars = '';
    $fullStars = floor($rating);
    $halfStar = ($rating - $fullStars) >= 0.5;
    
    for ($i = 1; $i <= 5; $i++) {
        if ($i <= $fullStars) {
            $stars .= '<span class="star full">★</span>';
        } elseif ($halfStar && $i == $fullStars + 1) {
            $stars .= '<span class="star half">★</span>';
        } else {
            $stars .= '<span class="star empty">☆</span>';
        }
    }
    
    return $stars;
}

// 6. Fungsi untuk cek dan create session flash message
function setFlashMessage($type, $message) {
    $_SESSION['flash_message'] = array(
        'type' => $type, // 'success', 'error', 'warning', 'info'
        'message' => $message
    );
}

function getFlashMessage() {
    if(isset($_SESSION['flash_message'])) {
        $message = $_SESSION['flash_message'];
        unset($_SESSION['flash_message']);
        return $message;
    }
    return null;
}

// 7. Fungsi untuk redirect dengan pesan
function redirectWithMessage($url, $type, $message) {
    setFlashMessage($type, $message);
    header("Location: $url");
    exit();
}

// 8. Fungsi untuk generate CSRF token
function generateCsrfToken() {
    if(empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCsrfToken($token) {
    return isset($_SESSION['csrf_token']) && 
           hash_equals($_SESSION['csrf_token'], $token);
}

// 9. Fungsi untuk logging aktivitas
function logActivity($activity, $user_id = null) {
    $log_file = '../logs/activity.log';
    $timestamp = date('Y-m-d H:i:s');
    $user_id = $user_id ?? (isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'Guest');
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
    
    $log_entry = "[$timestamp] [IP: $ip_address] [User ID: $user_id] - $activity\n";
    
    file_put_contents($log_file, $log_entry, FILE_APPEND);
}

// 10. Fungsi untuk upload gambar (avatar/user)
function uploadImage($file, $target_dir = "../uploads/") {
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
    $max_size = 2 * 1024 * 1024; // 2MB
    
    if($file['error'] !== UPLOAD_ERR_OK) {
        return array('success' => false, 'message' => 'Error uploading file');
    }
    
    if(!in_array($file['type'], $allowed_types)) {
        return array('success' => false, 'message' => 'File type not allowed');
    }
    
    if($file['size'] > $max_size) {
        return array('success' => false, 'message' => 'File too large (max 2MB)');
    }
    
    // Create directory if not exists
    if(!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    
    $file_ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $new_filename = uniqid() . '.' . $file_ext;
    $target_path = $target_dir . $new_filename;
    
    if(move_uploaded_file($file['tmp_name'], $target_path)) {
        return array('success' => true, 'filename' => $new_filename, 'path' => $target_path);
    } else {
        return array('success' => false, 'message' => 'Failed to save file');
    }
}
?>