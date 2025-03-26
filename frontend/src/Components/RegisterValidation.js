const RegisterValidation = (username, email, password, phone_number, location) => {
    let errors = {};
    
    if (!username.trim()) errors.username = "Username is required";
    if (!email.includes("@")) errors.email = "Enter a valid email";
    if (password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!phone_number.match(/^\d{10}$/)) errors.phone_number = "Enter a valid 10-digit phone number";
    // if (!location) errors.location = "Location is required";
    
    return errors;
  };
  
  export default RegisterValidation