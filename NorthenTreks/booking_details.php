<?php
include('includes/header.php');
include('includes/db_connection.php');

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
if (!isset($_SESSION['cart']['trekkers'])) {
    $_SESSION['cart']['trekkers'] = [];
}

if (!isset($_POST['trek_id'], $_POST['slot_id'], $_POST['num_people'], $_POST['slot_date'])) {
    echo "<p class='text-danger text-center'>Invalid booking details. Please select a trek and slot first.</p>";
    exit();
}

// User session data
$user_id = $_SESSION['user_id'];
$user_name = $_SESSION['username'];
$user_phone = $_SESSION['phone'];
$user_dob = $_SESSION['dob'];

// Fetch user gender from the database
$userStmt = $conn->prepare("SELECT gender FROM users WHERE user_id = ?");
$userStmt->bind_param("i", $user_id);
$userStmt->execute();
$userResult = $userStmt->get_result()->fetch_assoc();
$userStmt->close();
$user_gender = isset($userResult['gender']) ? $userResult['gender'] : null; // Default to null if not found

// Calculate age from DOB
function calculateAge($dob)
{
    if (!$dob || $dob === '0000-00-00') {
        return null;
    }
    $birthDate = new DateTime($dob);
    $today = new DateTime('today');
    return $birthDate->diff($today)->y;
}
$user_age = calculateAge($user_dob);

// POST data from booking summary
$trekId = $_POST['trek_id'];
$slotId = $_POST['slot_id'];
$originalNumPeople = (int) $_POST['num_people'];
$slotDate = $_POST['slot_date'];
$rentalGear = json_decode($_POST['rental_gear'], true);
$rentalGear = $rentalGear ? $rentalGear : [];

// Fetch trek details
$stmt = $conn->prepare("SELECT trek_name, price_per_person, duration_days FROM treks WHERE trek_id = ?");
$stmt->bind_param("i", $trekId);
$stmt->execute();
$trek = $stmt->get_result()->fetch_assoc();
$stmt->close();

$trekName = $trek['trek_name'];
$pricePerPerson = $trek['price_per_person'];
$trekDuration = $trek['duration_days'];

// Initialize cart only if not set
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [
        'trek_id' => $trekId,
        'slot_id' => $slotId,
        'slot_date' => $slotDate,
        'original_num_people' => $originalNumPeople,
        'trekkers' => $originalNumPeople > 0 ? [['name' => $user_name, 'phone' => $user_phone, 'age' => $user_age, 'gender' => $user_gender]] : [],
        'rental_gear' => $rentalGear
    ];
}

// Handle trekker removal via POST (fallback for non-AJAX)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'remove_trekker') {
    $index = (int) $_POST['index'];
    if (isset($_SESSION['cart']['trekkers'][$index])) {
        unset($_SESSION['cart']['trekkers'][$index]);
        $_SESSION['cart']['trekkers'] = array_values($_SESSION['cart']['trekkers']);
    }
}

// Calculate costs
$numPeople = count($_SESSION['cart']['trekkers']);
$trekCost = $pricePerPerson * $numPeople;
$rentalCost = 0;
foreach ($_SESSION['cart']['rental_gear'] as $gear) {
    $gearId = $gear['gear_id'];
    $gearQuery = $conn->prepare("SELECT price_per_day FROM rental_gear WHERE gear_id = ?");
    $gearQuery->bind_param("i", $gearId);
    $gearQuery->execute();
    $gearData = $gearQuery->get_result()->fetch_assoc();
    $gearQuery->close();
    $rentalCost += $gearData['price_per_day'] * $gear['quantity'] * $trekDuration;
}
$totalCost = $trekCost + $rentalCost;

// Check slot availability
$slotStmt = $conn->prepare("SELECT available_slots FROM trek_slots WHERE slot_id = ?");
$slotStmt->bind_param("i", $slotId);
$slotStmt->execute();
$slot = $slotStmt->get_result()->fetch_assoc();
$slotStmt->close();
$availableSlots = $slot['available_slots'];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Cart - NorthernTreks</title>
    <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
    <script src="../assets/jquery-3.7.1.min.js"></script>
    <style>
        .trekker-list .card,
        .gear-list .card {
            margin-bottom: 10px;
        }

        .cost-breakdown {
            font-weight: bold;
        }

        .error {
            color: red;
        }

        .warning {
            color: orange;
        }

        .quantity-controls {
            display: flex;
            align-items: center;
        }

        .quantity-controls button {
            margin: 0 5px;
        }
    </style>
