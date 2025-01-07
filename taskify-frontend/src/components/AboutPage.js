import React from "react";
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-us">
      {/* Header Section */}
      <div
        className="bg-primary text-white text-center py-5"
        style={{ marginTop: "55px", borderRadius: "5px" }}
      >
        <h1 className="display-4">About Taskify</h1>
        <p className="lead">
          The smart, simple, and intuitive way to manage your tasks and boost
          team productivity.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="container my-5">
        <h2 className="text-left mb-2">Our Story</h2>
        <hr style={{ width: "40%", marginLeft: "0" }} />
        <p className="text-left mb-5">
          Taskify was born from a simple but powerful idea: making task
          management easier, more intuitive, and enjoyable for everyone. In a
          world where collaboration is key and productivity is crucial, we
          wanted to create a platform that empowers individuals, teams, and
          organizations to streamline their tasks and stay organized in the most
          efficient way possible.
        </p>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div
              className="card"
              style={{
                background: "linear-gradient(45deg, #8C4F30, #5B3A29)",
              }}
            >
              <img
                src="https://via.placeholder.com/500x300"
                alt="Our Story"
                className="img-fluid rounded"
              />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div
              className="card p-3"
              style={{
                background: "linear-gradient(45deg, #8C4F30, #5B3A29)",
              }}
            >
              <p>
                Taskify is the result of countless hours of research,
                development, and testing. From the beginning, we set out to
                build a platform that is both powerful and easy to use. Our team
                comes from diverse backgrounds, and we’ve worked with companies
                of all sizes, from small startups to large enterprises. We’ve
                seen first-hand how difficult it can be to stay organized and on
                top of tasks in a busy environment, and that’s why we decided to
                create Taskify—a solution that helps you manage your tasks
                without the complexity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="container my-5">
        <h2 className="text-left mb-2">Our Mission</h2>
        <hr style={{ width: "40%", marginLeft: "0" }} />
        <p className="text-left mb-5">
          At Taskify, our mission is to revolutionize task management by
          providing a platform that adapts to your workflow, enhances
          collaboration, and simplifies task tracking. We strive to help
          individuals and teams achieve their goals, stay organized, and boost
          their productivity with ease.
        </p>
        <div
          id="missionCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {/* First Item */}
            <div className="carousel-item active">
              <div
                className="card p-3"
                style={{
                  height: "300px",
                  background: "linear-gradient(45deg, #8C4F30, #5B3A29)",
                }}
              >
                <h3 className="mb-3">Simplicity First</h3>
                <p>
                  Taskify is built around the principle of simplicity. We
                  believe that task management doesn’t need to be complicated.
                  Our platform is intuitive and easy to use, helping users focus
                  on what really matters—getting things done.
                </p>
              </div>
            </div>

            {/* Second Item */}
            <div className="carousel-item">
              <div
                className="card p-3"
                style={{
                  height: "300px",
                  background: "linear-gradient(45deg, #8C4F30, #5B3A29)",
                }}
              >
                <h3 className="mb-3">Collaboration at its Core</h3>
                <p>
                  Collaboration is key to success in any project. With Taskify,
                  you can collaborate in real-time with your team, assign tasks,
                  set deadlines, and track progress—all in one place.
                </p>
              </div>
            </div>

            {/* Third Item */}
            <div className="carousel-item">
              <div
                className="card p-3"
                style={{
                  height: "300px",
                  background: "linear-gradient(45deg, #8C4F30, #5B3A29)",
                }}
              >
                <h3 className="mb-3">Productivity Boost</h3>
                <p>
                  We believe that productivity is the key to success. By
                  organizing your tasks and projects, you’re able to focus on
                  the right priorities and increase your efficiency. Taskify
                  ensures that you stay on top of your tasks and never miss a
                  deadline.
                </p>
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#missionCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#missionCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Our Vision Section */}
      <div className="container my-5">
        <h2 className="text-left mb-2">Our Vision</h2>
        <hr style={{ width: "40%", marginLeft: "0" }} />
        <p className="text-left mb-5">
          We envision a world where task management is effortless, where teams
          can collaborate seamlessly, and where productivity isn’t hindered by
          clunky tools or complicated processes. Our goal is to continue
          evolving Taskify into the most reliable, user-friendly, and powerful
          task management platform for individuals and teams of all sizes.
        </p>
        <div
          id="visionCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {/* First Item */}
            <div className="carousel-item active">
              <div
                className="card p-3"
                style={{
                  height: "300px",
                  background: "linear-gradient(45deg, #8C4F30, #5B3A29)",
                }}
              >
                <h3 className="mb-3">Empowering Individuals</h3>
                <p>
                  We believe in empowering individuals to take control of their
                  work and achieve their goals. Taskify helps users stay
                  organized, prioritize their tasks, and accomplish more in less
                  time.
                </p>
              </div>
            </div>

            {/* Second Item */}
            <div className="carousel-item">
              <div
                className="card p-3"
                style={{
                  height: "300px",
                  background: "linear-gradient(45deg, #8C4F30, #5B3A29)",
                }}
              >
                <h3 className="mb-3">Transforming Team Collaboration</h3>
                <p>
                  We aim to transform the way teams collaborate on projects.
                  With Taskify, teams can work together efficiently, share
                  tasks, and keep everyone on the same page.
                </p>
              </div>
            </div>

            {/* Third Item */}
            <div className="carousel-item">
              <div
                className="card p-3"
                style={{
                  height: "300px",
                  background: "linear-gradient(45deg, #8C4F30, #5B3A29)",
                }}
              >
                <h3 className="mb-3">Leading the Future of Task Management</h3>
                <p>
                  Taskify is constantly evolving. We are committed to leading
                  the future of task management by introducing innovative
                  features and staying at the forefront of productivity
                  technology.
                </p>
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#visionCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#visionCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
