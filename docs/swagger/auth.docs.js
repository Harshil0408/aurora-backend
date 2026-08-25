const authDocs = {
  openapi: '3.0.3',
  info: {
    title: 'Aurora E-commerce Platform — Authentication (all panels)',
    description:
      'Authentication APIs shared by **all three panels** of the platform.\n\n' +
      '## Panel access model\n' +
      '| Panel | Role | How it gets an account | Endpoints used |\n' +
      '|---|---|---|---|\n' +
      '| **User** | `role = 0` | Self-service via `POST /register` | register, login, logout, refresh-token, forgot/reset/change password, verify-email, me |\n' +
      '| **Seller** | `role = 1` | Self-service via `POST /seller/register` (creates account + store application; role becomes 1 on admin approval). Alternatively a registered user can apply from the Seller panel. | login, logout, refresh-token, forgot/reset/change password, verify-email, me |\n' +
      '| **Admin** | `role = 2` | Provisioned internally by a super_admin (no public registration) | login, logout, refresh-token, change password, me |\n\n' +
      'The JWT issued at login carries `{ u_id, email, role, phone }`. Each panel frontend reads `role` after login ' +
      'and routes to its own dashboard; backend middleware must enforce the expected role on every protected endpoint of that panel.\n\n' +
      '**Response envelope:** every endpoint returns `{ status, description, data }` where `data` is an ' +
      '**AES encrypted** JSON string (CryptoJS AES, key: CRYPTOJSKEY). Decrypt it client-side to obtain the payload shown in the examples below.\n\n' +
      '`status` codes inside the envelope: `1` success, `0` failure, `2` data error, `4` internal server error.\n\n' +
      '**Auth mechanisms:** on login a JWT is issued and also set as an httpOnly cookie `accessToken`. ' +
      'Protected endpoints accept either the `accessToken` cookie or an `Authorization: Bearer <token>` header.',
    version: '1.0.0',
    contact: { name: 'Backend Team' },
  },
  servers: [
    { url: 'http://localhost:{port}', description: 'Local development', variables: { port: { default: '3000' } } },
    { url: 'https://api.example.com', description: 'Production (replace with real host)' },
  ],
  tags: [
    { name: 'Auth', description: 'Core authentication endpoints (all panels)' },
    { name: 'Password', description: 'Password management endpoints' },
    { name: 'Email verification', description: 'Email verification endpoints' },
    { name: 'User session', description: 'Current-user session endpoints' },
    {
      name: 'Panel: User',
      description: 'Endpoints consumed by the User panel frontend (role = 0)',
    },
    {
      name: 'Panel: Seller',
      description: 'Endpoints consumed by the Seller panel frontend (role = 1)',
    },
    {
      name: 'Panel: Admin',
      description: 'Endpoints consumed by the Admin panel frontend (role = 2)',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
        description: 'httpOnly JWT cookie set by login / refresh-token',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token issued by login / refresh-token',
      },
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['first_name', 'last_name', 'phone', 'email', 'password'],
        properties: {
          first_name: { type: 'string', maxLength: 50, example: 'John' },
          last_name: { type: 'string', maxLength: 50, example: 'Doe' },
          phone: {
            type: 'string',
            maxLength: 20,
            pattern: '^(\\+|\\d)[0-9]{7,16}$',
            description: 'Must be globally unique across users',
            example: '+919876543210',
          },
          email: { type: 'string', format: 'email', maxLength: 50, example: 'john.doe@example.com' },
          password: { type: 'string', format: 'password', minLength: 6, example: 'Str0ng@Pass' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          password: { type: 'string', format: 'password', example: 'Str0ng@Pass' },
        },
      },
      SellerRegisterRequest: {
        type: 'object',
        description: 'Creates the seller login account and the store application in one step.',
        required: ['first_name', 'last_name', 'phone', 'email', 'password', 'store_name'],
        properties: {
          first_name: { type: 'string', maxLength: 50, example: 'Jane' },
          last_name: { type: 'string', maxLength: 50, example: 'Smith' },
          phone: {
            type: 'string',
            maxLength: 20,
            pattern: '^(\\+|\\d)[0-9]{7,16}$',
            description: 'Login account phone, must be globally unique',
            example: '+919876543211',
          },
          email: { type: 'string', format: 'email', maxLength: 50, example: 'jane@example.com' },
          password: { type: 'string', format: 'password', minLength: 6, example: 'Str0ng@Pass' },
          store_name: { type: 'string', maxLength: 200, example: "Jane's Electronics" },
          business_email: {
            type: 'string',
            format: 'email',
            maxLength: 50,
            description: 'Defaults to `email` when omitted; must be unique across sellers',
            example: 'business@janeselectronics.com',
          },
          business_phone: { type: 'string', maxLength: 20, nullable: true, example: '+919812345671' },
          gst_number: { type: 'string', maxLength: 50, nullable: true, example: '24ABCDE1234F1Z5' },
          pan_number: { type: 'string', maxLength: 50, nullable: true, example: 'ABCDE1234F' },
          bank_name: { type: 'string', maxLength: 200, nullable: true, example: 'HDFC Bank' },
          bank_account_holder_name: { type: 'string', maxLength: 200, nullable: true, example: 'Jane Smith' },
          bank_account_number: { type: 'string', maxLength: 50, nullable: true, example: '50100234567890' },
          bank_ifsc_code: { type: 'string', maxLength: 20, nullable: true, example: 'HDFC0001234' },
          address_line1: { type: 'string', maxLength: 255, nullable: true, example: 'Shop 12, Business Hub' },
          city: { type: 'string', maxLength: 100, nullable: true, example: 'Ahmedabad' },
          state: { type: 'string', maxLength: 100, nullable: true, example: 'Gujarat' },
          country: { type: 'string', maxLength: 100, nullable: true, example: 'India' },
          pincode: { type: 'string', maxLength: 20, nullable: true, example: '380001' },
        },
      },
      RefreshTokenRequest: {
        type: 'object',
        properties: {
          refresh_token: {
            type: 'string',
            description: 'Refresh token issued at login. Optional if sent via refreshToken httpOnly cookie.',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
      ForgotPasswordRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
        },
      },
      ResetPasswordRequest: {
        type: 'object',
        required: ['reset_token', 'new_password'],
        properties: {
          reset_token: {
            type: 'string',
            description: 'Token received via the forgot-password email link',
            example: 'a1b2c3d4e5f6...',
          },
          new_password: { type: 'string', format: 'password', minLength: 6, example: 'N3wStr0ng@Pass' },
        },
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['current_password', 'new_password'],
        properties: {
          current_password: { type: 'string', format: 'password', example: 'Str0ng@Pass' },
          new_password: { type: 'string', format: 'password', minLength: 6, example: 'N3wStr0ng@Pass' },
        },
      },
      UserProfile: {
        type: 'object',
        properties: {
          u_id: { type: 'integer', example: 12 },
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          role: {
            type: 'integer',
            enum: [0, 1, 2],
            description: 'Panel the account belongs to: 0 = User, 1 = Seller, 2 = Admin',
            example: 0,
          },
          is_active: { type: 'integer', enum: [0, 1], example: 1 },
          is_verified: { type: 'integer', enum: [0, 1], example: 1 },
          last_login_at: { type: 'string', format: 'date-time', example: '2026-08-25T10:15:00.000Z' },
          userProfile: {
            type: 'object',
            properties: {
              user_id: { type: 'integer', example: 12 },
              first_name: { type: 'string', example: 'John' },
              last_name: { type: 'string', example: 'Doe' },
              phone: { type: 'string', example: '+919876543210' },
              alternate_phone: { type: 'string', nullable: true, example: null },
              avatar_url: { type: 'string', nullable: true, example: null },
              gender: { type: 'integer', nullable: true, enum: [0, 1, 2], example: 0 },
              date_of_birth: { type: 'string', format: 'date', nullable: true, example: '1995-06-15' },
            },
          },
        },
      },
      EnvelopeSuccess: {
        type: 'object',
        properties: {
          status: { type: 'integer', enum: [1], example: 1 },
          description: { type: 'string', example: 'Login successful!' },
          data: {
            type: 'string',
            description: 'AES encrypted JSON string. Decrypt with CryptoJS.AES using CRYPTOJSKEY to obtain the payload documented per endpoint.',
            example: 'U2FsdGVkX1+YJ... (encrypted)',
          },
        },
      },
      EnvelopeError: {
        type: 'object',
        properties: {
          status: { type: 'integer', enum: [0], example: 0 },
          description: { type: 'string', example: 'Invalid email or password' },
          data: { type: 'string', nullable: true, description: 'AES encrypted JSON or null', example: null },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          status: { type: 'integer', enum: [0], example: 0 },
          description: { type: 'string', example: 'email must be a valid email address' },
          data: { nullable: true },
        },
      },
      InternalError: {
        type: 'object',
        properties: {
          status: { type: 'integer', enum: [0], example: 0 },
          description: { type: 'string', example: 'Internal server error' },
        },
      },
    },
    responses: {
      BadRequest: {
        description: 'Validation failed / bad request',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } },
      },
      Unauthorized: {
        description: 'Invalid credentials or missing/invalid token',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/EnvelopeError' } } },
      },
      Forbidden: {
        description: 'Token invalid/expired or account blocked',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: { type: 'integer', enum: [0], example: 0 },
                description: { type: 'string', example: 'Unauthorized token' },
              },
            },
          },
        },
      },
      ServerError: {
        description: 'Internal server error',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/InternalError' } } },
      },
    },
  },
  paths: {
    '/register': {
      post: {
        tags: ['Auth', 'Panel: User'],
        summary: 'Register a new customer account',
        description:
          '**Panels:** User (self-registration entry point).\n\n' +
          'Creates a `users` record with `role = 0` (customer) plus a linked `user_profile` record. ' +
          'Email and phone must be unique. Sellers should use `POST /seller/register` instead — it creates the account ' +
          'and the store application in one step. Admin accounts are never created through this endpoint (provisioned internally by a super_admin).',
        operationId: 'registerUser',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
        },
        responses: {
          200: {
            description: 'User registered successfully (or already-exists failure)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                examples: {
                  success: {
                    value: {
                      status: 1,
                      description: 'User registered successfully!',
                      data: 'U2FsdGVkX1+... (decrypts to user object)',
                    },
                  },
                  duplicate: {
                    value: { status: 0, description: 'User already exists', data: null },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/seller/register': {
      post: {
        tags: ['Auth', 'Panel: Seller'],
        summary: 'Register a new seller account (store application)',
        description:
          '**Panels:** Seller (self-registration entry point).\n\n' +
          'Creates the seller login account (`users`, `role = 0` until approved) plus a `seller_users` store record with ' +
          '`status = 0` (pending). A unique `store_slug` is generated from `store_name`. ' +
          'An admin then reviews the application via the Admin panel — on approval `status` becomes `1` and `role` is promoted to `1`, ' +
          'unlocking the Seller panel. Rejection/suspension keeps the account unable to sell. ' +
          'The new seller can immediately log in with `POST /login` but panel middleware must reject non-approved sellers. *(Planned — not yet implemented)*',
        operationId: 'registerSeller',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/SellerRegisterRequest' } } },
        },
        responses: {
          200: {
            description: 'Seller application result',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                examples: {
                  success: {
                    value: {
                      status: 1,
                      description: 'Seller registered successfully! Your store is pending admin approval.',
                      data: 'U2FsdGVkX1+... (decrypts to { user, seller } object, seller.status = 0)',
                    },
                  },
                  duplicateEmail: {
                    value: { status: 0, description: 'User already exists', data: null },
                  },
                  slugTaken: {
                    value: { status: 0, description: 'Store name already in use', data: null },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/login': {
      post: {
        tags: ['Auth', 'Panel: User', 'Panel: Seller', 'Panel: Admin'],
        summary: 'Log in with email and password (all panels)',
        description:
          '**Panels:** User · Seller · Admin.\n\n' +
          'Validates credentials and issues a signed JWT containing `{ u_id, email, role, phone }`. ' +
          'The token is persisted on the user row, stored in the encrypted response `data`, **and** set as an httpOnly cookie ' +
          '`accessToken` (7 day expiry). Also updates `last_login_at`. ' +
          'Each panel frontend reads `role` from the decrypted payload to route to the correct dashboard ' +
          '(0 = User, 1 = Seller, 2 = Admin); backend middleware must re-enforce the role on protected endpoints.',
        operationId: 'loginUser',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
              examples: { request: { value: { email: 'john.doe@example.com', password: 'Str0ng@Pass' } } },
            },
          },
        },
        responses: {
          200: {
            description: 'Login result (sets accessToken cookie on success)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                examples: {
                  customerLogin: {
                    summary: 'User panel login (role = 0)',
                    value: {
                      status: 1,
                      description: 'Login successful!',
                      data: 'U2FsdGVkX1+... (decrypts to { u_id, email, role: 0, phone, token })',
                    },
                  },
                  sellerLogin: {
                    summary: 'Seller panel login (role = 1)',
                    value: {
                      status: 1,
                      description: 'Login successful!',
                      data: 'U2FsdGVkX1+... (decrypts to { u_id, email, role: 1, phone, token })',
                    },
                  },
                  adminLogin: {
                    summary: 'Admin panel login (role = 2)',
                    value: {
                      status: 1,
                      description: 'Login successful!',
                      data: 'U2FsdGVkX1+... (decrypts to { u_id, email, role: 2, phone, token })',
                    },
                  },
                  invalidCredentials: {
                    value: { status: 0, description: 'Invalid email or password', data: null },
                  },
                },
              },
            },
            headers: {
              'Set-Cookie': {
                description: 'accessToken={jwt}; HttpOnly; SameSite=Strict; Max-Age=604800; Secure (in production)',
                schema: { type: 'string' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/logout': {
      post: {
        tags: ['Auth', 'Panel: User', 'Panel: Seller', 'Panel: Admin'],
        summary: 'Log out the current user',
        description:
          '**Panels:** User · Seller · Admin.\n\n' +
          'Invalidates the stored auth/refresh tokens for the logged-in user and clears the `accessToken` cookie. *(Planned — not yet implemented)*',
        operationId: 'logoutUser',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          200: {
            description: 'Logged out successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                example: { status: 1, description: 'Logged out successfully!', data: null },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/refresh-token': {
      post: {
        tags: ['Auth', 'Panel: User', 'Panel: Seller', 'Panel: Admin'],
        summary: 'Refresh the access token',
        description:
          '**Panels:** User · Seller · Admin.\n\n' +
          'Exchanges a valid refresh token (body field or `refreshToken` httpOnly cookie) for a new access JWT (same `role`) and sets a fresh `accessToken` cookie. *(Planned — not yet implemented)*',
        operationId: 'refreshToken',
        requestBody: {
          required: false,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshTokenRequest' } } },
        },
        responses: {
          200: {
            description: 'New access token issued (sets new accessToken cookie)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                example: { status: 1, description: 'Token refreshed successfully!', data: 'U2FsdGVkX1+...' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/forgot-password': {
      post: {
        tags: ['Password', 'Panel: User', 'Panel: Seller', 'Panel: Admin'],
        summary: 'Request a password reset link',
        description:
          '**Panels:** User · Seller · Admin.\n\n' +
          'Generates a single-use `password_reset_token` (valid ~30 min) for the given email and emails a reset link ' +
          'of the form `{frontend_url}/reset-password?token={token}`. Always returns success to avoid account enumeration. *(Planned — not yet implemented)*',
        operationId: 'forgotPassword',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ForgotPasswordRequest' } } },
        },
        responses: {
          200: {
            description: 'Reset link dispatched (if the account exists)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                example: { status: 1, description: 'If the email exists, a reset link has been sent', data: null },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/reset-password': {
      post: {
        tags: ['Password', 'Panel: User', 'Panel: Seller', 'Panel: Admin'],
        summary: 'Reset password using a token',
        description:
          '**Panels:** User · Seller · Admin.\n\n' +
          'Consumes a valid, non-expired `password_reset_token`, stores the new bcrypt-hashed password and invalidates all active sessions/tokens. *(Planned — not yet implemented)*',
        operationId: 'resetPassword',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ResetPasswordRequest' } } },
        },
        responses: {
          200: {
            description: 'Password reset successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                example: { status: 1, description: 'Password reset successfully!', data: null },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: {
            description: 'Reset token invalid or expired',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/EnvelopeError' } } },
          },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/change-password': {
      post: {
        tags: ['Password', 'Panel: User', 'Panel: Seller', 'Panel: Admin'],
        summary: 'Change password while logged in',
        description:
          '**Panels:** User · Seller · Admin.\n\n' +
          'Requires an authenticated user of any panel. Verifies `current_password`, then updates to the new bcrypt-hashed password. *(Planned — not yet implemented)*',
        operationId: 'changePassword',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordRequest' } } },
        },
        responses: {
          200: {
            description: 'Password changed successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                example: { status: 1, description: 'Password changed successfully!', data: null },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/verify-email': {
      get: {
        tags: ['Email verification', 'Panel: User', 'Panel: Seller'],
        summary: 'Verify a user email address',
        description:
          '**Panels:** User · Seller (admin emails are pre-verified at provisioning).\n\n' +
          'Consumes the `email_verification_token` issued at registration, marks the account verified ' +
          '(`is_verified = 1`, sets `email_verified_at`) and invalidates the token. *(Planned — not yet implemented)*',
        operationId: 'verifyEmail',
        parameters: [
          {
            name: 'token',
            in: 'query',
            required: true,
            description: 'Email verification token from the verification email link',
            schema: { type: 'string' },
            example: 'a1b2c3d4e5f6...',
          },
        ],
        responses: {
          200: {
            description: 'Email verified successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                example: { status: 1, description: 'Email verified successfully!', data: null },
              },
            },
          },
          400: {
            description: 'Verification token missing, invalid or expired',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/EnvelopeError' } } },
          },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/me': {
      get: {
        tags: ['User session', 'Panel: User', 'Panel: Seller', 'Panel: Admin'],
        summary: 'Get current authenticated user',
        description:
          '**Panels:** User · Seller · Admin.\n\n' +
          'Returns the authenticated user of any panel along with their profile (`userProfile` include) after deleting sensitive fields; the `role` field tells the panel frontend which dashboard is active. *(Planned — not yet implemented)*',
        operationId: 'getCurrentUser',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          200: {
            description: 'Authenticated user fetched successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                example: {
                  status: 1,
                  description: 'User found successfully!',
                  data: 'U2FsdGVkX1+... (decrypts to UserProfile object)',
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
  },
};

module.exports = authDocs;
