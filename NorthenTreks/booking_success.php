<?php
include('includes/header.php');
include('includes/db_connection.php');

if (!isset($_SESSION['user_id']) || !isset($_GET['booking_id']) || !isset($_GET['invoice'])) {
    echo $_SESSION['user_id'];
    echo $_GET['booking_id'];
    echo $_GET['invoice'];
    //header("Location: index.php");
    //exit();
}

$booking_id = (int) $_GET['booking_id'];
$invoice_number = $_GET['invoice'];

// Fetch booking details
$stmt = $conn->prepare("
    SELECT b.*, t.trek_name, t.price_per_person, t.duration_days, ts.start_date 
    FROM bookings b 
    JOIN treks t ON b.trek_id = t.trek_id 
    JOIN trek_slots ts ON b.slot_id = ts.slot_id 
    WHERE b.booking_id = ? AND b.user_id = ?
");
$stmt->bind_param("ii", $booking_id, $_SESSION['user_id']);
$stmt->execute();
$booking = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$booking) {
    $_SESSION['error_message'] = "Booking not found or you don’t have permission to view it.";
    header("Location: index.php");
    exit();
}

// Fetch trekker details
$trekkerStmt = $conn->prepare("SELECT name, phone, age, gender FROM trekker_details WHERE booking_id = ?");
$trekkerStmt->bind_param("i", $booking_id);
$trekkerStmt->execute();
$trekkers = $trekkerStmt->get_result()->fetch_all(MYSQLI_ASSOC);
$trekkerStmt->close();

