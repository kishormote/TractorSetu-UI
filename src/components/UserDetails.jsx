import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../services/Api";
import "../styles/pages/Profile.css";
import "../styles/components/Loader.css";
import { jwtDecode } from "jwt-decode";

const UserDetails = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    roleName: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    farmerDetails: {
      landOwned: 0,
      cropType: "",
      waterSource: "",
    },
    tractorOwnerDetails: {
      tractorCount: 0,
      tractorModels: "",
      rentalPricePerHour: 0,
      availabilityStatus: false,
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
        fetchUserProfile(decodedToken.id);
      } catch (error) {
        setError("Invalid token");
        setIsInitialLoading(false);
      }
    } else {
      setIsInitialLoading(false);
    }
  }, []);

  const fetchUserProfile = async (id) => {
    try {
      const data = await getUserProfile(id);
      setProfile(data);
    } catch (error) {
      setError("Failed to fetch profile");
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("farmerDetails.")) {
      const field = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        farmerDetails: {
          ...prev.farmerDetails,
          [field]: value,
        },
      }));
    } else if (name.includes("tractorOwnerDetails.")) {
      const field = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        tractorOwnerDetails: {
          ...prev.tractorOwnerDetails,
          [field]:
            field === "availabilityStatus"
              ? value === "true" // Convert string "true"/"false" to boolean
              : field === "tractorCount" || field === "rentalPricePerHour"
              ? Number(value) // Convert to number for numeric fields
              : value, // Keep as string for other fields
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("User ID not found");
      return;
    }

    try {
      setIsUpdating(true);
      await updateUserProfile(userId, profile);
      setSuccess("Profile updated successfully!");
      setError("");
    } catch (error) {
      setError("Failed to update profile");
      setSuccess("");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (error && !profile.username) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-grid">
            {/* Non-editable fields */}
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={profile.username}
                disabled
                className="disabled-input"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                disabled
                className="disabled-input"
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                name="roleName"
                value={profile.roleName}
                disabled
                className="disabled-input"
              />
            </div>

            {/* Editable fields */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Farmer specific fields */}
            {profile.roleName === "Farmer" && (
              <>
                <div className="form-group">
                  <label>Land Owned (in acres)</label>
                  <input
                    type="number"
                    name="farmerDetails.landOwned"
                    value={profile.farmerDetails?.landOwned}
                    onChange={handleInputChange}
                    required
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label>Crop Type</label>
                  <input
                    type="text"
                    name="farmerDetails.cropType"
                    value={profile.farmerDetails?.cropType}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Water Source</label>
                  <input
                    type="text"
                    name="farmerDetails.waterSource"
                    value={profile.farmerDetails?.waterSource}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}

            {/* Tractor Owner specific fields */}
            {profile.roleName === "Tractor Owner" && (
              <>
                <div className="form-group">
                  <label>Tractor Count</label>
                  <input
                    type="number"
                    name="tractorOwnerDetails.tractorCount"
                    value={profile.tractorOwnerDetails?.tractorCount}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tractor Models</label>
                  <input
                    type="text"
                    name="tractorOwnerDetails.tractorModels"
                    value={profile.tractorOwnerDetails?.tractorModels}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Rental Price (per hour)</label>
                  <input
                    type="number"
                    name="tractorOwnerDetails.rentalPricePerHour"
                    value={profile.tractorOwnerDetails?.rentalPricePerHour}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Availability Status</label>
                  <select
                    name="tractorOwnerDetails.availabilityStatus"
                    value={profile.tractorOwnerDetails?.availabilityStatus.toString()}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="button-group">
            <button type="submit" className="save-button" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetails;
