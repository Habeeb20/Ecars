// config/swagger.js
// npm i swagger-jsdoc swagger-ui-express
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Ecars API',
      version: '1.0.0',
      description: 'API documentation for the Ecars marketplace.',
    },
    servers: [{ url: '/', description: 'Current server' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        // Agent endpoints respond with { status: true | false }
        AgentError: {
          type: 'object',
          properties: {
            status: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Server error' },
          },
        },
        PageMeta: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 42 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 15 },
            totalPages: { type: 'integer', example: 3 },
          },
        },
        // Appointment endpoints respond with { status: 'success' | 'fail' | 'error' }
        AppointmentError: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['fail', 'error'], example: 'fail' },
            message: { type: 'string', example: 'Appointment not found' },
          },
        },
        Appointment: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65f1c2a9e4b0a1b2c3d4e5f6' },
            car: { type: 'object', description: 'Populated: title, price, images, make, model, year, location, status, phoneNumber' },
            owner: { type: 'object', description: 'Populated: firstName, lastName, avatar, slug, business names' },
            client: { type: 'object', description: 'Populated: firstName, lastName, email, avatar' },
            scheduledAt: { type: 'string', format: 'date-time' },
            phoneNumber: { type: 'string', example: '08012345678' },
            note: { type: 'string' },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'declined', 'cancelled', 'completed', 'no-show'],
            },
            statusReason: { type: 'string', maxLength: 300 },
            cancelledBy: { type: 'string' },
            respondedAt: { type: 'string', format: 'date-time' },
          },
        },
        BankDetails: {
          type: 'object',
          properties: {
            bankName: { type: 'string', example: 'GTBank' },
            accountNumber: { type: 'string', example: '0123456789' },
            accountName: { type: 'string', example: 'Ada Obi' },
          },
        },
        AgentPayout: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            agent: { type: 'string' },
            amount: { type: 'number', example: 25000 },
            earningsCount: { type: 'integer', example: 5 },
            bank: { $ref: '#/components/schemas/BankDetails' },
            status: { type: 'string', enum: ['pending', 'approved', 'paid', 'rejected'] },
            requestedAt: { type: 'string', format: 'date-time' },
          },
        },
        AgentEarning: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            agent: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                role: { type: 'string' },
              },
            },
            amount: { type: 'number', example: 2500 },
            status: { type: 'string', enum: ['available', 'requested', 'paid'] },
            payout: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        AgentReferral: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'object', description: 'firstName, lastName, email, phoneNumber, role, emailVerified, createdAt' },
            userRole: { type: 'string', example: 'dealer' },
            signedUpAt: { type: 'string', format: 'date-time' },
            activated: { type: 'boolean' },
            activatedAt: { type: 'string', format: 'date-time', nullable: true },
            signupEarned: { type: 'number' },
            activityEarned: { type: 'number' },
            totalEarned: { type: 'number' },
            stillToUnlock: { type: 'number' },
          },
        },
      },
    },
  },
  // Every JSDoc block in these files starting with @swagger / @openapi is picked up
  apis: ['./routers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);

