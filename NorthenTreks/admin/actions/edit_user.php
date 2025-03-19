<?php
require_once '../../includes/db_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user_id = $_POST['user_id'];
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $email = $_POST['email'];
    $phone_number = $_POST['phone_number'];
    $user_role = $_POST['user_role'];

    $stmt = $conn->prepare("UPDATE users SET first_name=?, last_name=?, email=?, phone_number=?, user_role=? WHERE user_id=?");
    $stmt->bind_param("sssssi", $first_name, $last_name, $email, $phone_number, $user_role, $user_id);

    if ($stmt->execute()) {
        echo "User updated successfully!";
    } else {
        echo "Error: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
}
?>