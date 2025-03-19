<?php
require_once('../../includes/db_connection.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = isset($_POST['action']) ? $_POST['action'] : '';

    if ($action == "add") {
        // Add new gear
        $gear_name = $_POST['gear_name'];
        $description = $_POST['description'];
        $price = $_POST['price'];
        $stock = $_POST['stock'];

        $sql = "INSERT INTO rental_gear (gear_name, description, price_per_day, stock) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssdi", $gear_name, $description, $price, $stock);

        if ($stmt->execute()) {
            echo "<p style='color: green;'>Gear added successfully!</p>";
        } else {
            echo "<p style='color: red;'>Error: " . $conn->error . "</p>";
        }
        $stmt->close();

    } elseif ($action == "update") {
        // Update gear details
        $gear_id = $_POST['gear_id'];
        $gear_name = $_POST['gear_name'];
        $price = $_POST['price'];
        $stock = $_POST['stock'];

        $sql = "UPDATE rental_gear SET gear_name=?, price_per_day=?, stock=? WHERE gear_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("siii", $gear_name, $price, $stock, $gear_id);

        if ($stmt->execute()) {
            echo "<p style='color: green;'>Gear updated successfully!</p>";
        } else {
            echo "<p style='color: red;'>Error: " . $conn->error . "</p>";
        }
        $stmt->close();

    } elseif ($action == "delete") {
        // Delete gear
        $gear_id = $_POST['gear_id'];
        $sql = "DELETE FROM rental_gear WHERE gear_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $gear_id);

        if ($stmt->execute()) {
            echo "<p style='color: green;'>Gear deleted successfully!</p>";
        } else {
            echo "<p style='color: red;'>Error: " . $conn->error . "</p>";
        }
        $stmt->close();
    }
}
?>