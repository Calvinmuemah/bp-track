import React from "react";

const Explore = () => {
  return (
    <section className="container my-5">
      <div className="text-center mb-4">
        <h2 className="text-primary">Explore BP Tracker</h2>
        <p className="lead">Discover how our system helps you monitor and improve your heart health.</p>
      </div>

      {/* Features Section */}
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow p-4 text-center">
            <h5 className="text-danger">📊 Real-Time Monitoring</h5>
            <p>Track your BP levels with IoT integration and instant updates.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow p-4 text-center">
            <h5 className="text-danger">🤖 AI Analysis</h5>
            <p>Get AI-powered insights and trends for better health decisions.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow p-4 text-center">
            <h5 className="text-danger">📅 History & Insights</h5>
            <p>Review past readings and see patterns over time.</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="row mt-5 align-items-center">
        <div className="col-md-6">
          <h3 className="text-primary">How It Works</h3>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">📝 Enter your blood pressure readings manually or via IoT devices.</li>
            <li className="list-group-item">📊 View real-time trends and personalized health insights.</li>
            <li className="list-group-item">⚠️ Get alerts if readings indicate potential health risks.</li>
            <li className="list-group-item">💡 Follow AI-generated recommendations for better BP management.</li>
          </ul>
        </div>
        <div className="col-md-6">
          <img 
            src="https://via.placeholder.com/500x300" 
            alt="How BP Tracking Works" 
            className="img-fluid rounded"
          />
        </div>
      </div>

      {/* Call-to-Action */}
      <div className="text-center mt-5">
        <a href="/form" className="btn btn-primary btn-lg">Start Tracking Now</a>
      </div>
    </section>
  );
};

export default Explore;
