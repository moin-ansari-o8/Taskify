<?php include('includes/header.php'); ?>
<?php
// session_start();
require_once 'includes/db_connection.php'; // Include your database connection file

// Redirect to login if not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: pages/login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// Fetch user details
$query = "SELECT first_name, last_name, gender, dob, username, email, phone_number, profile_picture FROM users WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo "User not found!";
    exit();
}

// Handle profile update
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['update_profile'])) {
    $first_name = trim($_POST['first_name']);
    $last_name = trim($_POST['last_name']);
    $phone_number = trim($_POST['phone_number']);

    $update_query = "UPDATE users SET first_name = ?, last_name = ?, phone_number = ? WHERE user_id = ?";
    $stmt = $conn->prepare($update_query);
    $stmt->bind_param("sssi", $first_name, $last_name, $phone_number, $user_id);

    if ($stmt->execute()) {
        $_SESSION['success'] = "Profile updated successfully!";
        header("Location: profile.php");
        exit();
    } else {
        $_SESSION['error'] = "Something went wrong. Try again!";
    }
}

// Handle password change
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['change_password'])) {
    $current_password = $_POST['current_password'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];

    $stmt = $conn->prepare("SELECT password_hash FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->bind_result($password_hash);
    $stmt->fetch();
    $stmt->close();

    if (!password_verify($current_password, $password_hash)) {
        $_SESSION['error'] = "Incorrect current password!";
    } elseif ($new_password !== $confirm_password) {
        $_SESSION['error'] = "New passwords do not match!";
    } else {
        $new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE users SET password_hash = ? WHERE user_id = ?");
        $stmt->bind_param("si", $new_password_hash, $user_id);
        if ($stmt->execute()) {
            $_SESSION['success'] = "Password changed successfully!";
        } else {
            $_SESSION['error'] = "Could not update password!";
        }
    }
    header("Location: profile.php");
    exit();
}

// Handle profile picture upload
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES['profile_picture'])) {
    $target_dir = "uploads/";
    $file_name = basename($_FILES["profile_picture"]["name"]);
    $target_file = $target_dir . time() . "_" . $file_name;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];

    if (!in_array($imageFileType, $allowed_types)) {
        $_SESSION['error'] = "Only JPG, JPEG, PNG, and GIF files are allowed!";
    } elseif ($_FILES["profile_picture"]["size"] > 5000000) {
        $_SESSION['error'] = "File size too large!";
    } else {
        if (move_uploaded_file($_FILES["profile_picture"]["tmp_name"], $target_file)) {
            $stmt = $conn->prepare("UPDATE users SET profile_picture = ? WHERE user_id = ?");
            $stmt->bind_param("si", $target_file, $user_id);
            if ($stmt->execute()) {
                $_SESSION['success'] = "Profile picture updated!";
            } else {
                $_SESSION['error'] = "Error updating profile picture!";
            }
        } else {
            $_SESSION['error'] = "Error uploading file!";
        }
    }
    header("Location: profile.php");
    exit();
}

// Fetch bookings with filters
$where_clauses = ["b.user_id = ?"];
$params = [$user_id];
$param_types = "i";

// Filter by payment status
if (isset($_GET['payment_status']) && in_array($_GET['payment_status'], ['Paid', 'Pending', 'Failed'])) {
    $where_clauses[] = "b.status = ?";
    $params[] = $_GET['payment_status'];
    $param_types .= "s";
}

// Filter by trek name (search)
if (isset($_GET['trek_name']) && !empty(trim($_GET['trek_name']))) {
    $where_clauses[] = "t.trek_name LIKE ?";
    $params[] = "%" . trim($_GET['trek_name']) . "%";
    $param_types .= "s";
}

// Filter by date range
if (isset($_GET['start_date']) && !empty($_GET['start_date'])) {
    $where_clauses[] = "b.created_at >= ?";
    $params[] = $_GET['start_date'];
    $param_types .= "s";
}
if (isset($_GET['end_date']) && !empty($_GET['end_date'])) {
    $where_clauses[] = "b.created_at <= ?";
    $params[] = $_GET['end_date'] . " 23:59:59";
    $param_types .= "s";
}

