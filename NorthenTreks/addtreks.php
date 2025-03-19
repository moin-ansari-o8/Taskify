<?php
// Database connection
$conn = new mysqli('localhost', 'root', '', 'northen_treks_db');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve form data
    $trek_name = $_POST['trek_name'];
    $location = $_POST['location'];
    $difficulty = $_POST['difficulty'];
    $duration_days = $_POST['duration_days'];
    $price_per_person = $_POST['price_per_person'];
    $description = $_POST['description'];
    $overview = $_POST['overview'];
    $itinerary = $_POST['itinerary'];
    $how_to_reach = $_POST['how_to_reach'];
    $inclusions = $_POST['inclusions'];
    $exclusions = $_POST['exclusions'];
    $required_equipment = $_POST['required_equipment'];
    $cover_image = $_POST['cover_image'];
    $keywords = $_POST['keywords'];

    // Insert data into the database
    $stmt = $conn->prepare("INSERT INTO treks (trek_name, location, difficulty, duration_days, price_per_person, description, overview, itinerary, how_to_reach, inclusions, exclusions, required_equipment, cover_image, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssiddssssssss", $trek_name, $location, $difficulty, $duration_days, $price_per_person, $description, $overview, $itinerary, $how_to_reach, $inclusions, $exclusions, $required_equipment, $cover_image, $keywords);

    if ($stmt->execute()) {
        echo "<div class='alert alert-success'>Trek details saved successfully.</div>";
    } else {
        echo "<div class='alert alert-danger'>Error: " . $stmt->error . "</div>";
    }

    $stmt->close();
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trek Details Form</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h2 class="text-center">Enter Trek Details</h2>
            </div>
            <div class="card-body">
                <form action="" method="POST">
                    <div class="mb-3">
                        <label for="trek_name" class="form-label">Trek Name:</label>
                        <input type="text" class="form-control" id="trek_name" name="trek_name" required
                            maxlength="100">
                    </div>

                    <div class="mb-3">
                        <label for="location" class="form-label">Location:</label>
                        <input type="text" class="form-control" id="location" name="location" required maxlength="100">
                    </div>

                    <div class="mb-3">
                        <label for="difficulty" class="form-label">Difficulty:</label>
                        <select class="form-select" id="difficulty" name="difficulty" required>
                            <option value="easy">Easy</option>
                            <option value="moderate">Moderate</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="duration_days" class="form-label">Duration (Days):</label>
                        <input type="number" class="form-control" id="duration_days" name="duration_days" required
                            min="1">
                    </div>

                    <div class="mb-3">
                        <label for="price_per_person" class="form-label">Price per Person:</label>
                        <input type="number" step="0.01" class="form-control" id="price_per_person"
                            name="price_per_person" required>
                    </div>

                    <div class="mb-3">
                        <label for="description" class="form-label">Description:</label>
                        <textarea class="form-control" id="description" name="description" rows="3"></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="overview" class="form-label">Overview:</label>
                        <textarea class="form-control" id="overview" name="overview" rows="3"></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="itinerary" class="form-label">Itinerary:</label>
                        <textarea class="form-control" id="itinerary" name="itinerary" rows="3"></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="how_to_reach" class="form-label">How to Reach:</label>
                        <textarea class="form-control" id="how_to_reach" name="how_to_reach" rows="3"></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="inclusions" class="form-label">Inclusions:</label>
                        <textarea class="form-control" id="inclusions" name="inclusions" rows="3"></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="exclusions" class="form-label">Exclusions:</label>
                        <textarea class="form-control" id="exclusions" name="exclusions" rows="3"></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="required_equipment" class="form-label">Required Equipment:</label>
                        <textarea class="form-control" id="required_equipment" name="required_equipment"
                            rows="3"></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="cover_image" class="form-label">Cover Image URL:</label>
                        <input type="text" class="form-control" id="cover_image" name="cover_image" required>
                    </div>

                    <div class="mb-3">
                        <label for="keywords" class="form-label">Add keywords: (Seperated by commas) </label>
                        <input type="text" class="form-control" id="keywords" name="keywords" required>
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Submit</button>
                </form>
            </div>
        </div>
    </div>

    <script src="..\assets\bootstrap\js\bootstrap.bundle.min.js"></script>
</body>

</html>