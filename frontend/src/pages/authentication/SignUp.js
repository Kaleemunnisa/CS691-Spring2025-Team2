import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; 
import { 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress, 
  InputAdornment,
  IconButton,
  MenuItem,
  Paper,
  Grid
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({
    name: "", 
    email: "", 
    password: "", 
    age: "", 
    gender: "", 
    height: "", 
    weight: "", 
    skinTone: ""
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("Submitting user data:", userData);
      
      // Make sure required fields are present
      if (!userData.name || !userData.email || !userData.password || !userData.age || !userData.gender) {
        setError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      
      const res = await register(userData);
      console.log("Registration result:", res);
      
      if (res.success) {
        console.log("Registration successful");
        navigate("/login");
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <Paper elevation={3} className="auth-box">
        <Typography variant="h4" gutterBottom>
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, maxWidth: "550px", mx: "auto" }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Full Name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Email Address"
                name="email"
                type="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={userData.password}
                onChange={handleChange}
                required
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
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
                value={userData.age}
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
                value={userData.gender}
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
                value={userData.height}
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
                value={userData.weight}
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
                value={userData.skinTone}
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

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{ 
                  bgcolor: '#4285F4',
                  '&:hover': {
                    bgcolor: '#3367D6',
                  },
                }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>

        <div className="auth-footer">
          <Typography variant="body2">
            Already have an account? {" "}
            <a href="/login" className="auth-link">
              Log In
            </a>
          </Typography>
        </div>
      </Paper>
    </div>
  );
};

export default SignUp;