// Sort by
$sort_column = isset($_GET['sort']) && in_array($_GET['sort'], ['created_at', 'total_cost']) ? $_GET['sort'] : 'created_at';
$sort_order = isset($_GET['order']) && in_array($_GET['order'], ['ASC', 'DESC']) ? $_GET['order'] : 'DESC';

$query = "
    SELECT b.booking_id, b.total_cost, b.status, b.created_at, t.trek_name, ts.start_date, b.num_people, tr.invoice_number
    FROM bookings b
    JOIN treks t ON b.trek_id = t.trek_id
    JOIN trek_slots ts ON b.slot_id = ts.slot_id
    LEFT JOIN transactions tr ON b.booking_id = tr.booking_id
    WHERE " . implode(" AND ", $where_clauses) . "
    ORDER BY $sort_column $sort_order
";
$stmt = $conn->prepare($query);
$stmt->bind_param($param_types, ...$params);
$stmt->execute();
$bookings_result = $stmt->get_result();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile</title>
    <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
</head>

<body>
    <div class="container mt-5">
        <h2>My Profile</h2>

        <?php if (isset($_SESSION['success'])): ?>
            <div class="alert alert-success"><?php echo $_SESSION['success'];
            unset($_SESSION['success']); ?></div>
        <?php endif; ?>

        <?php if (isset($_SESSION['error'])): ?>
            <div class="alert alert-danger"><?php echo $_SESSION['error'];
            unset($_SESSION['error']); ?></div>
        <?php endif; ?>

        <div class="card p-3">
            <div class="text-center">
                <img src="<?php echo isset($user['profile_picture']) && $user['profile_picture'] ? $user['profile_picture'] : '../assets/images/default-profile.png'; ?>"
                    alt="Profile Picture" class="rounded-circle" width="150">
                <form action="profile.php" method="post" enctype="multipart/form-data">
                    <input type="file" name="profile_picture" class="form-control mt-2" required>
                    <button type="submit" class="btn btn-primary btn-sm mt-2">Update Picture</button>
                </form>
            </div>

            <hr>

            <form action="profile.php" method="post">
                <div class="mb-3">
                    <label>First Name</label>
                    <input type="text" name="first_name" class="form-control"
                        value="<?php echo htmlspecialchars($user['first_name']); ?>" required>
                </div>
                <div class="mb-3">
                    <label>Last Name</label>
                    <input type="text" name="last_name" class="form-control"
                        value="<?php echo htmlspecialchars($user['last_name']); ?>" required>
                </div>
                <div class="mb-3">
                    <label>Username</label>
                    <input type="text" class="form-control" value="<?php echo htmlspecialchars($user['username']); ?>"
                        readonly>
                </div>
                <div class="mb-3">
                    <label>Email</label>
                    <input type="email" class="form-control" value="<?php echo htmlspecialchars($user['email']); ?>"
                        readonly>
                </div>
                <div class="mb-3">
                    <label>Phone Number</label>
                    <input type="text" name="phone_number" class="form-control"
                        value="<?php echo htmlspecialchars($user['phone_number']); ?>">
                </div>
                <button type="submit" name="update_profile" class="btn btn-success">Update Profile</button>
            </form>

            <hr>

            <h4>Change Password</h4>
            <form action="profile.php" method="post">
                <div class="mb-3">
                    <label>Current Password</label>
                    <input type="password" name="current_password" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label>New Password</label>
                    <input type="password" name="new_password" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label>Confirm Password</label>
                    <input type="password" name="confirm_password" class="form-control" required>
                </div>
                <button type="submit" name="change_password" class="btn btn-warning">Change Password</button>
            </form>
        </div>

        <!-- Bookings Section -->
        <div class="card mt-5 p-3">
            <h4>My Bookings</h4>

            <!-- Filters -->
            <form method="GET" class="mb-3">
                <div class="row">
                    <div class="col-md-3">
                        <label>Payment Status</label>
                        <select name="payment_status" class="form-control">
                            <option value="">All</option>
                            <option value="Paid" <?php echo isset($_GET['payment_status']) && $_GET['payment_status'] == 'Paid' ? 'selected' : ''; ?>>Paid</option>
                            <option value="Pending" <?php echo isset($_GET['payment_status']) && $_GET['payment_status'] == 'Pending' ? 'selected' : ''; ?>>Pending</option>
                            <option value="Failed" <?php echo isset($_GET['payment_status']) && $_GET['payment_status'] == 'Failed' ? 'selected' : ''; ?>>Failed</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label>Trek Name</label>
                        <input type="text" name="trek_name" class="form-control"
                            value="<?php echo isset($_GET['trek_name']) ? htmlspecialchars($_GET['trek_name']) : ''; ?>"
                            placeholder="Search trek name">
                    </div>
                    <div class="col-md-2">
                        <label>Start Date</label>
                        <input type="date" name="start_date" class="form-control"
                            value="<?php echo isset($_GET['start_date']) ? htmlspecialchars($_GET['start_date']) : ''; ?>">
                    </div>
                    <div class="col-md-2">
                        <label>End Date</label>
                        <input type="date" name="end_date" class="form-control"
                            value="<?php echo isset($_GET['end_date']) ? htmlspecialchars($_GET['end_date']) : ''; ?>">
                    </div>
                    <div class="col-md-2">
                        <label>&nbsp;</label>
                        <button type="submit" class="btn btn-primary w-100">Filter</button>
                    </div>
                </div>
            </form>

            <!-- Sort Links -->
            <div class="mb-3">
                Sort by:
                <a
                    href="?<?php echo http_build_query(array_merge($_GET, ['sort' => 'created_at', 'order' => $sort_order == 'DESC' ? 'ASC' : 'DESC'])); ?>">Booking
                    Date <?php echo $sort_column == 'created_at' ? ($sort_order == 'DESC' ? '↓' : '↑') : ''; ?></a> |
                <a
                    href="?<?php echo http_build_query(array_merge($_GET, ['sort' => 'total_cost', 'order' => $sort_order == 'DESC' ? 'ASC' : 'DESC'])); ?>">Total
                    Cost <?php echo $sort_column == 'total_cost' ? ($sort_order == 'DESC' ? '↓' : '↑') : ''; ?></a>
            </div>

            <!-- Bookings Table -->
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Trek Name</th>
                        <th>Slot Date</th>
                        <th>People</th>
                        <th>Total Cost</th>
                        <th>Payment Status</th>
                        <th>Invoice Number</th>
                        <th>Date Booked</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($bookings_result->num_rows > 0): ?>
                        <?php while ($booking = $bookings_result->fetch_assoc()): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($booking['booking_id']); ?></td>
                                <td><?php echo htmlspecialchars($booking['trek_name']); ?></td>
                                <td><?php echo date('d-M-Y', strtotime($booking['start_date'])); ?></td>
                                <td><?php echo htmlspecialchars($booking['num_people']); ?></td>
                                <td>₹<?php echo number_format($booking['total_cost'], 2); ?></td>
                                <td><?php echo htmlspecialchars($booking['status']); ?></td>
                                <td><?php echo htmlspecialchars($booking['invoice_number'] ?: 'N/A'); ?></td>
                                <td><?php echo date('d-M-Y H:i', strtotime($booking['created_at'])); ?></td>
                                <td>
                                <a href="booking_success.php?booking_id=<?php echo urlencode($booking['booking_id']); ?>&invoice=<?php echo urlencode(isset($booking['invoice_number']) && $booking['invoice_number'] ? $booking['invoice_number'] : ''); ?>"
                                        class="btn btn-sm btn-info" target="_blank">Print</a>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="8" class="text-center">No bookings found.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script src="../assets/bootstrap/js/bootstrap.bundle.min.js"></script>
</body>

</html>