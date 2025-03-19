<?php include('includes/header.php'); ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trek Details</title>
    <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
    <script src="../assets/jquery-3.7.1.min.js"></script>
    <style>
        .trek-image {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 10px;
        }

        .trek-info {
            margin-top: 20px;
        }

        .trek-info h3 {
            font-weight: bold;
        }

        .trek-info p {
            margin-bottom: 10px;
        }

        /* Horizontal Info Strip */
        .info-strip {
            display: flex;
            justify-content: space-around;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            margin-top: 20px;
        }

        .info-strip div {
            flex: 1;
        }

        .info-title {
            font-weight: bold;
            color: #333;
        }

        .info-value {
            font-size: 20px;
            color: #666;
        }

        /* Overview & Itinerary */
        .trip-container {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .trip-left,
        .trip-right {
            width: 48%;
            background-color: #f8f9fa;
        }

        /* Tabs Section */
        .tabs-container {
            margin-top: 20px;
        }

        .tab-content {
            background: #fff;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 10px;
        }

        .tab-button {
            margin-right: 10px;
            cursor: pointer;
            padding: 8px 15px;
            border: none;
            background: #007bff;
            color: white;
            border-radius: 5px;
        }

        .tab-button.active {
            background: #0056b3;
        }

        /* Guide Info */
        .guide-info {
            background: #f8f9fa;
            padding: 15px;
            text-align: center;
            margin-top: 20px;
            border-radius: 10px;
        }

        /* Booking Availability */
        .booking-availability {
            margin-top: 20px;
            background: #f1f1f1;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container my-5">
        <?php
        // Database connection
        include('includes/db_connection.php');

        $isLoggedIn = isset($_SESSION['user_id']);


        // Fetch trek details by ID
        $trekId = isset($_GET['trek_id']) ? $_GET['trek_id'] : null;
        if ($trekId) {
            // Updated SQL query with JOIN to fetch guide name
            $stmt = $conn->prepare("
                SELECT treks.*, guides.guide_name 
                FROM treks 
                LEFT JOIN guides ON treks.guide_id = guides.guide_id 
                WHERE treks.trek_id = ?
            ");
            $stmt->bind_param("i", $trekId);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $trek = $result->fetch_assoc();
                echo '
                <img src="../assets/images/' . htmlspecialchars($trek['cover_image']) . '" alt="' . htmlspecialchars($trek['trek_name']) . '" class="trek-image">
                <div class="trek-info">
                    <h3>' . htmlspecialchars($trek['trek_name']) . '</h3>
                    <p>' . htmlspecialchars($trek['description']) . '</p>
                    <p><strong>Duration:</strong> ' . htmlspecialchars($trek['duration_days']) . ' days</p>
                    <p><strong>Difficulty:</strong> ' . htmlspecialchars($trek['difficulty']) . '</p>
                    <p><strong>Price:</strong> Rs. ' . htmlspecialchars($trek['price_per_person']) . '<small style="font-size:x-small; color: grey;">(Including GST)</small></p>
                    <p><strong>Location:</strong> ' . htmlspecialchars($trek['location']) . '</p>
                </div>

                <!-- Horizontal Information Strip -->
                <div class="info-strip">
                    <div><p class="info-title">Difficulty</p><p class="info-value">' . htmlspecialchars($trek['difficulty']) . '</p></div>
                    <div><p class="info-title">Base Camp</p><p class="info-value">' . htmlspecialchars($trek['base_camp']) . '</p></div>
                    <div><p class="info-title">Accommodation</p><p class="info-value">' . htmlspecialchars($trek['accommodation']) . '</p></div>
                    <div><p class="info-title">Best Time</p><p class="info-value">' . htmlspecialchars($trek['best_time']) . '</p></div>
                    <div><p class="info-title">Altitude</p><p class="info-value">' . htmlspecialchars($trek['altitude']) . ' mt</p></div>
                    <div><p class="info-title">Distance</p><p class="info-value">' . htmlspecialchars($trek['distance']) . ' km</p></div>
                </div>

                <!-- Overview & Itinerary -->
                <div class="trip-container">
                    <div class="trip-left">
                        <h4>Overview</h4>
                        <p>' . htmlspecialchars($trek['overview']) . '</p>
                    </div>
                    <div class="trip-right">
                        <h4>Itinerary</h4>
                        <p>' . nl2br(htmlspecialchars($trek['itinerary'])) . '</p>
                    </div>
                </div>

                <!-- Tabs Section -->
                <div class="tabs-container">
                    <button class="tab-button active" onclick="loadTab(\'inclusion\', this)">Inclusions</button>
                    <button class="tab-button" onclick="loadTab(\'exclusion\', this)">Exclusions</button>
                    <button class="tab-button" onclick="loadTab(\'equipment\', this)">Required Equipment</button>

                    <div id="tab-content" class="tab-content">Loading...</div>
                </div>

                <!-- Guide Info -->
                <div class="guide-info">
                    <p><strong>Guide:</strong> ' . (!empty($trek['guide_name']) ? htmlspecialchars($trek['guide_name']) : 'Not Assigned') . '</p>
                </div>
                ';
                ?>

                <?php
                echo '<div class="booking-availability w-50 mx-auto">';

                $slotStmt = $conn->prepare("
                SELECT DATE_FORMAT(start_date, '%M %Y') AS month_year, start_date, available_slots 
                FROM trek_slots 
                WHERE trek_id = ? AND available_slots > 0 
                ORDER BY start_date ASC
                ");

                $slotStmt->bind_param("i", $trekId);
                $slotStmt->execute();
                $slotResult = $slotStmt->get_result();

                $slotsByMonth = [];
                while ($slot = $slotResult->fetch_assoc()) {
                    $slotsByMonth[$slot['month_year']][] = [
                        'date' => $slot['start_date'],
                        'available' => $slot['available_slots']
                    ];
                }
                $slotStmt->close();

                // Booking Availability Section
                echo '<div class="booking-availability"> <h4>Available Slots</h4>';

                if (!empty($slotsByMonth)) {
                    foreach ($slotsByMonth as $month => $dates) {
                        echo '<div class="mb-3">
                                <label class="form-label"><strong>' . htmlspecialchars($month) . ':</strong></label>
                                <select class="form-select slot-dropdown" name="slot_date">';
                        foreach ($dates as $slot) {
                            echo '  <option value="' . htmlspecialchars($slot['date']) . '">'
                                . date("d M Y", strtotime($slot['date'])) .
                                ' (Available: ' . htmlspecialchars($slot['available']) . ')
                                    </option>';
                        }
                        echo '          </select>
                            </div>
                            <div class="mb-3">
                    
                    
                    </div>
                    
                    ';
                    }
                    echo '
                    </div>
                    <label class="form-label"><strong>Number of People:</strong></label>
                    <input type="number" class="form-control" name="num_people" min="1" required>
                    ';

                    // Proceed Booking Button
                    echo '<div class="w-50 mx-auto"><button class="btn btn-primary w-100 my-5" id="proceedBooking"' . (!$isLoggedIn ? 'disabled' : '') . '>Proceed to Booking</button>';
                    if (!$isLoggedIn) {
                        echo '<p class="mt-2 text-danger text-center">You need to <a href="../pages/login.php">log in</a> to proceed with the booking.</p>';
                    }
                    echo '</div>';
                } else {
                    echo '<p>No slots available.</p></div>';
                }

            } else {
                echo '<p class="text-center">Trek not found.</p>';
            }
            $stmt->close();
        } else {
            echo '<p class="text-center">Invalid trek ID.</p>';
        }

        $conn->close();
        ?>
    </div>

    <script>
        document.getElementById("proceedBooking").addEventListener("click", function () {
            let selectedSlot = document.querySelector(".slot-dropdown").value;
            let numPeople = document.querySelector("input[name='num_people']").value;
            let trekId = <?= $trekId ?>;

            if (!selectedSlot) {
                alert("Please select a slot.");
                return;
            }
            if (!numPeople || numPeople < 1) {
                alert("Please enter a valid number of people.");
                return;
            }

            // Redirecting to a booking processing page (Modify URL as needed)
            window.location.href = "booking_summary.php?slot_date=" + encodeURIComponent(selectedSlot) + "&num_people=" + encodeURIComponent(numPeople) + "&trek_id=" + encodeURIComponent(trekId);
        });
    </script>

    <script>
        function loadTab(type, element) {
            // Change active tab styling
            $(".tab-button").removeClass("active");
            $(element).addClass("active");

            // Show loading message
            $("#tab-content").html("<p>Loading...</p>");

            // Send AJAX request
            $.post("trek_load_ajax/load_trek_details.php", { trek_id: <?= $trekId ?>, type: type }, function (response) {
                $("#tab-content").html(response);
            }).fail(function () {
                $("#tab-content").html("<p>Error loading data.</p>");
            });
        }

        // Load "Inclusions" by default on page load
        $(document).ready(function () {
            loadTab('inclusion', $(".tab-button").first());
        });
    </script>


    <script src="../assets/bootstrap/js/bootstrap.bundle.min.js"></script>
</body>

</html>
<?php include('includes/footer.php'); ?>