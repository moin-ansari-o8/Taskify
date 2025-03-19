    <?php
    include('includes/header.php');
    include('includes/db_connection.php');

    if (!isset($_GET['trek_id']) || !isset($_GET['slot_date']) || !isset($_GET['num_people'])) {
        echo "<p class='text-center text-danger'>Missing booking details.</p>";
        exit();
    }

    $trekId = isset($_GET['trek_id']) ? $_GET['trek_id'] : '';
    $slotDate = isset($_GET['slot_date']) ? $_GET['slot_date'] : '';
    $numPeople = isset($_GET['num_people']) ? $_GET['num_people'] : '';

    // Fetch trek details
    $stmt = $conn->prepare("
        SELECT treks.*, slots.slot_id, slots.start_date 
        FROM treks
        INNER JOIN trek_slots AS slots ON treks.trek_id = slots.trek_id
        WHERE treks.trek_id = ? AND slots.start_date = ?
    ");
    $stmt->bind_param("is", $trekId, $slotDate);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo "<p class='text-center text-danger'>Invalid trek or slot selection.</p>";
        exit();
    }

    $trek = $result->fetch_assoc();
    $slotId = $trek['slot_id'];
    $trekCost = $trek['price_per_person'] * $numPeople;
    $trekDuration = $trek['duration_days'];
    ?>

    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Summary</title>
        <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
        <script src="../assets/jquery-3.7.1.min.js"></script>
    </head>

    <body>
        <div class="container">
            <h3 class="text-center">Booking Summary</h3>

            <table class="table table-bordered">
                <tr>
                    <th>Trek Name</th>
                    <td><?= htmlspecialchars($trek['trek_name']) ?></td>
                </tr>
                <tr>
                    <th>Location</th>
                    <td><?= htmlspecialchars($trek['location']) ?></td>
                </tr>
                <tr>
                    <th>Duration</th>
                    <td><?= htmlspecialchars($trek['duration_days']) ?> Days</td>
                </tr>
                <tr>
                    <th>Difficulty</th>
                    <td><?= htmlspecialchars($trek['difficulty']) ?></td>
                </tr>
                <tr>
                    <th>Price per Person</th>
                    <td>₹<?= number_format($trek['price_per_person'], 2) ?></td>
                </tr>
                <tr>
                    <th>Number of People</th>
                    <td><?= htmlspecialchars($numPeople) ?></td>
                </tr>
                <tr>
                    <th>Base Camp</th>
                    <td><?= htmlspecialchars($trek['base_camp']) ?></td>
                </tr>
                <tr>
                    <th>Altitude</th>
                    <td><?= htmlspecialchars($trek['altitude']) ?> m</td>
                </tr>
                <tr>
                    <th>Distance</th>
                    <td><?= htmlspecialchars($trek['distance']) ?> km</td>
                </tr>
                <tr>
                    <th>Best Time to Visit</th>
                    <td><?= htmlspecialchars($trek['best_time']) ?></td>
                </tr>
                <tr>
                    <th>Accommodation</th>
                    <td><?= htmlspecialchars($trek['accommodation']) ?></td>
                </tr>
            </table>

            <h4>Rental Gear Selection</h4>
            <p class="text-danger">Note: Rental gears are charged per day per person.</p>

            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Gear Name</th>
                        <th>Price/Day</th>
                        <th>Quantity</th>
                        <th>Cost Calculation</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $gearResult = $conn->query("SELECT * FROM rental_gear WHERE stock > 0");
                    while ($gear = $gearResult->fetch_assoc()) {
                        echo "<tr>
                            <td>{$gear['gear_name']}</td>
                            <td>₹{$gear['price_per_day']}</td>
                            <td>
                                <input type='number' class='gear-quantity' 
                                    data-id='{$gear['gear_id']}' 
                                    data-price='{$gear['price_per_day']}' 
                                    min='0' max='{$gear['stock']}' 
                                    value='0'>
                            </td>
                            <td class='gear-cost' data-id='{$gear['gear_id']}'>₹0.00</td>
                        </tr>";
                    }
                    ?>
                </tbody>
            </table>

            <h4>Cost Breakdown</h4>
            <table class="table table-bordered">
                <tr>
                    <th>Base Trek Cost</th>
                    <td>₹<span id="baseCost"><?= number_format($trekCost, 2) ?></span></td>
                </tr>
                <tr>
                    <th>Rental Gear Cost</th>
                    <td>₹<span id="gearTotalCost">0.00</span></td>
                </tr>
                <tr class="table-success">
                    <th>Total Cost</th>
                    <td>₹<span id="totalCost"><?= number_format($trekCost, 2) ?></span></td>
                </tr>
            </table>

            <form id="bookingForm" action="booking_details.php" method="POST">
                <input type="hidden" name="trek_id" value="<?= $trekId ?>">
                <input type="hidden" name="slot_id" value="<?= $slotId ?>">
                <input type="hidden" name="num_people" value="<?= $numPeople ?>">
                <input type="hidden" name="slot_date" value="<?= $slotDate ?>">
                <input type="hidden" name="rental_gear" id="rentalGearInput">
                <input type="hidden" name="total_cost" id="finalTotalCost">
                <button type="submit" class="btn btn-success">Proceed to Details</button>
            </form>
        </div>

        <script>
            $(document).ready(function () {
                let trekCost = <?= $trekCost ?>;
                let trekDuration = <?= $trekDuration ?>;
                let gearTotalCost = 0;

                $(".gear-quantity").on("input", function () {
                    gearTotalCost = 0;
                    $(".gear-quantity").each(function () {
                        let quantity = parseInt($(this).val()) || 0;
                        let price = parseFloat($(this).data("price"));
                        let gearId = $(this).data("id");
                        let totalGearCost = price * quantity * trekDuration;

                        $(".gear-cost[data-id='" + gearId + "']").text("₹" + totalGearCost.toFixed(2));
                        gearTotalCost += totalGearCost;
                    });

                    let totalCost = trekCost + gearTotalCost;
                    $("#gearTotalCost").text(gearTotalCost.toFixed(2));
                    $("#totalCost").text(totalCost.toFixed(2));
                    $("#finalTotalCost").val(totalCost.toFixed(2));
                });

                $("#bookingForm").submit(function () {
                    let rentalGear = [];
                    $(".gear-quantity").each(function () {
                        let gearId = $(this).data("id");
                        let quantity = parseInt($(this).val());
                        if (quantity > 0) {
                            rentalGear.push({ gear_id: gearId, quantity: quantity });
                        }
                    });
                    $("#rentalGearInput").val(JSON.stringify(rentalGear));
                });
            });
        </script>
    </body>

    </html>

    <?php include('includes/footer.php'); ?>