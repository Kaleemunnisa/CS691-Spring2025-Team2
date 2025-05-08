import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  MenuItem, 
  Paper,
  Grid,
  Avatar,
  Divider,
  Alert,
  CircularProgress
} from "@mui/material";
import { Person, Edit, Save, Cancel } from "@mui/icons-material";
import axios from "axios";


const Profile = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({
    name: user?.name || "",
    age: user?.age || "",
    gender: user?.gender || "",
    height: user?.height || "",
    weight: user?.weight || "",
    skinTone: user?.skinTone || ""
  });

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await axios.put(
        "http://localhost:8000/api/auth/profile", 
        updatedUser, 
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          },
          withCredentials: true 
        }
      );
      
      setUser(res.data);
      setSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Update failed:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setUpdatedUser({
      name: user?.name || "",
      age: user?.age || "",
      gender: user?.gender || "",
      height: user?.height || "",
      weight: user?.weight || "",
      skinTone: user?.skinTone || ""
    });
    setEditMode(false);
    setError(null);
    setSuccess(null);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="profile-container">
      <Paper elevation={3} className="profile-box">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} />
            ) : (
              <Typography variant="h3">{getInitials(user?.name)}</Typography>
            )}
          </div>
          <Typography variant="h5" className="profile-title">
            {editMode ? "Edit Profile" : "My Profile"}
          </Typography>
        </div>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        
        {editMode ? (
          <div className="profile-form">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Full Name"
                  name="name"
                  value={updatedUser.name}
                  onChange={handleChange}
                  required
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Age"
                  name="age"
                  type="number"
                  value={updatedUser.age}
                  onChange={handleChange}
                  required
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  label="Gender"
                  name="gender"
                  value={updatedUser.gender}
                  onChange={handleChange}
                  required
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={updatedUser.height}
                  onChange={handleChange}
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={updatedUser.weight}
                  onChange={handleChange}
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  label="Skin Tone"
                  name="skinTone"
                  value={updatedUser.skinTone}
                  onChange={handleChange}
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                >
                  <MenuItem value="Fair">Fair</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Dark">Dark</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            
            <div className="profile-actions">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                startIcon={<Cancel />}
                sx={{ 
                  borderRadius: 2,
                  borderColor: '#ff5252',
                  color: '#ff5252',
                  '&:hover': {
                    borderColor: '#ff1744',
                    backgroundColor: 'rgba(255, 23, 68, 0.04)'
                  }
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                sx={{ 
                  borderRadius: 2,
                  bgcolor: '#4285F4',
                  '&:hover': {
                    bgcolor: '#3367D6',
                  }
                }}
                disabled={isSubmitting}
              >
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <Box>
            <div className="profile-detail">
              <Typography className="profile-label">Name:</Typography>
              <Typography className="profile-value">{user?.name || "Not set"}</Typography>
            </div>
            
            <div className="profile-detail">
              <Typography className="profile-label">Age:</Typography>
              <Typography className="profile-value">{user?.age || "Not set"}</Typography>
            </div>
            
            <div className="profile-detail">
              <Typography className="profile-label">Gender:</Typography>
              <Typography className="profile-value">{user?.gender || "Not set"}</Typography>
            </div>
            
            <div className="profile-detail">
              <Typography className="profile-label">Height:</Typography>
              <Typography className="profile-value">
                {user?.height ? `${user.height} cm` : "Not set"}
              </Typography>
            </div>
            
            <div className="profile-detail">
              <Typography className="profile-label">Weight:</Typography>
              <Typography className="profile-value">
                {user?.weight ? `${user.weight} kg` : "Not set"}
              </Typography>
            </div>
            
            <div className="profile-detail">
              <Typography className="profile-label">Skin Tone:</Typography>
              <Typography className="profile-value">{user?.skinTone || "Not set"}</Typography>
            </div>
            
            <div className="profile-actions">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditMode(true)}
                startIcon={<Edit />}
                sx={{ 
                  borderRadius: 2,
                  bgcolor: '#4285F4',
                  '&:hover': {
                    bgcolor: '#3367D6',
                  }
                }}
              >
                Edit Profile
              </Button>
              
              <Button
                variant="outlined"
                color="secondary"
                onClick={logout}
                sx={{ 
                  borderRadius: 2,
                  borderColor: '#ff5252',
                  color: '#ff5252',
                  '&:hover': {
                    borderColor: '#ff1744',
                    backgroundColor: 'rgba(255, 23, 68, 0.04)'
                  }
                }}
              >
                Logout
              </Button>
            </div>
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default Profile;