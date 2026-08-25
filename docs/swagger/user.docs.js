const userDocs = {
  openapi: '3.0.3',
  info: {
    title: 'E-Commerce API — User Panel (role = 0)',
    description:
      '**User panel** APIs for customers of the e-commerce platform.\n\n' +
      '**Panel access:** any authenticated user; primary audience is `role = 0` (customer). ' +
      'The role travels inside the JWT payload `{ u_id, email, role, phone }` issued at login.\n\n' +
      '**Response envelope:** every endpoint returns `{ status, description, data }` where `data` is an ' +
      '**AES encrypted** JSON string (CryptoJS AES, key: CRYPTOJSKEY). Decrypt it client-side to obtain the payload shown in the examples.\n\n' +
      '`status` codes inside the envelope: `1` success, `0` failure, `2` data error, `4` internal server error.',
    version: '1.0.0',
    contact: { name: 'Backend Team' },
  },
  servers: [
    { url: 'http://localhost:{port}', description: 'Local development', variables: { port: { default: '3000' } } },
    { url: 'https://api.example.com', description: 'Production (replace with real host)' },
  ],
  tags: [
    { name: 'Profile', description: 'Current user profile management' },
    { name: 'Addresses', description: 'Shipping / billing address book' },
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
        description: 'JWT access token issued by login',
      },
    },
    schemas: {
      UpdateProfileRequest: {
        type: 'object',
        properties: {
          first_name: { type: 'string', maxLength: 50, example: 'John' },
          last_name: { type: 'string', maxLength: 50, example: 'Doe' },
          alternate_phone: {
            type: 'string',
            maxLength: 20,
            nullable: true,
            pattern: '^(\\+|\\d)[0-9]{7,16}$',
            example: '+919812345670',
          },
          avatar_url: { type: 'string', maxLength: 500, example: '/files/assets/avatars/20260825_avatar.jpg' },
          gender: { type: 'integer', enum: [0, 1, 2], description: '0 = male, 1 = female, 2 = other', example: 0 },
          date_of_birth: { type: 'string', format: 'date', example: '1995-06-15' },
        },
      },
      CreateAddressRequest: {
        type: 'object',
        required: ['receiver_name', 'phone', 'address_line1', 'city', 'state', 'pincode'],
        properties: {
          address_type: { type: 'integer', enum: [0, 1, 2], description: '0 = home, 1 = work, 2 = other', default: 0, example: 0 },
          receiver_name: { type: 'string', maxLength: 100, example: 'John Doe' },
          phone: { type: 'string', maxLength: 20, pattern: '^(\\+|\\d)[0-9]{7,16}$', example: '+919876543210' },
          alternate_phone: { type: 'string', maxLength: 20, nullable: true, example: null },
          address_line1: { type: 'string', maxLength: 255, example: 'Flat 402, Sunrise Residency' },
          address_line2: { type: 'string', maxLength: 255, nullable: true, example: 'Near City Mall' },
          landmark: { type: 'string', maxLength: 255, nullable: true, example: 'Opposite HDFC ATM' },
          city: { type: 'string', maxLength: 100, example: 'Ahmedabad' },
          state: { type: 'string', maxLength: 100, example: 'Gujarat' },
          country: { type: 'string', maxLength: 100, default: 'India', example: 'India' },
          pincode: { type: 'string', maxLength: 20, example: '380001' },
          is_default: { type: 'integer', enum: [0, 1], default: 0, description: 'Setting 1 makes this the default address and unsets others', example: 1 },
        },
      },
      UpdateAddressRequest: {
        type: 'object',
        description: 'All fields optional; only provided fields are updated.',
        properties: {
          address_type: { type: 'integer', enum: [0, 1, 2], example: 1 },
          receiver_name: { type: 'string', maxLength: 100, example: 'John Doe' },
          phone: { type: 'string', maxLength: 20, example: '+919876543210' },
          alternate_phone: { type: 'string', maxLength: 20, nullable: true, example: null },
          address_line1: { type: 'string', maxLength: 255, example: 'Flat 402, Sunrise Residency' },
          address_line2: { type: 'string', maxLength: 255, nullable: true, example: null },
          landmark: { type: 'string', maxLength: 255, nullable: true, example: null },
          city: { type: 'string', maxLength: 100, example: 'Ahmedabad' },
          state: { type: 'string', maxLength: 100, example: 'Gujarat' },
          country: { type: 'string', maxLength: 100, example: 'India' },
          pincode: { type: 'string', maxLength: 20, example: '380001' },
        },
      },
      Address: {
        type: 'object',
        properties: {
          address_id: { type: 'integer', example: 4 },
          user_id: { type: 'integer', example: 12 },
          address_type: { type: 'integer', enum: [0, 1, 2], example: 0 },
          receiver_name: { type: 'string', example: 'John Doe' },
          phone: { type: 'string', example: '+919876543210' },
          alternate_phone: { type: 'string', nullable: true, example: null },
          address_line1: { type: 'string', example: 'Flat 402, Sunrise Residency' },
          address_line2: { type: 'string', nullable: true, example: null },
          landmark: { type: 'string', nullable: true, example: null },
          city: { type: 'string', example: 'Ahmedabad' },
          state: { type: 'string', example: 'Gujarat' },
          country: { type: 'string', example: 'India' },
          pincode: { type: 'string', example: '380001' },
          is_default: { type: 'integer', enum: [0, 1], example: 1 },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      EnvelopeSuccess: {
        type: 'object',
        properties: {
          status: { type: 'integer', enum: [1], example: 1 },
          description: { type: 'string', example: 'Data found successfully!' },
          data: {
            type: 'string',
            description: 'AES encrypted JSON string — decrypt with CryptoJS AES using CRYPTOJSKEY.',
            example: 'U2FsdGVkX1+... (encrypted)',
          },
        },
      },
      EnvelopeError: {
        type: 'object',
        properties: {
          status: { type: 'integer', enum: [0], example: 0 },
          description: { type: 'string', example: 'Data not found' },
          data: { type: 'string', nullable: true, example: null },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          status: { type: 'integer', enum: [0], example: 0 },
          description: { type: 'string', example: 'city must be a valid non-empty string' },
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
        description: 'Missing or invalid credentials',
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
  security: [{ cookieAuth: [] }, { bearerAuth: [] }],
  paths: {
    '/me': {
      get: {
        tags: ['Profile'],
        summary: 'Get current authenticated user with profile',
        description:
          'Returns the logged-in user along with their `userProfile` record after stripping sensitive fields ' +
          '(password_hash, tokens). *(Planned — not yet implemented)*',
        operationId: 'getCurrentUser',
        responses: {
          200: {
            description: 'User fetched successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                example: {
                  status: 1,
                  description: 'User found successfully!',
                  data: 'U2FsdGVkX1+... (decrypts to user + userProfile object)',
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
    '/profile': {
      put: {
        tags: ['Profile'],
        summary: 'Update current user profile',
        description:
          "Updates fields of the logged-in user's `user_profile` record. All fields are optional; only provided fields are updated. *(Planned — not yet implemented)*",
        operationId: 'updateProfile',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProfileRequest' } } },
        },
        responses: {
          200: {
            description: 'Profile updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                example: { status: 1, description: 'Profile updated successfully!', data: null },
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
    '/addresses': {
      get: {
        tags: ['Addresses'],
        summary: 'List my addresses',
        description: 'Returns all addresses of the logged-in user, default address first. *(Planned — not yet implemented)*',
        operationId: 'listAddresses',
        responses: {
          200: {
            description: 'Address list fetched successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                example: {
                  status: 1,
                  description: 'Addresses found successfully!',
                  data: 'U2FsdGVkX1+... (decrypts to Address[])',
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
      post: {
        tags: ['Addresses'],
        summary: 'Add a new address',
        description:
          'Creates a new address for the logged-in user. If `is_default = 1`, all other addresses of the user are unset as default. *(Planned — not yet implemented)*',
        operationId: 'createAddress',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateAddressRequest' } } },
        },
        responses: {
          200: {
            description: 'Address created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                example: { status: 1, description: 'Address added successfully!', data: 'U2FsdGVkX1+...' },
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
    '/addresses/{address_id}': {
      put: {
        tags: ['Addresses'],
        summary: 'Update one of my addresses',
        description:
          'Partially updates an address owned by the logged-in user. Returns failure if the address does not exist or belongs to another user. *(Planned — not yet implemented)*',
        operationId: 'updateAddress',
        parameters: [{ name: 'address_id', in: 'path', required: true, schema: { type: 'integer' }, example: 4 }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateAddressRequest' } } },
        },
        responses: {
          200: {
            description: 'Address updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                example: { status: 1, description: 'Address updated successfully!', data: null },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
      delete: {
        tags: ['Addresses'],
        summary: 'Delete one of my addresses',
        description: 'Deletes an address owned by the logged-in user. Ownership is enforced via `user_id`. *(Planned — not yet implemented)*',
        operationId: 'deleteAddress',
        parameters: [{ name: 'address_id', in: 'path', required: true, schema: { type: 'integer' }, example: 4 }],
        responses: {
          200: {
            description: 'Address deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                example: { status: 1, description: 'Address deleted successfully!', data: null },
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
    '/addresses/{address_id}/default': {
      patch: {
        tags: ['Addresses'],
        summary: 'Set an address as default',
        description: "Marks the given address as the user's default and unsets every other address. *(Planned — not yet implemented)*",
        operationId: 'setDefaultAddress',
        parameters: [{ name: 'address_id', in: 'path', required: true, schema: { type: 'integer' }, example: 4 }],
        responses: {
          200: {
            description: 'Default address updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnvelopeSuccess' },
                example: { status: 1, description: 'Default address set successfully!', data: null },
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
  },
};

module.exports = userDocs;
