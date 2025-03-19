<div class="container mt-4">
    <h2>Manage Rental Gear</h2>

    <!-- Add New Gear Form -->
    <h4>Add New Gear</h4>
    <form id="addGearForm" class="gear-form">
        <input type="text" name="gear_name" placeholder="Gear Name" required>
        <input type="text" name="description" placeholder="Description" required>
        <input type="number" name="price" placeholder="Price (per day)" required>
        <input type="number" name="stock" placeholder="Stock" required>
        <button type="submit" class="btn btn-primary">Add Gear</button>
    </form>

    <div id="responseMessage"></div> <!-- To display success/error messages -->

    <!-- Display Existing Gear -->
    <h4>Existing Rental Gear</h4>
    <table class="table table-bordered table-striped">
        <thead class="thead-dark">
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="gearTable">
            <?php
            include '../../includes/db_connection.php';
            $query = "SELECT * FROM rental_gear";
            $result = mysqli_query($conn, $query);
            while ($row = mysqli_fetch_assoc($result)) {
                echo "<tr>
                        <td>{$row['gear_id']}</td>
                        <td>{$row['gear_name']}</td>
                        <td>₹ {$row['price_per_day']}</td>
                        <td>{$row['stock']}</td>
                        <td>
                            <div class='action-group'>
                                <form class='updateGearForm' data-id='{$row['gear_id']}'>
                                    <input type='text' name='gear_name' value='{$row['gear_name']}' required>
                                    <textarea name='description' rows='3' required>{$row['description']}</textarea>
                                    <input type='number' name='price' value='{$row['price_per_day']}' required>
                                    <input type='number' name='stock' value='{$row['stock']}' required>
                                    <button type='submit' class='btn btn-sm btn-success'>Update</button>
                                </form>
                                <button class='btn btn-sm btn-danger deleteGear' data-id='{$row['gear_id']}'>Delete</button>
                            </div>
                        </td>
                      </tr>";
            }
            ?>
        </tbody>
    </table>
</div>

<!-- Add Bootstrap and jQuery -->
<script src="../assets/jquery-3.7.1.min.js"></script>
<script>
    $(document).ready(function () {
        // Add Gear AJAX
        $("#addGearForm").submit(function (e) {
            e.preventDefault(); // Prevent default form submission

            $.ajax({
                url: "actions/manage_rental_gear_actions.php",
                type: "POST",
                data: $(this).serialize() + "&action=add",
                success: function (response) {
                    $("#responseMessage").html(response);
                    loadPage('manage_rental_gear'); // Refresh the gear list
                }
            });
        });

        // Update Gear AJAX
        $(".updateGearForm").submit(function (e) {
            e.preventDefault();
            let gearId = $(this).data("id");

            $.ajax({
                url: "actions/manage_rental_gear_actions.php",
                type: "POST",
                data: $(this).serialize() + "&action=update&gear_id=" + (gearId ? gearId : ''),
                success: function (response) {
                    $("#responseMessage").html(response);
                    loadPage('manage_rental_gear');
                }
            });
        });

        // Delete Gear AJAX
        $(".deleteGear").click(function () {
            let gearId = $(this).data("id");

            if (confirm("Are you sure?")) {
                $.ajax({
                    url: "actions/manage_rental_gear_actions.php",
                    type: "POST",
                    data: { action: "delete", gear_id: (gearId ? gearId : '') },
                    success: function (response) {
                        $("#responseMessage").html(response);
                        loadPage('manage_rental_gear');
                    }
                });
            }
        });
    });
</script>

<style>
    /* Form styling */
    .gear-form input {
        display: block;
        width: 100%;
        margin-bottom: 10px;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    /* Align buttons and inputs properly */
    .action-group {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .action-group form {
        display: flex;
        gap: 5px;
        align-items: center;
    }

    /* Responsive Table */
    .table {
        width: 100%;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }

    .table thead {
        background-color: #343a40;
        color: #fff;
    }

    .table tbody tr:hover {
        background-color: #f1f1f1;
    }

    /* Buttons */
    .btn {
        padding: 5px 10px;
        border-radius: 3px;
        font-size: 14px;
    }

    .btn-primary {
        background-color: #007bff;
        border: none;
    }

    .btn-success {
        background-color: #28a745;
        border: none;
    }

    .btn-danger {
        background-color: #dc3545;
        border: none;
    }
</style>