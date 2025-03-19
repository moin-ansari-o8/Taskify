<?php
session_start();
include('includes/db_connection.php');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

if (!isset($_SESSION['cart']) || !isset($_POST['index'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$index = (int) $_POST['index'];
if (isset($_SESSION['cart']['trekkers'][$index])) {
    unset($_SESSION['cart']['trekkers'][$index]);
    $_SESSION['cart']['trekkers'] = array_values($_SESSION['cart']['trekkers']);
}

$originalNumPeople = $_SESSION['cart']['original_num_people'];

// Recalculate costs
$trekId = $_SESSION['cart']['trek_id'];
$slotId = $_SESSION['cart']['slot_id'];
$stmt = $conn->prepare("SELECT price_per_person, duration_days FROM treks WHERE trek_id = ?");
$stmt->bind_param("i", $trekId);
$stmt->execute();
$trek = $stmt->get_result()->fetch_assoc();
$stmt->close();

$pricePerPerson = $trek['price_per_person'];
$trekDuration = $trek['duration_days'];
$numPeople = count($_SESSION['cart']['trekkers']);
$trekCost = $pricePerPerson * $numPeople;

$rentalCost = 0;
$rentalGear = $_SESSION['cart']['rental_gear'];
foreach ($rentalGear as $gear) {
    $gearId = $gear['gear_id'];
    $gearQuery = $conn->prepare("SELECT price_per_day FROM rental_gear WHERE gear_id = ?");
    $gearQuery->bind_param("i", $gearId);
    $gearQuery->execute();
    $gearData = $gearQuery->get_result()->fetch_assoc();
    $gearQuery->close();
    $rentalCost += $gearData['price_per_day'] * $gear['quantity'] * $trekDuration;
}
$totalCost = $trekCost + $rentalCost;

// Fetch slot availability
$slotStmt = $conn->prepare("SELECT available_slots FROM trek_slots WHERE slot_id = ?");
$slotStmt->bind_param("i", $slotId);
$slotStmt->execute();
$slot = $slotStmt->get_result()->fetch_assoc();
$slotStmt->close();
$availableSlots = $slot['available_slots'];

// Generate updated trekker list HTML
ob_start();
foreach ($_SESSION['cart']['trekkers'] as $index => $trekker) {
    ?>
    <div class="card" data-index="<?= $index ?>">
        <div class="card-body d-flex justify-content-between align-items-center">
            <div>
                <strong>Name:</strong> <?= htmlspecialchars(isset($trekker['name']) ? $trekker['name'] : '') ?><br>
                <strong>Phone:</strong> <?= htmlspecialchars(isset($trekker['phone']) ? $trekker['phone'] : '') ?><br>
                <strong>Age:</strong> <?= htmlspecialchars(isset($trekker['age']) ? $trekker['age'] : 'Not specified') ?><br>
                <strong>Gender:</strong> <?= htmlspecialchars(isset($trekker['gender']) ? $trekker['gender'] : 'Not specified') ?>
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