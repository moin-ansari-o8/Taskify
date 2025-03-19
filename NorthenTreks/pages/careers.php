<?php include('../includes/header.php'); ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Careers - NorthernTreks</title>
    <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
</head>

<body>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Careers at NorthernTreks</h2>
        <p class="text-center lead">Join our team and help adventurers explore the breathtaking landscapes of the North!
        </p>

        <div class="row">
            <div class="col-md-8 mx-auto">
                <!-- Job Listings -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h4>Current Openings</h4>
                        <hr>
                        <div class="mb-3">
                            <h5>Trek Guide</h5>
                            <p><strong>Location:</strong> Himalayan Region</p>
                            <p><strong>Requirements:</strong> Experience in trekking, knowledge of local terrain, first
                                aid certification.</p>
                            <p><strong>Description:</strong> Lead groups on treks, ensure safety, and share the wonders
                                of the region.</p>
                        </div>
                        <div class="mb-3">
                            <h5>Marketing Coordinator</h5>
                            <p><strong>Location:</strong> Remote/Work from Home</p>
                            <p><strong>Requirements:</strong> Marketing experience, social media skills, passion for
                                travel.</p>
                            <p><strong>Description:</strong> Promote NorthernTreks through campaigns and partnerships.
                            </p>
                        </div>
                        <div>
                            <h5>Customer Support Specialist</h5>
                            <p><strong>Location:</strong> Office in Delhi</p>
                            <p><strong>Requirements:</strong> Excellent communication, problem-solving skills.</p>
                            <p><strong>Description:</strong> Assist customers with bookings and inquiries.</p>
                        </div>
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="card">
                    <div class="card-body">
                        <h4>Apply or Inquire</h4>
                        <p>Interested? Send us your details, and we’ll get back to you!</p>
                        <form action="mailto:careers@northerntreks.com" method="POST" enctype="multipart/form-data">
                            <div class="mb-3">
                                <label for="name" class="form-label">Full Name</label>
                                <input type="text" id="name" name="name" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" id="email" name="email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="position" class="form-label">Position Applying For</label>
                                <select id="position" name="position" class="form-control" required>
                                    <option value="">-- Select --</option>
                                    <option value="Trek Guide">Trek Guide</option>
                                    <option value="Marketing Coordinator">Marketing Coordinator</option>
                                    <option value="Customer Support Specialist">Customer Support Specialist</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="message" class="form-label">Message</label>
                                <textarea id="message" name="message" class="form-control" rows="4"
                                    placeholder="Tell us about yourself or your inquiry"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="resume" class="form-label">Upload Resume (PDF only)</label>
                                <input type="file" id="resume" name="resume" class="form-control" accept=".pdf">
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Submit Application</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="../assets/bootstrap/js/bootstrap.bundle.min.js"></script>
</body>

</html>

<?php include('../includes/footer.php'); ?>