</head>

<body>
    <div class="container my-5">
        <h3 class="text-center">Your Trekking Cart</h3>

        <!-- Trek Details -->
        <div class="card mb-3">
            <div class="card-body">
                <h4>Trek: <?= htmlspecialchars($trekName) ?></h4>
                <p><strong>Slot Date:</strong> <?= htmlspecialchars($slotDate) ?></p>
                <p><strong>Duration:</strong> <?= htmlspecialchars($trekDuration) ?> Days</p>
                <p><strong>Available Slots:</strong> <?= htmlspecialchars($availableSlots) ?></p>
                <p><strong>Originally Selected People:</strong> <?= htmlspecialchars($originalNumPeople) ?></p>
            </div>
        </div>

        <!-- Trekkers Section -->
        <div class="trekker-list">
            <h4>Trekkers (<span id="numPeople"><?= $numPeople ?></span>)</h4>
            <div id="trekkerWarnings">
                <?php if ($numPeople > $availableSlots): ?>
                    <p class="error">Error: Number of trekkers exceeds available slots (<?= $availableSlots ?>).</p>
                <?php elseif ($numPeople > $originalNumPeople): ?>
                    <p class="warning">Warning: You’ve added more trekkers (<?= $numPeople ?>) than originally selected
                        (<?= $originalNumPeople ?>).</p>
                <?php elseif ($numPeople < $originalNumPeople && $numPeople > 0): ?>
                    <p class="warning">Warning: You’ve added fewer trekkers (<?= $numPeople ?>) than originally selected
                        (<?= $originalNumPeople ?>).</p>
                <?php endif; ?>
            </div>
            <div id="trekkerList">
                <?php foreach ($_SESSION['cart']['trekkers'] as $index => $trekker): ?>
                    <div class="card" data-index="<?= $index ?>">
                        <div class="card-body d-flex justify-content-between align-items-center">
                                <strong>Name:</strong> <?= htmlspecialchars(isset($trekker['name']) ? $trekker['name'] : '') ?><br>
                                <strong>Phone:</strong> <?= htmlspecialchars(isset($trekker['phone']) ? $trekker['phone'] : '') ?><br>
                                <strong>Age:</strong> <?= htmlspecialchars(isset($trekker['age']) ? $trekker['age'] : 'Not specified') ?><br>
                                <strong>Gender:</strong> <?= htmlspecialchars(isset($trekker['gender']) ? $trekker['gender'] : 'Not specified') ?>
                                <strong>Gender:</strong> <?= htmlspecialchars($trekker['gender'] ?? 'Not specified') ?>
                            </div>
                            <form method="POST" class="d-inline remove-trekker-form">
                                <input type="hidden" name="action" value="remove_trekker">
                                <input type="hidden" name="index" value="<?= $index ?>">
                                <button type="submit" class="btn btn-danger btn-sm">Remove</button>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            <form id="addTrekkerForm" class="mt-3">
                <div class="row">
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="trekker_name" placeholder="Name" required>
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="trekker_phone" placeholder="Phone" required>
                    </div>
                    <div class="col-md-2">
                        <input type="number" class="form-control" name="trekker_age" placeholder="Age" min="1" required>
                    </div>
                    <div class="col-md-2">
                        <select class="form-control" name="trekker_gender" required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-primary w-100" <?= $numPeople >= $originalNumPeople ? 'disabled' : '' ?>>Add</button>
                    </div>
                </div>
            </form>
            <button id="refillDefault" class="btn btn-secondary mt-2" <?= $numPeople >= $originalNumPeople ? 'disabled' : '' ?>>Refill Default User</button>
        </div>

        <!-- Rental Gear Section -->
        <div class="gear-list mt-4">
            <h4>Rental Gear</h4>
            <div id="gearList">
                <?php if (empty($_SESSION['cart']['rental_gear'])): ?>
                    <p>No gear selected.</p>
                <?php else: ?>
                    <?php foreach ($_SESSION['cart']['rental_gear'] as $gear):
                        $gearQuery = $conn->prepare("SELECT gear_name, price_per_day, stock FROM rental_gear WHERE gear_id = ?");
                        $gearQuery->bind_param("i", $gear['gear_id']);
                        $gearQuery->execute();
                        $gearData = $gearQuery->get_result()->fetch_assoc();
                        $gearQuery->close();
                        $gearTotal = $gearData['price_per_day'] * $gear['quantity'] * $trekDuration;
                        if ($gear['quantity'] > $gearData['stock']) {
                            echo "<p class='error'>Error: Insufficient stock for {$gearData['gear_name']} (Available: {$gearData['stock']}).</p>";
                        }
                        ?>
                        <div class="card" data-gear-id="<?= $gear['gear_id'] ?>">
                            <div class="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>Name:</strong> <?= htmlspecialchars($gearData['gear_name'] ?? '') ?><br>
                                    <strong>Price/Day:</strong> ₹<?= number_format($gearData['price_per_day'], 2) ?><br>
                                    <strong>Total:</strong> ₹<span class="gear-total"><?= number_format($gearTotal, 2) ?></span>
                                </div>
                                <div class="quantity-controls">
                                    <button type="button" class="btn btn-secondary btn-sm decrease-gear"
                                        data-gear-id="<?= $gear['gear_id'] ?>" <?= $gear['quantity'] <= 0 ? 'disabled' : '' ?>>-</button>
                                    <span class="gear-quantity"><?= $gear['quantity'] ?></span>
                                    <button type="button" class="btn btn-secondary btn-sm increase-gear"
                                        data-gear-id="<?= $gear['gear_id'] ?>" <?= $gear['quantity'] >= $gearData['stock'] ? 'disabled' : '' ?>>+</button>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>

        <!-- Cost Breakdown -->
        <div class="mt-4 cost-breakdown">
            <h4>Cost Breakdown</h4>
            <p>Trek Cost (₹<?= number_format($pricePerPerson, 2) ?> x <span
                    id="numPeopleCost"><?= $numPeople ?></span>): ₹<span
                    id="trekCost"><?= number_format($trekCost, 2) ?></span></p>
            <p>Rental Gear Cost: ₹<span id="rentalCost"><?= number_format($rentalCost, 2) ?></span></p>
            <p class="text-success">Total Cost: ₹<span id="totalCost"><?= number_format($totalCost, 2) ?></span></p>
        </div>

        <!-- Payment Form -->
        <form action="simulate_payment.php" method="POST" class="mt-4" id="paymentForm">
            <input type="hidden" name="trek_id" value="<?= htmlspecialchars($trekId) ?>">
            <input type="hidden" name="slot_id" value="<?= htmlspecialchars($slotId) ?>">
            <input type="hidden" name="num_people" value="<?= htmlspecialchars($numPeople) ?>" id="numPeopleInput">
            <input type="hidden" name="slot_date" value="<?= htmlspecialchars($slotDate) ?>">
            <input type="hidden" name="rental_gear"
                value='<?= htmlspecialchars(json_encode($_SESSION['cart']['rental_gear'])) ?>' id="rentalGearInput">
            <input type="hidden" name="total_cost" value="<?= htmlspecialchars($totalCost) ?>" id="totalCostInput">
            <button type="submit" class="btn btn-success w-100" id="proceedButton" <?= ($numPeople === 0 || $numPeople > $availableSlots) ? 'disabled' : '' ?>>Proceed to Payment</button>
        </form>
    </div>

    <script src="../assets/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script>
        $(document).ready(function () {
            function handleAjaxError(xhr, status, error) {
                console.log('AJAX Error Details:', { status: status, error: error, responseText: xhr.responseText, statusCode: xhr.status });
                alert('Failed to process request. Check console for details.');
            }

            $('#addTrekkerForm').on('submit', function (e) {
                e.preventDefault();
                let formData = $(this).serialize();
                $.ajax({
                    url: './add_trekker.php',
                    type: 'POST',
                    data: formData,
                    dataType: 'json',
                    success: function (response) {
                        if (response.success) {
                            $('#trekkerList').html(response.trekkersHtml);
                            $('#trekkerWarnings').html(response.warningsHtml);
                            $('#numPeople').text(response.numPeople);
                            $('#numPeopleCost').text(response.numPeople);
                            $('#trekCost').text(response.trekCost);
                            $('#totalCost').text(response.totalCost);
                            $('#numPeopleInput').val(response.numPeople);
                            $('#totalCostInput').val(response.totalCostRaw);
                            $('#addTrekkerForm')[0].reset();
                            if (response.numPeople >= <?= $originalNumPeople ?>) {
                                $('#addTrekkerForm button').prop('disabled', true);
                                $('#refillDefault').prop('disabled', true);
                            }
                            $('#proceedButton').prop('disabled', response.numPeople === 0 || response.numPeople > <?= $availableSlots ?>);
                        } else {
                            alert('Error: ' + response.message);
                        }
                    },
                    error: handleAjaxError
                });
            });

            $(document).on('submit', '.remove-trekker-form', function (e) {
                e.preventDefault();
                let formData = $(this).serialize();
                $.ajax({
                    url: './remove_trekker.php',
                    type: 'POST',
                    data: formData,
                    dataType: 'json',
                    success: function (response) {
                        if (response.success) {
                            $('#trekkerList').html(response.trekkersHtml);
                            $('#trekkerWarnings').html(response.warningsHtml);
                            $('#numPeople').text(response.numPeople);
                            $('#numPeopleCost').text(response.numPeople);
                            $('#trekCost').text(response.trekCost);
                            $('#totalCost').text(response.totalCost);
                            $('#numPeopleInput').val(response.numPeople);
                            $('#totalCostInput').val(response.totalCostRaw);
                            if (response.numPeople < <?= $originalNumPeople ?>) {
                                $('#addTrekkerForm button').prop('disabled', false);
                                $('#refillDefault').prop('disabled', false);
                            }
                            $('#proceedButton').prop('disabled', response.numPeople === 0 || response.numPeople > <?= $availableSlots ?>);
                        } else {
                            alert('Error: ' + response.message);
                        }
                    },
                    error: handleAjaxError
                });
            });

            $('#refillDefault').on('click', function () {
                $.ajax({
                    url: './add_trekker.php',
                    type: 'POST',
                    data: {
                        trekker_name: '<?= addslashes($user_name) ?>',
                        trekker_phone: '<?= addslashes($user_phone ?? '') ?>',
                        trekker_age: <?= $user_age ?? 'null' ?>,
                        trekker_gender: '<?= addslashes($user_gender ?? '') ?>', // Pass user's gender
                        refill_default: true
                    },
                    dataType: 'json',
                    success: function (response) {
                        if (response.success) {
                            $('#trekkerList').html(response.trekkersHtml);
                            $('#trekkerWarnings').html(response.warningsHtml);
                            $('#numPeople').text(response.numPeople);
                            $('#numPeopleCost').text(response.numPeople);
                            $('#trekCost').text(response.trekCost);
                            $('#totalCost').text(response.totalCost);
                            $('#numPeopleInput').val(response.numPeople);
                            $('#totalCostInput').val(response.totalCostRaw);
                            if (response.numPeople >= <?= $originalNumPeople ?>) {
                                $('#addTrekkerForm button').prop('disabled', true);
                                $('#refillDefault').prop('disabled', true);
                            }
                            $('#proceedButton').prop('disabled', response.numPeople === 0 || response.numPeople > <?= $availableSlots ?>);
                        } else {
                            alert('Error: ' + response.message);
                        }
                    },
                    error: handleAjaxError
                });
            });

            $(document).on('click', '.increase-gear', function () {
                let gearId = $(this).data('gear-id');
                $.ajax({
                    url: './update_gear.php',
                    type: 'POST',
                    data: { gear_id: gearId, action: 'increase' },
                    dataType: 'json',
                    success: function (response) {
                        if (response.success) {
                            $('#gearList').html(response.gearHtml);
                            $('#rentalCost').text(response.rentalCost);
                            $('#totalCost').text(response.totalCost);
                            $('#rentalGearInput').val(response.rentalGearJson);
                            $('#totalCostInput').val(response.totalCostRaw);
                        } else {
                            alert('Error: ' + response.message);
                        }
                    },
                    error: handleAjaxError
                });
            });

            $(document).on('click', '.decrease-gear', function () {
                let gearId = $(this).data('gear-id');
                $.ajax({
                    url: './update_gear.php',
                    type: 'POST',
                    data: { gear_id: gearId, action: 'decrease' },
                    dataType: 'json',
                    success: function (response) {
                        if (response.success) {
                            $('#gearList').html(response.gearHtml);
                            $('#rentalCost').text(response.rentalCost);
                            $('#totalCost').text(response.totalCost);
                            $('#rentalGearInput').val(response.rentalGearJson);
                            $('#totalCostInput').val(response.totalCostRaw);
                        } else {
                            alert('Error: ' + response.message);
                        }
                    },
                    error: handleAjaxError
                });
            });
        });
    </script>
</body>

</html>
<?php include('includes/footer.php'); ?>