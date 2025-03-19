<?php
session_start();

// Log start of script
file_put_contents('debug_post.txt', "Script started: " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);
file_put_contents('debug_post.txt', "POST Data at Start: " . print_r($_POST, true) . "\n", FILE_APPEND);

// Check required fields
if (
    $_SERVER['REQUEST_METHOD'] !== 'POST' ||
    !isset($_POST['trek_id'], $_POST['slot_id'], $_POST['num_people'], $_POST['slot_date'], $_POST['total_cost']) ||
    !array_key_exists('rental_gear', $_POST)
) {
    file_put_contents('debug_post.txt', "Redirect triggered at initial check. POST: " . print_r($_POST, true) . "\n", FILE_APPEND);
    header("Location: booking_details.php");
    exit();
}

file_put_contents('debug_post.txt', "Passed initial check\n", FILE_APPEND);

include('includes/header.php');
include('includes/db_connection.php');

// Store booking data
$bookingData = [
    'trek_id' => $_POST['trek_id'],
    'slot_id' => $_POST['slot_id'],
    'num_people' => $_POST['num_people'],
    'slot_date' => $_POST['slot_date'],
    'rental_gear' => $_POST['rental_gear'],
    'total_cost' => $_POST['total_cost'],
    'payment_method' => isset($_POST['payment_method']) ? $_POST['payment_method'] : ''
];

// Generate random numbers for the math challenge
$num1 = rand(1, 10);
$num2 = rand(1, 10);
$correct_answer = $num1 + $num2;

// Handle payment submission
$errors = [];
if (isset($_POST['authorize_payment'])) {
    file_put_contents('debug_post.txt', "Processing payment authorization\n", FILE_APPEND);
    $paymentMethod = isset($_POST['payment_method']) ? $_POST['payment_method'] : '';
    $user_answer = (int) (isset($_POST['math_answer']) ? $_POST['math_answer'] : 0);

    // Validate payment method details
    if ($paymentMethod === 'upi') {
        $upiId = trim($_POST['upi_id'] ?? '');
        if (!preg_match('/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/', $upiId)) {
            $errors[] = "Invalid UPI ID format (e.g., example@bank).";
        }
    } elseif ($paymentMethod === 'credit_card') {
        $cardNumber = trim($_POST['card_number'] ?? '');
        $expiry = trim($_POST['expiry'] ?? '');
        $cvv = trim($_POST['cvv'] ?? '');

        if (!preg_match('/^\d{16}$/', $cardNumber)) {
            $errors[] = "Card number must be 16 digits.";
        }
        if (!preg_match('/^(0[1-9]|1[0-2])\/\d{2}$/', $expiry)) {
            $errors[] = "Expiry must be in MM/YY format.";
        }
        if (!preg_match('/^\d{3,4}$/', $cvv)) {
            $errors[] = "CVV must be 3 or 4 digits.";
        }
    } elseif ($paymentMethod === 'net_banking') {
        $bank = $_POST['bank'] ?? '';
        if (empty($bank)) {
            $errors[] = "Please select a bank.";
        }
    } else {
        $errors[] = "Invalid payment method selected.";
    }

    // Validate math challenge
    if ($user_answer !== $correct_answer) {
        $errors[] = "Incorrect answer to the authorization challenge. Expected: $correct_answer, Got: $user_answer";
    }

    if (empty($errors)) {
        file_put_contents('debug_post.txt', "Payment and challenge validated, proceeding to process_payment.php\n", FILE_APPEND);
        ?>
        <form id="processForm" action="process_payment.php" method="POST">
            <input type="hidden" name="trek_id" value="<?= htmlspecialchars($bookingData['trek_id']) ?>">
            <input type="hidden" name="slot_id" value="<?= htmlspecialchars($bookingData['slot_id']) ?>">
            <input type="hidden" name="num_people" value="<?= htmlspecialchars($bookingData['num_people']) ?>">
            <input type="hidden" name="slot_date" value="<?= htmlspecialchars($bookingData['slot_date']) ?>">
            <input type="hidden" name="rental_gear" value="<?= htmlspecialchars($bookingData['rental_gear']) ?>">
            <input type="hidden" name="total_cost" value="<?= htmlspecialchars($bookingData['total_cost']) ?>">
            <input type="hidden" name="payment_method" value="<?= htmlspecialchars($bookingData['payment_method']) ?>">
            <input type="hidden" name="payment_success" value="1">
        </form>
        <script>document.getElementById('processForm').submit();</script>
        <?php
        exit();
    }
}

