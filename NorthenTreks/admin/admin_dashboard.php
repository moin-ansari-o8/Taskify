
<?php include('../includes/header.php'); ?>
<?php
require_once '../includes/db_connection.php';

// Start session
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Redirect if not admin
if (!isset($_SESSION['user_id']) || (isset($_SESSION['role']) && $_SESSION['role'] !== 'admin')) {
    header("Location: ../index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="../assets/css/admin.css">
    <script src="../assets/jquery-3.7.1.min.js"></script>
</head>

<body>
    <div class="d-flex">
        <!-- Sidebar -->
        <nav class="bg-dark vh-100 p-3" style="width: 250px;">
            <h4 class="text-center">Admin Panel</h4>
            <ul class="nav flex-column">
                <li class="nav-item"><a href="#" class="nav-link text-white" onclick="loadPage('users')">Users</a></li>
                <li class="nav-item"><a href="#" class="nav-link text-white" onclick="loadPage('treks')">Treks</a></li>
                <li class="nav-item"><a href="#" class="nav-link text-white" onclick="loadPage('guides')">Guides</a>
                </li>
                <li class="nav-item"><a href="#" class="nav-link text-white" onclick="loadPage('billing')">Billing</a>
                </li>
                <li class="nav-item"><a href="#" class="nav-link text-white" onclick="loadPage('content')">Content</a>
                </li>
                <li class="nav-item"><a href="#" class="nav-link text-white" onclick="loadPage('manage_rental_gear')">Manage
                        Rental Gear</a>

                </li>
                <li class="nav-item"><a href="../pages/logout.php" class="nav-link text-danger">Logout</a></li>
            </ul>
        </nav>

        <!-- Main Content -->
        <div class="container-fluid p-4" id="content-area">
            <h3>Welcome to the Admin Dashboard</h3>
            <p>Select a section from the sidebar.</p>
        </div>
    </div>

    <script>
        function loadPage(page) {
            $("#content-area").html("<h4>Loading...</h4>");
            $.ajax({
                url: "actions/" + page + ".php",
                success: function (response) {
                    $("#content-area").html(response);
                },
                error: function () {
                    $("#content-area").html("<h4>Error loading the page.</h4>");
                }
            });
        }
    </script>
</body>

</html>
<?php include('../includes/footer.php'); ?>