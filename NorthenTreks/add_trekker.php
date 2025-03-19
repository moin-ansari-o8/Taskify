<?php
session_start();
include('includes/db_connection.php');

// Enable error reporting but log to file, not output
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:/wamp64/logs/php_error.log');

// Initialize response array
$response = ['success' => false, 'message' => 'Unknown error'];

// Check user session
if (!isset($_SESSION['user_id'])) {
    $response['message'] = 'Not logged in';
    echo json_encode($response);
    exit;
}

// Check cart session
if (!isset($_SESSION['cart'])) {
    $response['message'] = 'Cart not initialized';
    echo json_encode($response);
    exit;
}

// Validate trekker limit
$originalNumPeople = isset($_SESSION['cart']['original_num_people']) ? (int) $_SESSION['cart']['original_num_people'] : 0;
$trekkers = isset($_SESSION['cart']['trekkers']) ? $_SESSION['cart']['trekkers'] : [];
$numPeople = count($trekkers);
if ($originalNumPeople <= 0) {
    $response['message'] = 'Invalid original number of people (' . $originalNumPeople . '). Please select a valid number of people.';
    echo json_encode($response);
    exit;
}
if ($numPeople >= $originalNumPeople) {
    $response['message'] = 'Cannot add more trekkers than originally selected (' . $originalNumPeople . ')';
    echo json_encode($response);
    exit;
}

// Add new trekker
$isRefill = isset($_POST['refill_default']) && $_POST['refill_default'] === 'true';
if (!isset($_POST['trekker_name']) || !isset($_POST['trekker_phone']) || !isset($_POST['trekker_age']) || !isset($_POST['trekker_gender'])) {
    $response['message'] = 'Missing required trekker details';
    echo json_encode($response);
    exit;
}

$newTrekker = [
    'name' => trim($_POST['trekker_name']),
    'phone' => trim($_POST['trekker_phone'] ?? ''),
    'age' => ($_POST['trekker_age'] !== '' && $_POST['trekker_age'] !== 'null' && $_POST['trekker_age'] !== null) ? (int) $_POST['trekker_age'] : null,
    'gender' => !empty($_POST['trekker_gender']) ? $_POST['trekker_gender'] : null
];
$_SESSION['cart']['trekkers'][] = $newTrekker;

// Recalculate costs
$trekId = isset($_SESSION['cart']['trek_id']) ? (int) $_SESSION['cart']['trek_id'] : 0;
$slotId = isset($_SESSION['cart']['slot_id']) ? (int) $_SESSION['cart']['slot_id'] : 0;

$stmt = $conn->prepare("SELECT price_per_person, duration_days FROM treks WHERE trek_id = ?");
if (!$stmt) {
    $response['message'] = 'Database prepare error: ' . $conn->error;
    echo json_encode($response);
    exit;
}
$stmt->bind_param("i", $trekId);
if (!$stmt->execute()) {
    $response['message'] = 'Database execute error: ' . $stmt->error;
    echo json_encode($response);
    exit;
}
$trek = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$trek) {
    $response['message'] = 'Trek not found for ID: ' . $trekId;
    echo json_encode($response);
    exit;
}

$pricePerPerson = $trek['price_per_person'];
$trekDuration = $trek['duration_days'];
$numPeople = count($_SESSION['cart']['trekkers']);
$trekCost = $pricePerPerson * $numPeople;

$rentalCost = 0;
$rentalGear = isset($_SESSION['cart']['rental_gear']) ? $_SESSION['cart']['rental_gear'] : [];
foreach ($rentalGear as $gear) {
    $gearId = isset($gear['gear_id']) ? (int) $gear['gear_id'] : 0;
    $quantity = isset($gear['quantity']) ? (int) $gear['quantity'] : 0;

    $gearQuery = $conn->prepare("SELECT price_per_day FROM rental_gear WHERE gear_id = ?");
    if (!$gearQuery) {
        $response['message'] = 'Gear database prepare error: ' . $conn->error;
        echo json_encode($response);
        exit;
    }
    $gearQuery->bind_param("i", $gearId);
    if (!$gearQuery->execute()) {
        $response['message'] = 'Gear database execute error: ' . $gearQuery->error;
        echo json_encode($response);
        exit;
    }
    $gearData = $gearQuery->get_result()->fetch_assoc();
    $gearQuery->close();

    if (!$gearData) {
        $response['message'] = 'Gear not found for ID: ' . $gearId;
        echo json_encode($response);
        exit;
    }
    $rentalCost += $gearData['price_per_day'] * $quantity * $trekDuration;
}
$totalCost = $trekCost + $rentalCost;

// Fetch slot availability
$slotStmt = $conn->prepare("SELECT available_slots FROM trek_slots WHERE slot_id = ?");
if (!$slotStmt) {
    $response['message'] = 'Slot database prepare error: ' . $conn->error;
    echo json_encode($response);
    exit;
}
$slotStmt->bind_param("i", $slotId);
if (!$slotStmt->execute()) {
    $response['message'] = 'Slot database execute error: ' . $slotStmt->error;
    echo json_encode($response);
    exit;
}
$slot = $slotStmt->get_result()->fetch_assoc();
$slotStmt->close();

if (!$slot) {
    $response['message'] = 'Slot not found for ID: ' . $slotId;
    echo json_encode($response);
    exit;
}
$availableSlots = $slot['available_slots'];

// Generate updated trekker list HTML
ob_start();
foreach ($_SESSION['cart']['trekkers'] as $index => $trekker) {
    ?>
    <div class="card" data-index="<?= $index ?>">
        <div class="card-body d-flex justify-content-between align-items-center">
            <div>
                <strong>Name:</strong> <?= htmlspecialchars($trekker['name'] ?? '') ?><br>
                <strong>Phone:</strong> <?= htmlspecialchars($trekker['phone'] ?? '') ?><br>
                <strong>Age:</strong> <?= htmlspecialchars($trekker['age'] ?? 'Not specified') ?><br>
                <strong>Gender:</strong> <?= htmlspecialchars($trekker['gender'] ?? 'Not specified') ?>
            </div>
            <form method="POST" class="d-inline remove-trekker-form">
                <input type="hidden" name="action" value="remove_trekker">
                <input type="hidden" name="index" value="<?= $index ?>">
                <button type="submit" class="btn btn-danger btn-sm">Remove</button>
            </form>
        </div>
    </div>
    <?php
}
$trekkersHtml = ob_get_clean();

// Generate warnings HTML
ob_start();
if ($numPeople > $availableSlots) {
    echo "<p class='error'>Error: Number of trekkers exceeds available slots ($availableSlots).</p>";
} elseif ($numPeople > $originalNumPeople) {
    echo "<p class='warning'>Warning: You’ve added more trekkers ($numPeople) than originally selected ($originalNumPeople).</p>";
} elseif ($numPeople < $originalNumPeople && $numPeople > 0) {
    echo "<p class='warning'>Warning: You’ve added fewer trekkers ($numPeople) than originally selected ($originalNumPeople).</p>";
}
$warningsHtml = ob_get_clean();

// Success response
header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'trekkersHtml' => $trekkersHtml,
    'warningsHtml' => $warningsHtml,
    'numPeople' => $numPeople,
    'trekCost' => number_format($trekCost, 2),
    'totalCost' => number_format($totalCost, 2),
    'totalCostRaw' => $totalCost
]);
exit;