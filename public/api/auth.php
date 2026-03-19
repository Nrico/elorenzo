<?php
// public/api/auth.php

function isAuthenticated() {
    $headers = null;
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
    }
    
    $authHeader = '';
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }

    $token = trim(str_replace('Bearer', '', $authHeader));
    
    // The same static expected token based on the passphrase
    // MUST match login.php
    $CORRECT_PASSPHRASE = 'highdesert';
    $expected = hash('sha256', $CORRECT_PASSPHRASE . 'elorenzo_salt_2024');
    
    return $token === $expected;
}

function requireAuth() {
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        return; // Preflight requests should not be blocked here
    }
    
    if (!isAuthenticated()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
}
?>
