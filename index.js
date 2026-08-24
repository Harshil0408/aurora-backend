const fs = require('fs');
const paths = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const { PORT } = require('./config');
const sequelize = require('./database');

// sequelize Models Sync
sequelize.sync();

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

// Routes
const authenticationRoutes = require('./modules/authentication/authentication.routes');
const adminUserRoutes = require('./modules/admin/users/user.route');

app.use(authenticationRoutes, adminUserRoutes);

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
    console.log(`========== ENV: ${process.env.NODE_ENV || 'production'} ===========`);
    console.log(`🚀 App listening on the port ${PORT}`);
    console.log('=================================');
  }
});
