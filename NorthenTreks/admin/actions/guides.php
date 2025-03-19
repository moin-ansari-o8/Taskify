
<?php
require_once '../../includes/db_connection.php';

// Fetch Users
$result = $conn->query("SELECT user_id, first_name, last_name, email, phone_number, user_role FROM users");

echo '<h3>Users Management</h3>';
echo '<button class="btn btn-primary mb-3" onclick="showAddUserModal()">Add User</button>';
echo '<table class="table table-bordered"><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Actions</th></tr>';

while ($row = $result->fetch_assoc()) {
    echo "<tr>
            <td>{$row['user_id']}</td>
            <td>{$row['first_name']} {$row['last_name']}</td>
            <td>{$row['email']}</td>
            <td>{$row['phone_number']}</td>
            <td>{$row['user_role']}</td>
            <td>
                <button class='btn btn-sm btn-warning' onclick='editUser({$row['user_id']})'>Edit</button>
                <button class='btn btn-sm btn-danger' onclick='deleteUser({$row['user_id']})'>Delete</button>
            </td>
          </tr>";
}
echo '</table>';
?>

<script>
    function showAddUserModal() {
        alert("Show modal for adding user"); // You can replace this with a Bootstrap modal
    }

    function editUser(id) {
        alert("Edit user: " + id);
    }

    function deleteUser(id) {
        if (confirm("Are you sure?")) {
            $.post("actions/delete_user.php", { user_id: id }, function (response) {
                alert(response);
                loadPage('users');
            });
        }
    }
</script>