<?php
include('../includes/header.php');
include('../includes/db_connection.php'); // Include your database connection

// Check if the admin exists, otherwise create one
$default_admin = "admin";
$default_password = "Admin@1234"; // Developer's predefined password
$hashed_admin_password = password_hash($default_password, PASSWORD_DEFAULT);

$check_admin = "SELECT * FROM users WHERE user_role='admin' LIMIT 1";
$result = mysqli_query($conn, $check_admin);

///not nessesarry///
if (mysqli_num_rows($result) == 0) {
    // Insert default admin
    $insert_admin = "INSERT INTO users (first_name, last_name, username, email, password_hash, user_role) 
                     VALUES ('System', 'Admin', '$default_admin', 'admin@example.com', '$hashed_admin_password', 'admin')";
    mysqli_query($conn, $insert_admin);
}
//not nessesarry///

// Handle login request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = trim($_POST['input']); // Can be email or username
    $password = $_POST['password'];

    // Query to check either email or username, including dob
    $query = "SELECT user_id, first_name, last_name, username, email, password_hash, phone_number, user_role, dob, profile_picture 
              FROM users WHERE email = ? OR username = ? LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $input, $input); // Bind the same input twice
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['user_role'];
            $_SESSION['profile_picture'] = isset($user['profile_picture']) ? $user['profile_picture'] : null; // Keep as NULL if null
            $_SESSION['name'] = $user['first_name'] . ' ' . $user['last_name'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['phone'] = isset($user['phone_number']) ? $user['phone_number'] : null; // Keep as NULL if null
            $_SESSION['dob'] = $user['dob']; // Add DOB for age calculation
            $_SESSION['gender'] = isset($user['gender']) ? $user['gender'] : null;

            if ($user['user_role'] == 'admin') {
                header("Location: ../admin/admin_dashboard.php");
            } else {
                header("Location: ../index.php");
            }
            exit();
        } else {
            $_SESSION['error'] = "Invalid username/email or password.";
        }
    } else {
        $_SESSION['error'] = "User not found.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="../sweetalert/sweetalert2.min.css">
    <style>
        .login-container {
            max-width: 400px;
            margin: auto;
            padding: 30px;
            background: #ffffff;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }

        body {
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(to right, #4A90E2, #50C9C3);
        }
    </style>
</head>

<body>
    <div class="login-container my-5">
        <h2 class="text-center">Login</h2>

        <?php if (isset($_SESSION['error'])): ?>
            <div class="alert alert-danger"> <?= $_SESSION['error'];
            unset($_SESSION['error']); ?> </div>
        <?php endif; ?>

        <form action="login.php" method="POST" onsubmit="return validateLogin();">
            <div class="mb-3">
                <label for="input" class="form-label">Username or Email</label>
                <input type="text" class="form-control" id="input" name="input" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Login</button>
            <p class="text-center mt-3">Don't have an account? <a href="register.php">Register</a></p>
            <p class="text-center mt-3"><a href="forgot_password.php">Forgot Password?</a></p>
        </form>
    </div>

    <script>
        function validateLogin() {
            let input = document.getElementById("input").value;
            let password = document.getElementById("password").value;

            if (input.trim() === "") {
                alert("Please enter your username or email.");
                return false;
            }
            if (password.length < 8) {
                alert("Password must be at least 8 characters long.");
                return false;
            }
            return true;
        }
    </script>

    <script src="../sweetalert/sweetalert2.min.js"></script>
    <script src="../bootstrap/js/bootstrap.bundle.min.js"></script>
</body>

</html>
<?php include('../includes/footer.php'); ?>