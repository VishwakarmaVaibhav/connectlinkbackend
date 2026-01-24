
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const isValidPassword = (password) => {
    // Min 6 chars check
    return password && password.length >= 6;
};

export const validateSignupData = (data) => {
    const { name, username, email, password } = data;
    const errors = [];

    if (!name || name.trim().length === 0) errors.push("Name is required");
    if (!username || username.trim().length === 0) errors.push("Username is required");
    if (!email || !isValidEmail(email)) errors.push("Invalid email format");
    if (!isValidPassword(password)) errors.push("Password must be at least 6 characters long");

    return {
        isValid: errors.length === 0,
        errors
    };
};
