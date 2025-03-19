<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Users Management</title>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="../../assets/bootstrap/css/bootstrap.min.css">

    <!-- jQuery -->
    <script src="../../assets/jquery-3.7.1.min.js"></script>

    <!-- Bootstrap JS -->
    <script src="../../assets/bootstrap/js/bootstrap.bundle.min.js"></script>
</head>

<body>

    <div class="container mt-4">
        <h3 class="mb-3">Users Management</h3>
        <button class="btn btn-primary mb-3" onclick="showAddUserModal()">Add User</button>

        <table class="table table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php
                require_once '../../includes/db_connection.php';
                $result = $conn->query("SELECT user_id, first_name, last_name, email, phone_number, user_role FROM users");

                while ($row = $result->fetch_assoc()) {
                    echo "<tr>
                        <td>{$row['user_id']}</td>
                        <td>{$row['first_name']} {$row['last_name']}</td>
                        <td>{$row['email']}</td>
                        <td>{$row['phone_number']}</td>
                        <td>{$row['user_role']}</td>
                        <td>
                            <button class='btn btn-sm btn-warning' onclick='editUser({$row['user_id']}, \"{$row['first_name']}\", \"{$row['last_name']}\", \"{$row['email']}\", \"{$row['phone_number']}\", \"{$row['user_role']}\")'>Edit</button>
                            <button class='btn btn-sm btn-danger' onclick='deleteUser({$row['user_id']})'>Delete</button>
                        </td>
                      </tr>";
                }
                ?>
            </tbody>
        </table>
    </div>

    <!-- Add User Modal -->
    <div id="addUserModal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add User</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="addUserForm">
                        <input type="text" name="first_name" class="form-control mb-2" placeholder="First Name"
                            required>
                        <input type="text" name="last_name" class="form-control mb-2" placeholder="Last Name" required>
                        <input type="email" name="email" class="form-control mb-2" placeholder="Email" required>
                        <input type="text" name="phone_number" class="form-control mb-2" placeholder="Phone Number"
                            required>
                        <input type="password" name="password" class="form-control mb-2" placeholder="Password"
                            required>
                        <select name="user_role" class="form-control mb-2">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button type="submit" class="btn btn-success">Add User</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit User Modal -->
    <div id="editUserModal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit User</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="editUserForm">
                        <input type="hidden" name="user_id" id="edit_user_id">
                        <input type="text" name="first_name" id="edit_first_name" class="form-control mb-2"
                            placeholder="First Name" required>
                        <input type="text" name="last_name" id="edit_last_name" class="form-control mb-2"
                            placeholder="Last Name" required>
                        <input type="email" name="email" id="edit_email" class="form-control mb-2" placeholder="Email"
                            required>
                        <input type="text" name="phone_number" id="edit_phone" class="form-control mb-2"
                            placeholder="Phone Number" required>
                        <select name="user_role" id="edit_user_role" class="form-control mb-2">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button type="submit" class="btn btn-warning">Update User</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        function showAddUserModal() {
            $("#addUserModal").modal("show");
        }

        function editUser(id, firstName, lastName, email, phone, role) {
            $("#edit_user_id").val(id);
            $("#edit_first_name").val(firstName);
            $("#edit_last_name").val(lastName);
            $("#edit_email").val(email);
            $("#edit_phone").val(phone);
            $("#edit_user_role").val(role);
            $("#editUserModal").modal("show");
        }

        $("#addUserForm").submit(function (e) {
            e.preventDefault();
            $.post("actions/add_user.php", $(this).serialize(), function (response) {
                alert(response);
                $("#addUserModal").modal("hide");
                loadPage('users'); // Reload Users list
            });
        });

        $("#editUserForm").submit(function (e) {
            e.preventDefault();
            $.post("actions/edit_user.php", $(this).serialize(), function (response) {
                alert(response);
                $("#editUserModal").modal("hide");
                loadPage('users'); // Reload Users list
            });
        });

        function deleteUser(id) {
            if (confirm("Are you sure you want to delete this user?")) {
                $.post("actions/delete_user.php", { user_id: id }, function (response) {
                    alert(response);
                    loadPage('users'); // Reload Users list
                });
            }
        }
    </script>

</body>

</html>