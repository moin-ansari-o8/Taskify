<?php
include('../includes/db_connection.php');
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password</title>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
    <script src="../assets/jquery-3.7.1.min.js"></script>
    <script src="../assets/sweetalert/sweetalert2.min.js"></script> <!-- SweetAlert CDN -->
    <link rel="stylesheet" href="../assets/sweetalert/sweetalert2.min.css">

    <style>
        body {
            background: linear-gradient(to right, #4b6cb7, #182848);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 30px;
            color: white;
            width: 100%;
            max-width: 450px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .btn-custom {
            background-color: #4b6cb7;
            border: none;
            color: white;
            transition: 0.3s;
        }

        .btn-custom:hover {
            background-color: #3b5998;
        }

        .form-control {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
        }

        .form-control::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }

        .hidden {
            display: none;
        }
    </style>
</head>

<body>

    <div class="card shadow-lg text-center">
        <h3 class="mb-3">Forgot Password</h3>

        <!-- Email Section -->
        <div id="email-section">
            <label class="form-label">Enter your email</label>
            <input type="email" id="email" class="form-control mb-2" placeholder="example@email.com" required>
            <button class="btn btn-custom w-100" onclick="verifyEmail()">Submit</button>
        </div>

        <!-- Security Question Section (Hidden Initially) -->
        <div id="security-section" class="hidden">
            <label id="security-question" class="form-label"></label>
            <input type="text" id="security-answer" class="form-control mb-2" placeholder="Your Answer" required>
            <button class="btn btn-custom w-100" onclick="verifyAnswer()">Verify</button>
        </div>

        <!-- Password Reset Section (Hidden Initially) -->
        <div id="reset-section" class="hidden">
            <label class="form-label">Enter new password</label>
            <input type="password" id="new-password" class="form-control mb-2" placeholder="New Password" required>
            <button class="btn btn-custom w-100" onclick="resetPassword()">Reset Password</button>
        </div>
    </div>

    <script>
        function verifyEmail() {
            var email = $("#email").val();
            $.post("forgot_password_process.php", { action: "verify_email", email: email }, function (response) {
                var res = JSON.parse(response);
                if (res.status === "success") {
                    $("#email-section").hide();
                    $("#security-question").text(res.question);
                    $("#security-section").removeClass("hidden");
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.message
                    });
                }
            });
        }

        function verifyAnswer() {
            var email = $("#email").val();
            var answer = $("#security-answer").val();
            $.post("forgot_password_process.php", { action: "verify_answer", email: email, answer: answer }, function (response) {
                var res = JSON.parse(response);
                if (res.status === "success") {
                    $("#security-section").hide();
                    $("#reset-section").removeClass("hidden");
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Wrong Answer!',
                        text: res.message
                    });
                }
            });
        }

        function resetPassword() {
            var email = $("#email").val();
            var newPassword = $("#new-password").val();
            $.post("forgot_password_process.php", { action: "reset_password", email: email, password: newPassword }, function (response) {
                var res = JSON.parse(response);
                if (res.status === "success") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Password Updated!',
                        text: 'Redirecting to login...',
                        timer: 3000,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = "login.php";
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: res.message
                    });
                }
            });
        }
    </script>

</body>

</html>