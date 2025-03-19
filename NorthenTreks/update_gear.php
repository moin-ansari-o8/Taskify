    <?php
    session_start();
    include('includes/db_connection.php');

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not logged in']);
        exit;
    }

    if (!isset($_SESSION['cart']) || !isset($_POST['gear_id']) || !isset($_POST['action'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid request']);
        exit;
    }

    $gearId = (int) $_POST['gear_id'];
    $action = $_POST['action'];

    // Fetch gear details
    $gearQuery = $conn->prepare("SELECT gear_name, price_per_day, stock FROM rental_gear WHERE gear_id = ?");
    $gearQuery->bind_param("i", $gearId);
    $gearQuery->execute();
    $gearData = $gearQuery->get_result()->fetch_assoc();
    $gearQuery->close();

    if (!$gearData) {
        echo json_encode(['success' => false, 'message' => 'Gear not found']);
        exit;
    }

    // Update gear quantity
    $rentalGear = &$_SESSION['cart']['rental_gear'];
    $gearIndex = array_search($gearId, array_column($rentalGear, 'gear_id'));
    if ($gearIndex === false) {
        echo json_encode(['success' => false, 'message' => 'Gear not in cart']);
        exit;
    }

    $currentQuantity = $rentalGear[$gearIndex]['quantity'];
    if ($action === 'increase') {
        if ($currentQuantity >= $gearData['stock']) {
            echo json_encode(['success' => false, 'message' => "Cannot increase {$gearData['gear_name']} beyond stock ({$gearData['stock']})"]);
            exit;
        }
        $rentalGear[$gearIndex]['quantity']++;
    } elseif ($action === 'decrease') {
        if ($currentQuantity <= 0) {
            echo json_encode(['success' => false, 'message' => "Cannot decrease {$gearData['gear_name']} below 0"]);
            exit;
        }
        $rentalGear[$gearIndex]['quantity']--;
        if ($rentalGear[$gearIndex]['quantity'] == 0) {
            unset($rentalGear[$gearIndex]);
            $rentalGear = array_values($rentalGear); // Reindex array
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        exit;
    }

    // Recalculate costs
    $trekId = $_SESSION['cart']['trek_id'];
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

    // Generate updated gear list HTML
    ob_start();
    if (empty($_SESSION['cart']['rental_gear'])) {
        echo "<p>No gear selected.</p>";
    } else {
        foreach ($_SESSION['cart']['rental_gear'] as $gear) {
            $gearQuery = $conn->prepare("SELECT gear_name, price_per_day, stock FROM rental_gear WHERE gear_id = ?");
            $gearQuery->bind_param("i", $gear['gear_id']);
            $gearQuery->execute();
            $gearData = $gearQuery->get_result()->fetch_assoc();
            $gearQuery->close();
            $gearTotal = $gearData['price_per_day'] * $gear['quantity'] * $trekDuration;
            ?>
            <div class="card" data-gear-id="<?= $gear['gear_id'] ?>">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Name:</strong> <?= htmlspecialchars(isset($gearData['gear_name']) ? $gearData['gear_name'] : '') ?><br>
                        <strong>Price/Day:</strong> ₹<?= number_format($gearData['price_per_day'], 2) ?><br>
                        <strong>Total:</strong> ₹<span class="gear-total"><?= number_format($gearTotal, 2) ?></span>
                    </div>
                    <div class="quantity-controls">
                        <button type="button" class="btn btn-secondary btn-sm decrease-gear" data-gear-id="<?= $gear['gear_id'] ?>"
                            <?= $gear['quantity'] <= 0 ? 'disabled' : '' ?>>-</button>
                        <span class="gear-quantity"><?= $gear['quantity'] ?></span>
                        <button type="button" class="btn btn-secondary btn-sm increase-gear" data-gear-id="<?= $gear['gear_id'] ?>"
                            <?= $gear['quantity'] >= $gearData['stock'] ? 'disabled' : '' ?>>+</button>
                    </div>
                </div>
            </div>
            <?php
        }
    }
    $gearHtml = ob_get_clean();

    echo json_encode([
        'success' => true,
        'gearHtml' => $gearHtml,
        'rentalCost' => number_format($rentalCost, 2),
        'totalCost' => number_format($totalCost, 2),
        'totalCostRaw' => $totalCost,
        'rentalGearJson' => json_encode($_SESSION['cart']['rental_gear'])
    ]);
    exit;