<?php
session_start();
header("Content-Type: application/json; charset=utf-8");
require __DIR__ . "/koneksi.php";

if (!$conn) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database tidak dapat dihubungkan."]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    echo json_encode([
        "authenticated" => isset($_SESSION["username"]),
        "username" => $_SESSION["username"] ?? null
    ]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Metode tidak diizinkan."]);
    exit;
}

if (($_POST["action"] ?? "") === "logout") {
    $_SESSION = [];
    session_destroy();
    echo json_encode(["success" => true]);
    exit;
}

$username = trim($_POST["username"] ?? "");
$password = $_POST["password"] ?? "";

$statement = mysqli_prepare($conn, "SELECT username FROM akun WHERE username = ? AND password = ? LIMIT 1");
mysqli_stmt_bind_param($statement, "ss", $username, $password);
mysqli_stmt_execute($statement);
$result = mysqli_stmt_get_result($statement);
$account = mysqli_fetch_assoc($result);
mysqli_stmt_close($statement);

if (!$account) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Nama atau password tidak sesuai."]);
    exit;
}

session_regenerate_id(true);
$_SESSION["username"] = $account["username"];
echo json_encode(["success" => true]);
?>