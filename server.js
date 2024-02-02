
import { PORT } from "./src/config/config.js";
import connectDB from "./src/database/conn.js"
import { app } from "./app.js";


connectDB()               //promise apse...
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at port : ${PORT} 🚀`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})