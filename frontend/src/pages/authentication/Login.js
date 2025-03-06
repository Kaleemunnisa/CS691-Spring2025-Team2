import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert, 
  CircularProgress, 
  InputAdornment,
  IconButton,
  Paper
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Validate inputs
    if (!credentials.email || !credentials.password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Attempting login with:", credentials.email);
      const res = await login(credentials);
      
      if (res.success) {
        navigate("/profile");
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <Paper elevation={3} className="auth-box">
        <Typography variant="h4" gutterBottom>
          Welcome Back
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3, maxWidth: "450px", mx: "auto" }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            label="Email Address"
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
          
          <TextField
            fullWidth
            variant="outlined"
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={credentials.password}
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
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ 
              bgcolor: '#4285F4',
              '&:hover': {
                bgcolor: '#3367D6',
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Log In"}
          </Button>
        </form>
        
        <Box className="auth-footer">
          <Typography variant="body2">
            Don't have an account? {" "}
            <a href="/signup" className="auth-link">
              Sign Up
            </a>
          </Typography>
        </Box>
        
        <div className="auth-divider">or</div>
        
        <Button
          fullWidth
          variant="outlined"
          sx={{ 
            maxWidth: "450px",
            mx: "auto",
            display: "block",
            borderColor: '#ddd', 
            color: '#444',
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              borderColor: '#aaa',
              bgcolor: '#f9f9f9'
            }
          }}
          onClick={() => navigate('/profile')}
        >
          Continue as Guest
        </Button>
      </Paper>
    </div>
  );
};

export default Login;