import React from "react";
// import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <div
        className="bg-dark text-white text-center py-5"
        style={{
          background: "linear-gradient(45deg, #8C4F30, #5B3A29)",
          marginTop: "55px",
        }}
      >
        <h1 className="display-4">
          Taskify: Streamline Your Tasks and Boost Productivity
        </h1>
        <p className="lead">
          Organize, prioritize, and track all your tasks with ease. Collaborate
          in real-time and stay ahead of your deadlines.
        </p>
        <div className="d-flex justify-content-center mt-4">
          <input
            type="email"
            className="form-control w-50 me-2"
            placeholder="Enter your email"
          />
          <button className="btn btn-signup">Join Now - It’s Free!</button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">
          Boost Your Productivity with Taskify
        </h2>
        <p className="text-center mb-5">
          Simple, intuitive, and powerful. Organize your tasks into boards,
          manage projects with lists, and track everything with cards.
        </p>
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm card-feature">
              <div className="card-body">
                <h3 className="card-title">Boards</h3>
                <p className="card-text">
                  Organize your projects by boards. Visualize your work and
                  track all tasks, from start to finish, in one place.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm card-feature">
              <div className="card-body">
                <h3 className="card-title">Lists</h3>
                <p className="card-text">
                  Divide your tasks into stages with customizable lists. Stay
                  organized by tracking every step of your workflow.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm card-feature">
              <div className="card-body">
                <h3 className="card-title">Cards</h3>
                <p className="card-text">
                  Cards are your tasks in action. Attach due dates, add
                  descriptions, assign members, and track progress as you go.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4">
            Take Your Team Collaboration to the Next Level
          </h2>
          <p className="text-center mb-5">
            Taskify makes team collaboration seamless. Share boards, assign
            tasks, and keep everyone on track with real-time updates.
          </p>
          <div className="row text-center">
            <div className="col-md-6 mb-4">
              <div className="card h-100 shadow-sm card-feature">
                <div className="card-body">
                  <h3 className="card-title">Real-time Collaboration</h3>
                  <p className="card-text">
                    Work together in real-time! See your team’s updates live as
                    tasks move and progress in sync.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100 shadow-sm card-feature">
                <div className="card-body">
                  <h3 className="card-title">Task Deadlines</h3>
                  <p className="card-text">
                    Never miss a deadline again. Set deadlines for tasks and
                    receive timely reminders so nothing slips through the
                    cracks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Taskify Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Why Choose Taskify?</h2>
        <p className="text-center mb-5">
          Taskify is designed for simplicity and ease of use while providing
          powerful tools to help you manage all your tasks effortlessly.
        </p>
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm card-feature">
              <div className="card-body">
                <h3 className="card-title">Simple Interface</h3>
                <p className="card-text">
                  Taskify offers an intuitive, user-friendly interface that
                  allows you to organize and track tasks effortlessly.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm card-feature">
              <div className="card-body">
                <h3 className="card-title">Flexible Workflow</h3>
                <p className="card-text">
                  Customize your task workflows according to your needs. Whether
                  it's personal projects or team collaborations, Taskify adapts
                  to you.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm card-feature">
              <div className="card-body">
                <h3 className="card-title">Team Management</h3>
                <p className="card-text">
                  Assign tasks to team members, track their progress, and
                  collaborate effectively, no matter where your team is located.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p>© 2024 Taskify. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
