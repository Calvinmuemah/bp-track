import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Settings = () => {
  const [settings, setSettings] = useState({
    name: "",
    bpTarget: "",
    notifications: true,
    darkMode: false,
    language: "English",
    unit: "mmHg",
    profilePicture: "",
  });

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch settings from backend
  useEffect(() => {
    axios
      .get("https://bp-track-tof5.vercel.app/api/settings/settings")
      .then((response) => setSettings(response.data))
      .catch((error) => console.error("Error fetching settings:", error));
  }, []);

  // Handle dark mode toggle
  useEffect(() => {
    document.body.classList.toggle("bg-dark", settings.darkMode);
    document.body.classList.toggle("text-white", settings.darkMode);
  }, [settings.darkMode]);

  // Handle profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Open file dialog when "Edit" is clicked
  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  // Save settings to backend
  const saveSettings = () => {
    setLoading(true);
    axios
      .post("https://bp-track-tof5.vercel.app/api/update/update", settings)
      .then(() => {
        alert("✅ Settings saved successfully!");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error saving settings:", error);
        setLoading(false);
      });
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-primary">Settings</h2>

        {/* Profile Picture (Top Right) */}
        <div className="d-flex align-items-center">
          {settings.profilePicture ? (
            <img
              src={settings.profilePicture}
              alt="Profile"
              className="rounded-circle border"
              width="50"
              height="50"
            />
          ) : (
            <div
              className="bg-light border rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 50, height: 50 }}
            >
              <span>No Image</span>
            </div>
          )}
          <button className="btn btn-sm btn-outline-primary ms-2" onClick={handleEditClick}>
            Edit
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <div className="row mt-3">
        {/* User Profile Settings */}
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header bg-primary text-white">User Profile</div>
            <div className="card-body">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control mb-2"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              />

              <label className="form-label">Blood Pressure Target</label>
              <input
                type="text"
                className="form-control"
                value={settings.bpTarget}
                onChange={(e) => setSettings({ ...settings, bpTarget: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header bg-primary text-white">Notifications</div>
            <div className="card-body">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={settings.notifications}
                  onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                />
                <label className="form-check-label">Enable Notifications</label>
              </div>
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header bg-primary text-white">App Preferences</div>
            <div className="card-body">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={settings.darkMode}
                  onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                />
                <label className="form-check-label">Enable Dark Mode</label>
              </div>

              <label className="form-label mt-2">Language</label>
              <select
                className="form-select"
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>

              <label className="form-label mt-2">Units</label>
              <select
                className="form-select"
                value={settings.unit}
                onChange={(e) => setSettings({ ...settings, unit: e.target.value })}
              >
                <option>mmHg</option>
                <option>kPa</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button with Loading Indicator */}
      <button className="btn btn-success" onClick={saveSettings} disabled={loading}>
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
};

export default Settings;