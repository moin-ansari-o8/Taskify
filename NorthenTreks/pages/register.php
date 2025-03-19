<?php include('../includes/header.php'); ?>
<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

include('../includes/db_connection.php'); // Include your DB connection

$errors = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $first_name = trim($_POST['first_name']);
    $last_name = trim($_POST['last_name']);
    $dob = $_POST['dob'];
    $phone = trim($_POST['phone']);
    $gender = $_POST['gender'];
    $email = trim($_POST['email']);
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $profile_picture = $_FILES['profile_picture'];
    $security_question = $_POST['security_question'];
    $custom_question = $_POST['custom_question'];
    $security_answer = trim($_POST['security_answer']);
    

    // Validate First Name & Last Name
    if (!preg_match("/^[a-zA-Z]{2,30}$/", $first_name)) {
        $errors[] = "First name must contain only letters (2-30 characters).";
    }
    if (!preg_match("/^[a-zA-Z]{2,30}$/", $last_name)) {
        $errors[] = "Last name must contain only letters (2-30 characters).";
    }

    // Validate Date of Birth (User must be at least 13 years old)
    $dob_timestamp = strtotime($dob);
    $age = (int) date('Y') - (int) date('Y', $dob_timestamp);
    if ($age < 13) {
        $errors[] = "You must be at least 13 years old to register.";
    }

    // Validate Phone Number (10-digit Indian format)
    if (!preg_match("/^[6-9]\d{9}$/", $phone)) {
        $errors[] = "Invalid phone number. Must be a 10-digit Indian number.";
    }

    // Validate Email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format.";
    }

    // Validate Username
    if (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username)) {
        $errors[] = "Username must be 3-20 characters and contain only letters, numbers, and underscores.";
    }

    // Validate Password
    if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/[a-z]/', $password) || !preg_match('/[0-9]/', $password) || !preg_match('/[\W]/', $password)) {
        $errors[] = "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.";
    }

    // Confirm Password Match
    if ($password !== $confirm_password) {
        $errors[] = "Passwords do not match.";
    }

    // Check if Email or Username already exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE email=? OR username=?");
    $stmt->bind_param("ss", $email, $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $errors[] = "Username or Email already exists!";
    }
    $stmt->close();

    // Handle Profile Picture Upload
    if (isset($profile_picture) && $profile_picture['error'] == 0) {
        $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
        $file_extension = pathinfo($profile_picture['name'], PATHINFO_EXTENSION);
        $file_size = $profile_picture['size'];

        if (!in_array(strtolower($file_extension), $allowed_extensions)) {
            $errors[] = "Profile picture must be a JPG, JPEG, PNG, or GIF image.";
        }
        if ($file_size > 5 * 1024 * 1024) {
            $errors[] = "Profile picture size must not exceed 5MB.";
        }

        $upload_dir = "../uploads/profile_pictures/";
        $file_name = time() . "_" . basename($profile_picture['name']);
        $upload_file = $upload_dir . $file_name;

        if (!move_uploaded_file($profile_picture['tmp_name'], $upload_file)) {
            $errors[] = "Failed to upload profile picture.";
        }
    }

    if ($security_question === "custom") {
        if (empty($custom_question) || strlen($custom_question) < 5) {
            $errors[] = "Custom security question must be at least 5 characters long.";
        } else {
            $security_question = $custom_question;
        }
    }

    // Validate security answer
    if (empty($security_answer) || strlen($security_answer) < 3) {
        $errors[] = "Security answer must be at least 3 characters long.";
    }

    // If no errors, insert user into database
    if (empty($errors)) {
        $hashed_password = md5($password); // Use md5 for PHP 5.4.10 compatibility
        $query = "INSERT INTO users (first_name, last_name, gender, dob, username, email, password_hash, phone_number, profile_picture, security_question, security_answer_hash, user_role) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'user')";  // 'user' role assigned automatically

        $stmt = $conn->prepare($query);
        $stmt->bind_param("sssssssssss", $first_name, $last_name, $gender, $dob, $username, $email, $hashed_password, $phone, $upload_file, $security_question, $security_answer);

        if ($stmt->execute()) {
            $_SESSION['success'] = "Registration successful! You can now log in.";
            header("Location: login.php");
            exit();
        } else {
            $errors[] = "Database error: " . $conn->error;
        }
    }
}
?>

