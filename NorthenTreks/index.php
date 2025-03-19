<?php include('includes/header.php'); ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Northen Treks</title>

    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/slick/slick.css">
    <link rel="stylesheet" href="assets/slick/slick-theme.css">

    <script src="assets/bootstrap/js/bootstrap.bundle.min.js" defer></script>
    <script src="assets/jquery/jquery.min.js" defer></script>
    <script src="assets/slick/slick.min.js" defer></script>
</head>

<body>
    <!-- Hero Section -->
    <section class="hero-section text-center text-white d-flex align-items-center justify-content-center"
        style="background: linear-gradient(to right, #4e54c8, #8f94fb); height: 60vh;">
        <div>
            <h1>Explore The Unseen</h1>
            <p>Find the best trekking experiences across the country</p>
            <a href="explore.php" class="btn btn-primary mt-3">Explore Treks</a>
        </div>
    </section>

    <!-- Why Choose Us? -->
    <section class="container my-5">
        <h2 class="text-center mb-4">Why Choose Northern Treks?</h2>
        <div class="row text-center">
            <div class="col-md-4">
                <img src="assets/icons/guide.png" alt="Expert Guides" width="60">
                <h5 class="mt-2">Expert Guides</h5>
                <p>Our experienced guides ensure a safe and memorable trek.</p>
            </div>
            <div class="col-md-4">
                <img src="assets/icons/nature.png" alt="Scenic Routes" width="60">
                <h5 class="mt-2">Scenic Routes</h5>
                <p>We take you through some of the most breathtaking landscapes.</p>
            </div>
            <div class="col-md-4">
                <img src="assets/icons/safety.png" alt="Safety First" width="60">
                <h5 class="mt-2">Safety First</h5>
                <p>We prioritize your safety with well-planned treks.</p>
            </div>
        </div>
    </section>

    <!-- Upcoming Treks -->
    <section class="container my-5">
        <h2 class="text-center mb-4">Upcoming Treks</h2>
        <div class="row">
            <?php
            include('includes/db_connection.php');
            $query = "SELECT DISTINCT t.trek_id, t.duration_days, t.difficulty, t.trek_name, t.cover_image, t.description 
                        FROM treks t 
                        JOIN trek_slots ts ON t.trek_id = ts.trek_id 
                        WHERE ts.start_date > CURDATE() 
                        ORDER BY ts.start_date ASC 
                        LIMIT 4";
            $result = mysqli_query($conn, $query);
            while ($trek = mysqli_fetch_assoc($result)) {
                echo '<div class="col-md-3">
                        <div class="card shadow-sm" style="height:350px;">
                            <img style="height:200px;" src="assets/images/' . htmlspecialchars($trek['cover_image']) . '" class="card-img-top" alt="' . htmlspecialchars($trek['trek_name']) . '">
                            <div class="card-body">
                                <h5 class="card-title">' . htmlspecialchars($trek['trek_name']) . '</h5>
                                <p class="text-muted"><b>' . htmlspecialchars($trek['duration_days']) . '</b> Days (<b>' . htmlspecialchars($trek['difficulty']) . '</b>)</p>
                                <a href="LoadTrekDetails.php?trek_id=' . htmlspecialchars($trek['trek_id']) . '" class="btn btn-success">View Details</a>
                            </div>
                        </div>
                    </div>';
            }
            ?>
        </div>
    </section>

    <!-- Testimonials -->
    <section class="container my-5">
        <h2 class="text-center mb-4">What Trekkers Say</h2>
        <div class="slider">
            <div>
                <div class="card p-3 m-2">
                    <p>“Amazing experience! The team ensured a great journey.”</p>
                    <h6>- Rahul Sharma</h6>
                </div>
            </div>
            <div>
                <div class="card p-3">
                    <p>“One of the best treks of my life. Highly recommended!”</p>
                    <h6>- Ananya Verma</h6>
                </div>
            </div>
            <div>
                <div class="card p-3">
                    <p>“Beautiful trails and great hospitality. Will come again!”</p>
                    <h6>- Vikram Patel</h6>
                </div>
            </div>
        </div>
    </section>

    <!-- Blog Section -->
    <section class="container my-5">
        <h2 class="text-center mb-4">Trekking Tips & Guides</h2>
        <div class="row">
            <div class="col-md-4">
                <img src="assets/images/blog1.jpg" class="img-fluid rounded mb-2" alt="Trekking Tips">
                <h6>Best Winter Treks for 2025</h6>
                <p>Discover the best winter treks you should explore this year.</p>
                <a href="blog.php" class="text-primary">Read More</a>
            </div>
            <div class="col-md-4">
                <img src="assets/images/blog2.jpg" class="img-fluid rounded mb-2" alt="Packing List">
                <h6>Essential Trekking Packing List</h6>
                <p>Make sure you're carrying all the necessary trekking gear.</p>
                <a href="blog.php" class="text-primary">Read More</a>
            </div>
            <div class="col-md-4">
                <img src="assets/images/blog3.jpg" class="img-fluid rounded mb-2" alt="Altitude Sickness">
                <h6>How to Avoid Altitude Sickness</h6>
                <p>Stay safe and enjoy your trek without altitude sickness.</p>
                <a href="blog.php" class="text-primary">Read More</a>
            </div>
        </div>
    </section>

    <!-- Newsletter Signup -->
    <section class="container my-5 text-center">
        <h2>Stay Updated with New Treks</h2>
        <p>Subscribe to get the latest trekking updates and offers.</p>
        <form action="subscribe.php" method="POST">
            <input type="email" name="email" placeholder="Enter your email" required
                class="form-control w-50 mx-auto my-2">
            <button type="submit" class="btn btn-primary">Subscribe</button>
        </form>
    </section>

    <!-- Scripts -->
    <script>
        $(document).ready(function () {
            $('.slider').slick({
                infinite: true,
                slidesToShow: 2,
                slidesToScroll: 1,
                arrows: true,
                dots: true,
                responsive: [
                    { breakpoint: 768, settings: { slidesToShow: 1 } }
                ]
            });
        });
    </script>

</body>

</html>

<?php include('includes/pre_footer.php'); ?>
<?php include('includes/footer.php'); ?>