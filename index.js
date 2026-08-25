const fs = require('fs');
const paths = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const { PORT } = require('./config');
const sequelize = require('./database');

// sequelize Models Sync
sequelize
  .sync()
  .then(() => console.log('Database synced'))
  .catch((error) => console.log(`Database sync failed: ${error.message}`));

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

// Swagger docs — panel based
const authDocs = require('./docs/swagger/auth.docs');
const userDocs = require('./docs/swagger/user.docs');

const apiPanels = [
  { name: 'Authentication', slug: 'auth', docs: authDocs, access: 'All panels (user, seller, admin)' },
  { name: 'User', slug: 'user', docs: userDocs, access: 'role = 0 (customer)' },
];

app.use('/api-docs', swaggerUi.serve);

apiPanels.forEach((panel) => {
  app.get(`/api-docs/${panel.slug}.json`, (req, res) => res.json(panel.docs));
  app.get(`/api-docs/${panel.slug}`, (req, res) => {
    res.send(`<!DOCTYPE html><html><head><title>${panel.name} Panel API Docs</title>
    <link rel="stylesheet" href="/api-docs/swagger-ui.css"></head><body>
    <div id="swagger-ui"></div>
    <script src="/api-docs/swagger-ui-bundle.js"></script>
    <script src="/api-docs/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = function () {
        window.ui = SwaggerUIBundle({
          url: '/api-docs/${panel.slug}.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          plugins: [SwaggerUIBundle.plugins.DownloadUrl],
          layout: 'StandaloneLayout'
        });
      };
    </script></body></html>`);
  });
});

app.use('/api-docs', (req, res) => {
  const links = apiPanels
    .map(
      (panel) =>
        `<a class="card" href="/api-docs/${panel.slug}"><h2>${panel.name} Panel</h2><p>${panel.docs.info.title}</p><span class="access">${panel.access}</span></a>`
    )
    .join('');
  res.send(`<!DOCTYPE html><html><head><title>API Documentation</title>
  <style>
    body{font-family:system-ui,sans-serif;background:#fafafa;max-width:900px;margin:40px auto;padding:0 16px}
    h1{color:#3b4151}.grid{display:flex;gap:16px;flex-wrap:wrap}
    .card{display:block;background:#fff;border:1px solid #e2e2e2;border-radius:8px;padding:20px;width:260px;
      text-decoration:none;color:#3b4151;transition:box-shadow .15s}
    .card:hover{box-shadow:0 4px 14px rgba(0,0,0,.12)}
    .access{display:inline-block;margin-top:10px;font-size:12px;background:#eef;padding:4px 8px;border-radius:4px}
    .soon{opacity:.55}
  </style></head><body>
  <h1>E-Commerce API Documentation</h1>
  <div class="grid">${links}
    <div class="card soon"><h2>Seller Panel</h2><p>role = 1 &mdash; coming soon</p></div>
    <div class="card soon"><h2>Admin Panel</h2><p>role = 2 &mdash; coming soon</p></div>
  </div></body></html>`);
});

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
