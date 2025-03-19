<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="../assets/css/header-css.css">
    <!-- Bootstrap Icons CSS -->
    <link rel="stylesheet" href="../assets/bootstrap-icons/font/bootstrap-icons.css">
</head>

<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow">
        <div class="container">
            <!-- Logo -->
            <a class="navbar-brand" href="../index.php">
                <img src="../assets/images/2_objectscombinedlogo.png" alt="Logo" width="auto" height="40"
                    class="d-inline-block align-text-top">
            </a>
            <!-- Navbar Toggle (For Mobile View) -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <!-- Navbar Links -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <!-- Profile Link or Login -->
                    <li class="nav-item">
                        <?php
                        $profileLink = isset($_SESSION['user_id']) ? 'profile.php' : '../pages/login.php';
                        $profileText = isset($_SESSION['user_id']) ? 'Profile' : 'Login';

                        // Check if profile picture is set and exists
                        $profilePicture = isset($_SESSION['profile_picture']) && $_SESSION['profile_picture'] 
                            ? htmlspecialchars($_SESSION['profile_picture'], ENT_QUOTES, 'UTF-8') 
                            : '../assets/images/default-profile.png';
                            // echo $profilePicture //uncomment if any problem in code
                        ?>
                        <a class="nav-link" href="<?php echo $profileLink; ?>">
                            <?php if (isset($_SESSION['user_id'])): ?>
                                <img src="<?php echo $profilePicture; ?>" class="rounded-circle" alt="Profile" width="30"
                                    height="30">
                            <?php endif; ?>
                            <?php echo $profileText; ?>
                        </a>
                    </li>

                    <!-- Show Logout if session is active -->
                    <?php if (isset($_SESSION['user_id'])): ?>
                        <li class="nav-item">
                            <a class="nav-link" href="..\pages\logout.php">Logout</a>
                        </li>
                    <?php endif; ?>

                    <!-- Other links -->
                    <li class="nav-item">
                        <a class="nav-link" href="../pages/about.php">About Us</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../pages/rental.php">Rent Gears</a>
                    </li>
                </ul>
                <!-- Search Bar -->
                <form class="d-flex ms-3" action="search.php" method="get">
                    <input class="form-control me-2" type="search" name="query" placeholder="Search"
                        aria-label="Search">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </div>
    </nav>

    <!-- Logout Script (logout.php) -->
    <?php
    // logout.php
    if (isset($_GET['action']) && $_GET['action'] == 'logout') {
        session_start();
        session_unset(); // Unset session variables
        session_destroy(); // Destroy the session
        header("Location: login.php"); // Redirect to login page
        exit();
    }
    ?>
</body>

</html>