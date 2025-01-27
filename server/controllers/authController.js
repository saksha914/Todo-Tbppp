const signup = (req, res) => {
   
    res.send('Signup successful!');
};

const login = (req, res) => {
   
    res.send('Login successful!');
};

const logout = (req, res) => {
  
    res.send('Logout successful!');
};

module.exports = { signup, login, logout };