<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Registration</title>
    <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">

</head>

<body>
    <div class="container my-4">
        <div class="row justify-content-center">
            <div class="col-md-7 col-sm-12">
                <h2 class="mb-4 text-center">Register Here</h2>
                <?php if (!empty($errors)) {
                    echo '<div class="alert alert-danger">' . implode('<br>', $errors) . '</div>';
                } ?>
                <form id="registerForm" action="register.php" method="POST" enctype="multipart/form-data">
                    <div class="row">
                        <div class="col">
                            <label for="first_name">First Name</label>
                            <input type="text" class="form-control" id="first_name" name="first_name" required>
                        </div>
                        <div class="col">
                            <label for="last_name">Last Name</label>
                            <input type="text" class="form-control" id="last_name" name="last_name" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="dob">Date of Birth</label>
                        <input type="date" class="form-control" id="dob" name="dob" required>
                    </div>
                    <div class="row">
                        <div class="col">
                            <label for="phone">Phone</label>
                            <input type="text" class="form-control" id="phone" name="phone" required>
                        </div>
                        <div class="col">
                            <label for="gender">Gender</label>
                            <select class="form-select" id="gender" name="gender" required>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="username">Username</label>
                        <input type="text" class="form-control" id="username" name="username" required>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                        </div>
                        <div class="col">
                            <label for="confirm_password">Confirm Password</label>
                            <input type="password" class="form-control" id="confirm_password" name="confirm_password"
                                required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="profile_picture">Profile Picture</label>
                        <input type="file" class="form-control" id="profile_picture" name="profile_picture"
                            accept="image/*">
                    </div>
                    <div class="mb-3">
                        <label for="security_question">Security Question</label>
                        <select class="form-select" id="security_question" name="security_question" required
                            onchange="toggleCustomQuestion()">
                            <option value="">Select a security question</option>
                            <option value="What was your childhood nickname?">What was your childhood nickname?</option>
                            <option value="What is the name of your first pet?">What is the name of your first pet?
                            </option>
                            <option value="What is your mother's maiden name?">What is your mother's maiden name?
                            </option>
                            <option value="What is your favorite book?">What is your favorite book?</option>
                            <option value="custom">Custom Question</option>
                        </select>
                    </div>

                    <!-- Custom Question Input (Initially Hidden) -->
                    <div class="mb-3" id="custom_question_div" style="display: none;">
                        <label for="custom_question">Custom Security Question</label>
                        <input type="text" class="form-control" id="custom_question" name="custom_question">
                    </div>

                    <div class="mb-3">
                        <label for="security_answer">Security Answer</label>
                        <input type="text" class="form-control" id="security_answer" name="security_answer" required>
                    </div>

                    <script>
                        function toggleCustomQuestion() {
                            var securityQuestion = document.getElementById("security_question");
                            var customQuestionDiv = document.getElementById("custom_question_div");
                            var customQuestionInput = document.getElementById("custom_question");

                            if (securityQuestion.value === "custom") {
                                customQuestionDiv.style.display = "block";
                                customQuestionInput.setAttribute("required", "true");
                            } else {
                                customQuestionDiv.style.display = "none";
                                customQuestionInput.removeAttribute("required");
                            }
                        }
                    </script>

                    <p class="text-center mt-3">Already have an account? <a href="login.php">Login</a></p>
                    <button type="submit" class="btn btn-primary w-100">Register</button>
                </form>
            </div>
        </div>
    </div>
</body>

</html>