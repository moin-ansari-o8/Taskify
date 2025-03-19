<?php
require_once '../../includes/db_connection.php';

// Fetch Treks
$result = $conn->query("SELECT trek_id, trek_name, location, difficulty, price_per_person FROM treks");

echo '<h3>Treks Management</h3>';
echo '<button class="btn btn-primary mb-3" onclick="OpenAddTrekPage()">Add Trek</button>';
echo '<table class="table table-bordered"><tr><th>ID</th><th>Name</th><th>Location</th><th>Difficulty</th><th>Price</th><th>Actions</th></tr>';

while ($row = $result->fetch_assoc()) {
    echo "<tr>
            <td>{$row['trek_id']}</td>
            <td>{$row['trek_name']}</td>
            <td>{$row['location']}</td>
            <td>{$row['difficulty']}</td>
            <td>{$row['price_per_person']}</td>
            <td>
                <button class='btn btn-sm btn-warning' onclick='editTrek({$row['trek_id']})'>Edit</button>
                <button class='btn btn-sm btn-danger' onclick='deleteTrek({$row['trek_id']})'>Delete</button>
            </td>
          </tr>";
}
echo '</table>';
?>

<script>
    function showAddTrekModal() {
        $.post('../addtreks.php');
    }

    function OpenAddTrekPage(){
        window.location.href = '../addtreks.php';
    }

    function editTrek(id) {
        alert("Edit trek: " + id);
    }

    function deleteTrek(id) {
        if (confirm("Are you sure?")) {
            $.post("actions/delete_trek.php", { trek_id: id }, function (response) {
                alert(response);
                loadPage('treks');
            });
        }
    }
</script>