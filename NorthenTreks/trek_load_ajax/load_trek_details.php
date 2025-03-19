<?php
// Database connection
include('../includes/db_connection.php');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $trekId = isset($_POST['trek_id']) ? $_POST['trek_id'] : null;
    $type = isset($_POST['type']) ? $_POST['type'] : null;

    if ($trekId && $type) {
        // Determine the correct column to fetch
        $column = "";
        switch ($type) {
            case "inclusion":
                $column = "inclusions";
                break;
            case "exclusion":
                $column = "exclusions";
                break;
            case "equipment":
                $column = "required_equipment";
                break;
            default:
                echo "<p>Invalid request.</p>";
                exit;
        }

        // Fetch trek data
        $stmt = $conn->prepare("SELECT $column FROM treks WHERE trek_id = ?");
        $stmt->bind_param("i", $trekId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo nl2br(htmlspecialchars($row[$column])); // Display formatted text
        } else {
            echo "<p>No information available.</p>";
        }

        $stmt->close();
    } else {
        echo "<p>Invalid request.</p>";
    }
}

$conn->close();
?>