// Fetch rental gear details
$gearStmt = $conn->prepare("
    SELECT bg.quantity, bg.price_at_booking, bg.total_gear_cost, rg.gear_name 
    FROM booking_gear bg 
    JOIN rental_gear rg ON bg.gear_id = rg.gear_id 
    WHERE bg.booking_id = ?
");
$gearStmt->bind_param("i", $booking_id);
$gearStmt->execute();
$gearItems = $gearStmt->get_result()->fetch_all(MYSQLI_ASSOC);
$gearStmt->close();

// Fetch transaction details (for payment method and timestamp–

$stmt = $conn->prepare("SELECT payment_method, created_at FROM transactions WHERE booking_id = ? AND invoice_number = ?");
$stmt->bind_param("is", $booking_id, $invoice_number);
$stmt->execute();
$transaction = $stmt->get_result()->fetch_assoc();
$stmt->close();

// Calculate costs
$trekCost = $booking['price_per_person'] * $booking['num_people'];
$rentalCost = array_sum(array_column($gearItems, 'total_gear_cost'));
$totalCost = $booking['total_cost'];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Success - NorthernTreks</title>
    <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
    <style>
        .invoice-box {
            max-width: 800px;
            margin: 30px auto;
            padding: 20px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            font-size: 16px;
            line-height: 24px;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #555;
        }

        .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left;
        }

        .invoice-box table td {
            padding: 5px;
            vertical-align: top;
        }

        .invoice-box table tr td:nth-child(2) {
            text-align: right;
        }

        .invoice-box table tr.top table td {
            padding-bottom: 20px;
        }

        .invoice-box table tr.top table td.title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
        }

        .invoice-box table tr.information table td {
            padding-bottom: 40px;
        }

        .invoice-box table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
        }

        .invoice-box table tr.details td {
            padding-bottom: 20px;
        }

        .invoice-box table tr.item td {
            border-bottom: 1px solid #eee;
        }

        .invoice-box table tr.total td:nth-child(2) {
            border-top: 2px solid #eee;
            font-weight: bold;
        }

        @media print {
            .no-print {
                display: none;
            }

            .invoice-box {
                box-shadow: none;
                border: 0;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="invoice-box">
            <table cellpadding="0" cellspacing="0">
                <tr class="top">
                    <td colspan="2">
                        <table>
                            <tr>
                                <td class="title">
                                    NorthernTreks
                                </td>
                                <td>
                                    Invoice #: <?= htmlspecialchars($invoice_number) ?><br>
                                    Booked: <?= date('F j, Y, g:i a', strtotime($transaction['created_at'])) ?><br>
                                    Status: <?= htmlspecialchars($booking['status']) ?>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr class="information">
                    <td colspan="2">
                        <table>
                            <tr>
                                <td>
                                    NorthernTreks<br>
                                    123 Trekking Lane<br>
                                    Himalaya, India
                                </td>
                                <td>
                                    <?= htmlspecialchars($_SESSION['username']) ?><br>
                                    <?= htmlspecialchars(isset($_SESSION['phone']) ? $_SESSION['phone'] : 'Not provided') ?><br>
                                    <?= htmlspecialchars(isset($_SESSION['email']) ? $_SESSION['email'] : 'Not provided') ?>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr class="heading">
                    <td>Trek Details</td>
                    <td></td>
                </tr>
                <tr class="item">
                    <td>Trek Name</td>
                    <td><?= htmlspecialchars($booking['trek_name']) ?></td>
                </tr>
                <tr class="item">
                    <td>Slot Date</td>
                    <td><?= date('F j, Y', strtotime($booking['start_date'])) ?></td>
                </tr>
                <tr class="item">
                    <td>Duration</td>
                    <td><?= htmlspecialchars($booking['duration_days']) ?> Days</td>
                </tr>
                <tr class="item">
                    <td>Number of People</td>
                    <td><?= htmlspecialchars($booking['num_people']) ?></td>
                </tr>

                <tr class="heading">
                    <td>Trekkers</td>
                    <td></td>
                </tr>
                <?php if (empty($trekkers)): ?>
                    <tr class="item">
                        <td colspan="2">No trekkers listed.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($trekkers as $index => $trekker): ?>
                        <tr class="item">
                            <td>Trekker #<?= $index + 1 ?></td>
                            <td>
                                Name: <?= htmlspecialchars($trekker['name']) ?><br>
                                Phone: <?= htmlspecialchars($trekker['phone']) ?><br>
                                Age: <?= htmlspecialchars($trekker['age']) ?><br>
                                Gender: <?= htmlspecialchars($trekker['gender'] ?? 'Not specified') ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>

                <tr class="heading">
                    <td>Rental Gear</td>
                    <td></td>
                </tr>
                <?php if (empty($gearItems)): ?>
                    <tr class="item">
                        <td colspan="2">No gear rented.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($gearItems as $gear): ?>
                        <tr class="item">
                            <td><?= htmlspecialchars($gear['gear_name']) ?> (x<?= $gear['quantity'] ?>)</td>
                            <td>₹<?= number_format($gear['total_gear_cost'], 2) ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>

                <tr class="heading">
                    <td>Payment Details</td>
                    <td></td>
                </tr>
                <tr class="item">
                    <td>Payment Method</td>
                    <td><?= htmlspecialchars($transaction['payment_method']) ?></td>
                </tr>

                <tr class="heading">
                    <td>Cost Breakdown</td>
                    <td></td>
                </tr>
                <tr class="item">
                    <td>Trek Cost (₹<?= number_format($booking['price_per_person'], 2) ?> x
                        <?= $booking['num_people'] ?>)</td>
                    <td>₹<?= number_format($trekCost, 2) ?></td>
                </tr>
                <tr class="item">
                    <td>Rental Gear Cost</td>
                    <td>₹<?= number_format($rentalCost, 2) ?></td>
                </tr>
                <tr class="total">
                    <td>Total</td>
                    <td>₹<?= number_format($totalCost, 2) ?></td>
                </tr>
            </table>

            <div class="text-center mt-4 no-print">
                <button onclick="window.print()" class="btn btn-primary">Print Invoice</button>
                <a href="index.php" class="btn btn-secondary">Back to Home</a>
            </div>
        </div>

        <?php if (isset($_SESSION['success_message'])): ?>
            <div class="alert alert-success text-center">
                <?= htmlspecialchars($_SESSION['success_message']) ?>
                <?php unset($_SESSION['success_message']); ?>
            </div>
        <?php endif; ?>
    </div>

    <script src="../assets/bootstrap/js/bootstrap.bundle.min.js"></script>
</body>

</html>
<?php include('includes/footer.php'); ?>