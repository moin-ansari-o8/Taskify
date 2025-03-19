<?php
include('../includes/db_connection.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = $_POST['action'];

    if ($action == "verify_email") {
        $email = $_POST['email'];

        $query = "SELECT security_question FROM users WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($security_question);
            $stmt->fetch();
            echo json_encode(["status" => "success", "question" => $security_question]);
        } else {
            echo json_encode(["status" => "error", "message" => "Email not found!"]);
        }
    }

    if ($action == "verify_answer") {
        $email = $_POST['email'];
        $answer = $_POST['answer'];

        $query = "SELECT user_id, security_answer_hash FROM users WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($user_id, $security_answer_hash);
            $stmt->fetch();
            if (hash_equals($security_answer_hash, crypt($answer, $security_answer_hash))) {
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Incorrect answer!"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Email not found!"]);
        }
    }

    if ($action == "reset_password") {
        $email = $_POST['email'];
        $new_password = password_hash($_POST['password'], PASSWORD_BCRYPT);

        $query = "UPDATE users SET password_hash = ? WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $new_password, $email);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error updating password."]);
        }
    }
}
?>