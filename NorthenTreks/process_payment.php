<?php
session_start();
include('includes/db_connection.php');


// var_dump($_POST);
// Check if payment data exists
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['payment_success'], $_POST['trek_id'], $_POST['slot_id'], $_POST['num_people'], $_POST['slot_date'], $_POST['rental_gear'], $_POST['total_cost'])) {
    header("Location: booking_details.php");
    exit();
}

// Retrieve booking details
$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
$trek_id = $_POST['trek_id'];
$slot_id = $_POST['slot_id'];
$num_people = $_POST['num_people'];
$slot_date = $_POST['slot_date'];
$rental_gear = json_decode($_POST['rental_gear'], true); // Convert JSON to array
$total_cost = (float)$_POST['total_cost'];
// $payment_status = "paid"; // Assuming success for simulation
$payment_success = isset($_POST['payment_success']) && $_POST['payment_success'] === '1';
$payment_status = $payment_success ? "paid" : "pending"; // Default to "Pending" unless explicitly successful

//invoice generation
$invoice_number = "INV" . date('YmdHis') . rand(0, 9);
// Start transaction
mysqli_begin_transaction($conn);

try {

    $slot_query = "SELECT available_slots FROM trek_slots WHERE slot_id = ? FOR UPDATE"; // Lock row for update
    $slot_stmt = mysqli_prepare($conn, $slot_query);
    mysqli_stmt_bind_param($slot_stmt, "i", $slot_id);
    mysqli_stmt_execute($slot_stmt);
    $slot_result = mysqli_stmt_get_result($slot_stmt);
    $slot = mysqli_fetch_assoc($slot_result);

    if (!$slot || $slot['available_slots'] < $num_people) {
        throw new Exception("Not enough available slots for this trek.");
    }

    $new_available_slots = $slot['available_slots'] - $num_people;
    $update_slot_query = "UPDATE trek_slots SET available_slots = ? WHERE slot_id = ?";
    $update_slot_stmt = mysqli_prepare($conn, $update_slot_query);
    mysqli_stmt_bind_param($update_slot_stmt, "ii", $new_available_slots, $slot_id);
    mysqli_stmt_execute($update_slot_stmt);


    // Insert booking record
    $query = "INSERT INTO bookings (user_id, trek_id, slot_id, num_people, total_cost, status, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, NOW())";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "iiiiis", $user_id, $trek_id, $slot_id, $num_people, $total_cost, $payment_status);
    mysqli_stmt_execute($stmt);
    $booking_id = mysqli_insert_id($conn); // Get inserted booking ID
    if (!$booking_id) {
        echo "failed";
        throw new Exception("Booking failed.");
    }

    // Insert transaction record
    $query = "INSERT INTO transactions (booking_id, user_id, amount_paid, payment_method, payment_status,invoice_number, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, NOW())";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "iiisss", $booking_id, $user_id, $total_cost, $_POST['payment_method'], $payment_status, $invoice_number);
    if(mysqli_stmt_execute($stmt)){
        echo "success <br>";
    }else{
        echo "falied";
    }



    $trekkers = [];
    if (isset($_SESSION['cart']) && is_array($_SESSION['cart']) && isset($_SESSION['cart']['trekkers']) && is_array($_SESSION['cart']['trekkers'])) {
        $trekkers = $_SESSION['cart']['trekkers'];
    } else {
        file_put_contents('debug_process.txt', "No valid trekkers in session: " . print_r($_SESSION['cart'] ?? 'Cart unset', true) . "\n", FILE_APPEND);
    }

    if (!empty($trekkers)) {
        foreach ($trekkers as $trekker) {
            if (!isset($trekker['name'], $trekker['age'], $trekker['gender'], $trekker['phone'])) {
                
                echo $trekker['name']."<br>";
                echo $trekker['age']."<br>";
                echo $trekker['gender']."<br>";
                echo $trekker['phone']. "<br>";
                throw new Exception("Invalid trekker data: missing required fields");

            }
            $query = "INSERT INTO trekker_details (booking_id, name, age, gender, phone) 
                      VALUES (?, ?, ?, ?, ?)";
            $stmt = mysqli_prepare($conn, $query);
            mysqli_stmt_bind_param($stmt, "isiss", $booking_id, $trekker['name'], $trekker['age'], $trekker['gender'], $trekker['phone']);
            if(mysqli_stmt_execute($stmt)){
                echo "success <br>";
            }else{
                echo "falied";
            }
        }
    } else {
        file_put_contents('debug_process.txt', "Trekkers array empty or not set\n", FILE_APPEND);
        // Optionally enforce trekkers
        // throw new Exception("No trekkers provided for booking");
    }

    // Insert rental gear details and update stock
    foreach ($rental_gear as $gear) {
        $gear_id = $gear['gear_id'];
        $quantity = $gear['quantity'];
        $price_at_booking = $gear['price_per_day'];
        $total_gear_cost = $quantity * $price_at_booking * $_POST['trek_duration']; // Assume trek_duration is passed

        // Insert into booking_gear
        $query = "INSERT INTO booking_gear (booking_id, gear_id, quantity, price_at_booking, total_gear_cost) 
                VALUES (?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "iiidd", $booking_id, $gear_id, $quantity, $price_at_booking, $total_gear_cost);
        mysqli_stmt_execute($stmt);

        // Update rental gear stock
        $query = "UPDATE rental_gear SET stock = stock - ? WHERE gear_id = ?";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "ii", $quantity, $gear_id);
        if(mysqli_stmt_execute($stmt)){
            echo "success <br>";
        }else{  
            echo "falied";
        }
    }

    // Commit transaction
    mysqli_commit($conn);
    $_SESSION['success_message'] = "Booking confirmed!";
    header("Location: booking_success.php?booking_id=$booking_id&invoice=" . urlencode($invoice_number));
    exit();
} catch (Exception $e) {
    // Rollback transaction on error
    mysqli_rollback($conn);
    $_SESSION['error_message'] = "Payment failed! Please try again.";
    header("Location: booking_details.php");
   exit();
}
?>