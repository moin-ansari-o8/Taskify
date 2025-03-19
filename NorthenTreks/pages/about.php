<?php include('../includes/header.php'); ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - NorthernTreks</title>
    <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
    <style>
        .team-img {
            width: 150px;
            height: 150px;
            object-fit: cover;
        }
    </style>
</head>

<body>
    <div class="container mt-5">
        <h2 class="text-center mb-4">About NorthernTreks</h2>
        <p class="text-center lead">Discover the journey behind your next adventure.</p>

        <div class="row">
            <div class="col-md-8 mx-auto">
                <!-- Company Overview -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h4>Our Story</h4>
                        <p>Founded in 2020, NorthernTreks was born from a passion for exploration and a love for the
                            rugged beauty of Northern landscapes. Our mission is to connect adventurers with
                            unforgettable experiences, offering expertly guided treks through the Himalayas and beyond.
                            Whether you're a seasoned trekker or a first-time explorer, we’re here to make your journey
                            safe, thrilling, and memorable.</p>
                        <p>We believe in sustainable travel, supporting local communities, and preserving the natural
                            wonders we explore. Join us to experience the North like never before!</p>
                    </div>
                </div>

                <!-- Mission -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h4>Our Mission</h4>
                        <ul>
                            <li>Provide safe and exciting trekking experiences.</li>
                            <li>Promote eco-friendly and responsible tourism.</li>
                            <li>Empower local guides and communities.</li>
                            <li>Inspire a love for nature and adventure.</li>
                        </ul>
                    </div>
                </div>

                <!-- Team -->
                <div class="card">
                    <div class="card-body">
                        <h4>Meet Our Team</h4>
                        <div class="row text-center">
                            <div class="col-md-4 mb-3">
                                <img src="../assets/images/team1.jpg" alt="Team Member 1"
                                    class="rounded-circle team-img">
                                <h5 class="mt-2">Amit Sharma</h5>
                                <p>Founder & Lead Guide</p>
                            </div>
                            <div class="col-md-4 mb-3">
                                <img src="../assets/images/team2.jpg" alt="Team Member 2"
                                    class="rounded-circle team-img">
                                <h5 class="mt-2">Priya Patel</h5>
                                <p>Operations Manager</p>
                            </div>
                            <div class="col-md-4 mb-3">
                                <img src="../assets/images/team3.jpg" alt="Team Member 3"
                                    class="rounded-circle team-img">
                                <h5 class="mt-2">Ravi Kumar</h5>
                                <p>Marketing Lead</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="../assets/bootstrap/js/bootstrap.bundle.min.js"></script>
</body>

</html>

<?php include('../includes/footer.php'); ?>