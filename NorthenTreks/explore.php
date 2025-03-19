<?php include('includes/header.php'); ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Explore Treks</title>
    <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css"> <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="../assets/bootstrap-icons/font/bootstrap-icons.css"> <!-- Bootstrap Icons CSS -->
    <script src="../assets/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/bootstrap/js/bootstrap.min.js"></script>
    <!-- Bootstrap Icons -->
    <style>
        .trek-card {
            width: 300px;
            /* Consistent card width */
            border: 1px solid #ddd;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .carousel-item {
            justify-content: center;
        }


        .trek-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }

        .trek-card-body {
            padding: 15px;
        }

        .trek-card-title {
            font-weight: bold;
        }

        .category-title {
            margin-top: 30px;
            margin-bottom: 20px;
            font-size: 1.5rem;
            font-weight: bold;
            text-align: center;
        }

        /* .carousel-item {
            display: flex;
            gap: 15px;
            justify-content: center;
            /* Center-align the cards
        } */

        .carousel-control-prev,
        .carousel-control-next {
            width: 5%;
            /* Narrower controls */
        }

        .carousel-control-prev-icon,
        .carousel-control-next-icon {
            background-color: rgba(0, 0, 0, 0.5);
            /* Add background for better visibility */
            border-radius: 50%;
            /* Optional for a rounded look */
        }

        .carousel-control-prev {
            left: -2%;
            /* Move the prev button slightly outside */
        }

        .carousel-control-next {
            right: -2%;
            /* Move the next button slightly outside */
        }
    </style>
</head>

<body>
    <div class="container my-5">
        <h1 class="text-center mb-5">Explore Treks</h1>

        <?php
        include('includes/db_connection.php'); // Replace with your DB connection file
        
        // Fetch all treks from the database
        $query = "SELECT DISTINCT t.* 
          FROM treks t
          LEFT JOIN trek_slots ts ON t.trek_id = ts.trek_id
          WHERE ts.start_date >= CURDATE() OR t.keywords LIKE '%upcoming%'"; // Replace 'treks' with your table name
        $result = mysqli_query($conn, $query);

        $treks = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $treks[] = $row;
        }

        // Predefined categories and their conditions (keywords)
        $categories = [
            "Upcoming Treks" => ["upcoming", "soon", "future", "next", "planned", "scheduled"],
            "Spring Treks" => ["spring", "bloom", "flowers", "seasonal", "springtime"],
            "Winter Treks" => ["winter", "snow", "chilly", "cold", "snowfall", "frost"],
            "Maharashtra Treks" => ["maharashtra", "sahyadri", "pune", "mumbai", "lonavala", "raigad", "khandala", "bhimashankar"],
            "Off-Beat Treks" => ["offbeat", "hidden", "unexplored", "kashmir", "remote", "adventure", "secluded"],
            "Adventure Treks" => ["adventure", "extreme", "challenging", "rugged", "thrill", "daring"],
            "Family-Friendly Treks" => ["family", "easy", "kids", "beginner", "friendly", "safe"],
            "Himalayan Treks" => ["himalayas", "north india", "high altitude", "mountains", "snowy peaks", "Himalayan"],
            "Desert Treks" => ["desert", "sand dunes", "dry", "arid", "hot", "desolate"],
            "Lake Treks" => ["lake", "waterbody", "serene", "peaceful", "clear water", "glacial lake"],
        ];


        // Categorize treks dynamically
        $categorizedTreks = [];
        foreach ($categories as $category => $keywords) {
            $categorizedTreks[$category] = [];
            foreach ($treks as $trek) {
                // Convert keywords in the database to an array
                $trekKeywords = explode(',', strtolower($trek['keywords'])); // Convert keywords to lowercase
        
                foreach ($keywords as $keyword) {
                    if (in_array(strtolower($keyword), $trekKeywords)) {
                        $categorizedTreks[$category][] = $trek;
                        break;
                    }
                }
            }
        }
        ?>

        <?php foreach ($categorizedTreks as $category => $treks): ?>
            <?php if (count($treks) > 0): ?>
                <h2 class="category-title"><?php echo $category; ?></h2>
                <div id="carousel-<?php echo str_replace(' ', '-', strtolower($category)); ?>" class="carousel slide"
                    data-bs-ride="carousel">
                    <div class="carousel-inner">
                        <?php foreach (array_chunk($treks, 3) as $index => $trekGroup): ?>
                            <div class="carousel-item <?php echo $index === 0 ? 'active' : ''; ?>">
                                <div class="d-flex gap-4 justify-content-center">
                                    <?php foreach ($trekGroup as $trek): ?>
                                        <div class="trek-card">
                                            <?php echo '<img src="../assets/images/'.$trek['cover_image'].'" alt="'.$trek['trek_name'].'">';?>
                                            <div class="trek-card-body">
                                                <h5 class="trek-card-title"><?php echo $trek['trek_name']; ?></h5>
                                                <p class="text-muted"><?php echo substr($trek['description'], 0, 100) . '...'; ?></p>
                                                <a href="LoadTrekDetails.php?trek_id=<?php echo $trek['trek_id']; ?>"
                                                    class="btn btn-primary btn-sm">View Details</a>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carousel-<?php echo str_replace(' ', '-', strtolower($category)); ?>" data-bs-slide="prev">
                        <img src="assets\images\prev.png" style="width: 40px; height: 40px;" alt="Previous"
                            class="control-icon">
                        <span class="visually-hidden">Previous</span>
                    </button>

                    <button class="carousel-control-next" type="button" data-bs-target="#carousel-<?php echo str_replace(' ', '-', strtolower($category)); ?>" data-bs-slide="next">
                        <img src="assets\images\next.png" style="width: 40px; height: 40px;" alt="Next" class="control-icon">
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>


            <?php endif; ?>
        <?php endforeach; ?>
    </div>

    
</body>

</html>
<?php include('includes/footer.php'); ?>