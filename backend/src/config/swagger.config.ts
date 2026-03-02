import swaggerJsdoc from 'swagger-jsdoc';
import { UserRole } from '../types/role.enum';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Care Coordination & Clinical Workflow Platform API',
            version: '1.0.0',
            description: 'API Documentation for the healthcare provider workflow platform.',
            contact: {
                name: 'Technical Support',
                email: 'support@example.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:5002/api/v1',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string', enum: Object.values(UserRole) },
                        isActive: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
