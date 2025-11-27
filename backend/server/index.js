const express = require('express');
const cors = require('cors');
const UserRoute = require('./routes/UserRoute'); // Import Route

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Gunakan Route
// Prefix '/api' agar semua URL menjadi: localhost:5000/api/register dll.
app.use('/api', UserRoute); 

app.listen(PORT, () => {
    console.log(`SERVER RUNNING on PORT ${PORT}`);
});