file_put_contents('debug_post.txt', "Rendering payment form\n", FILE_APPEND);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simulate Payment - NorthernTreks</title>
    <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
    <script src="../assets/jquery-3.7.1.min.js"></script>
    <style>
        .payment-option {
            display: none;
        }

        .payment-option.active {
            display: block;
        }
    </style>
</head>

<body>
    <div class="container my-5">
        <h3 class="text-center">Simulate Payment</h3>
        <p class="text-center">Total Amount: ₹<?= number_format($bookingData['total_cost'], 2) ?></p>

        <?php if (!empty($errors)): ?>
            <div class="alert alert-danger">
                <ul>
                    <?php foreach ($errors as $error): ?>
                        <li><?= htmlspecialchars($error) ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <form method="POST" id="paymentForm">
            <input type="hidden" name="trek_id" value="<?= htmlspecialchars($bookingData['trek_id']) ?>">
            <input type="hidden" name="slot_id" value="<?= htmlspecialchars($bookingData['slot_id']) ?>">
            <input type="hidden" name="num_people" value="<?= htmlspecialchars($bookingData['num_people']) ?>">
            <input type="hidden" name="slot_date" value="<?= htmlspecialchars($bookingData['slot_date']) ?>">
            <input type="hidden" name="rental_gear" value="<?= htmlspecialchars($bookingData['rental_gear']) ?>">
            <input type="hidden" name="total_cost" value="<?= htmlspecialchars($bookingData['total_cost']) ?>">
            <input type="hidden" name="authorize_payment" value="1">

            <div class="mb-3">
                <label class="form-label"><strong>Select Payment Method</strong></label>
                <select name="payment_method" id="paymentMethod" class="form-control" required>
                    <option value="">-- Choose --</option>
                    <option value="upi">UPI</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="net_banking">Net Banking</option>
                </select>
            </div>

            <div id="upi" class="payment-option">
                <div class="mb-3">
                    <label for="upi_id" class="form-label">UPI ID</label>
                    <input type="text" name="upi_id" id="upi_id" class="form-control" placeholder="example@bank">
                </div>
            </div>

            <div id="credit_card" class="payment-option">
                <div class="mb-3">
                    <label for="card_number" class="form-label">Card Number</label>
                    <input type="text" name="card_number" id="card_number" class="form-control" maxlength="16"
                        placeholder="1234 5678 9012 3456">
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="expiry" class="form-label">Expiry (MM/YY)</label>
                        <input type="text" name="expiry" id="expiry" class="form-control" placeholder="MM/YY"
                            maxlength="5">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="cvv" class="form-label">CVV</label>
                        <input type="text" name="cvv" id="cvv" class="form-control" maxlength="4" placeholder="123">
                    </div>
                </div>
            </div>

            <div id="net_banking" class="payment-option">
                <div class="mb-3">
                    <label for="bank" class="form-label">Select Bank</label>
                    <select name="bank" id="bank" class="form-control">
                        <option value="">-- Select Bank --</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                    </select>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label"><strong>Payment Authorization Challenge</strong></label>
                <p>Solve this to confirm: What is <?= $num1 ?> + <?= $num2 ?>?</p>
                <input type="number" name="math_answer" class="form-control" placeholder="Enter your answer" required>
            </div>

            <button type="submit" class="btn btn-success w-100">Pay Now</button>
        </form>
    </div>

    <script src="../assets/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script>
        $(document).ready(function () {
            $('#paymentMethod').on('change', function () {
                $('.payment-option').removeClass('active');
                const method = $(this).val();
                if (method) {
                    $('#' + method).addClass('active');
                }
            });
        });
    </script>
</body>

</html>
<?php include('includes/footer.php'); ?>