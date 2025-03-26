// function RegisterValidation(name = "", email = "", password = "", phoneNumber = "") {
//     let errors = {};
//     const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     const phoneRegex = /^\+2547\d{8}$/;
//     // const password_pattern = /^(?=.*\d)(?=.*[a-z])[a-zA-Z0-9]{8,}$/

//     // Validate Name
//     if (!name || name.trim().length < 3) {
//       errors.name = "Name must be at least 3 characters long";
//     } else {
//       errors.name = "";
//     }
  
//     // Validate Email
//     if (!email) {
//       errors.email = "Email is required";
//     } else if (!email_pattern.test(email)) {
//       errors.email = "Email address is invalid";
//     } else {
//       errors.email = "";
//     }
  
//     // Validate Password
//     if (!password || password.length < 8) {
//       errors.password = "Password must be at least 8 characters long";
//     } else {
//       errors.password = "";
//     }
  
//     // Validate Phone Number (optional)
//     if (phoneNumber && !phoneRegex.test(phoneNumber)) {
//       errors.phoneNumber = "Phone number must be 10 digits long";
//     } else {
//       errors.phoneNumber = "";
//     }
  
//     return errors;
//   }
  
//   export default RegisterValidation

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