<?php
// Define database connection parameters
$host = 'localhost'; // Database server (usually 'localhost' for local development)
$username = 'root'; // Your MySQL username
$password = ''; // Your MySQL password
$dbname = 'northen_treks_db'; // Your database name

// Create connection
$conn = mysqli_connect($host, $username, $password, $dbname);

// Check if connection is successful
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Optionally, you can set the character set to UTF-8 for proper encoding
mysqli_set_charset($conn, 'utf8');

// You can use $conn variable in your queries now
?>
