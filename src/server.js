require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/dbConfig');

const PORT = process.env.PORT;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
        console.error('Unable to connect to database');
        console.error(error);
    }
  }

startServer();