const fs = require('fs');
const paths = require('path');
const { env } = require('process');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const { PORT } = require('./config');
const getDatabase = require('./database');
const { loadModels } = require('./models/index');

const authenticationRoutes = require('./modules/authentication/authentication.routes');

async function start() {
  const sequelize = await getDatabase();
  loadModels(sequelize);

  const app = express();

  app.use(express.json());
  app.use(cors({ origin: true }));
  app.use(fileUpload());
  app.use(express.static('files'));
  app.use(cookieParser());

  const folderPath = paths.join(__dirname, 'files');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    if (!fs.mkdirSync(folderPath)) {
      fs.mkdirSync(`${folderPath}/assets`);
    }
  }

  app.use(bodyParser.json({ limit: '1024mb' }));

  app.use(authenticationRoutes);

  app.use(
    bodyParser.urlencoded({
      limit: '2048mb',
      extended: false,
      parameterLimit: 102400000000000,
    })
  );

  app.use((req, res, next) => {
    next();
  });

  app.listen(PORT, function (error) {
    if (error) {
      console.log(`🚀 App Crashed ${error}`);
    } else {
      console.log('=================================');
      console.log(`========== ENV: ${env} ===========`);
      console.log(`🚀 App listening on the port ${PORT}`);
      console.log('=================================');
    }
  });
}

start();
