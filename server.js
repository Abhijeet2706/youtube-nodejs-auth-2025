require("dotenv").config();

const express = require("express");
const { connectToDB } = require("./db/db");
const authRoute = require("./routes/auth-routes");
const homeRoutes = require("./routes/home-routes");
const adminRoutes = require("./routes/admin-routes");
const uploadImageRoutes = require("./routes/image-routes")

const app = express();

const PORT = process.env.PORT || 3000;


//connect with db
connectToDB();


//use middleware
app.use(express.json())


//use router
app.use("/api/auth", authRoute);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", uploadImageRoutes)



app.listen(PORT, () => {
    console.log(`Server is listening on the port ${PORT}`)
})
