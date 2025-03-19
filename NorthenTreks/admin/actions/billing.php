<?php
require_once '../../includes/db_connection.php';

// Fetch Billing Data
$result = $conn->query("SELECT b.billing_id, u.first_name, u.last_name, b.amount, b.payment_status FROM billing b JOIN users u ON b.user_id = u.user_id");

echo '<h3>Billing Transactions</h3>';
echo '<table class="table table-bordered"><tr><th>ID</th><th>User</th><th>Amount</th><th>Status</th></tr>';

while ($row = $result->fetch_assoc()) {
    echo "<tr>
            <td>{$row['billing_id']}</td>
            <td>{$row['first_name']} {$row['last_name']}</td>
            <td>{$row['amount']}</td>
            <td>{$row['payment_status']}</td>
          </tr>";
}
echo '</table>';
?>
