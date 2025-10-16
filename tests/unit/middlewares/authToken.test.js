import authToken from "../../../middlewares/authToken";
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

describe('auth token middleware', () => {
    test('no auth header', () => {
        let req = { headers: {} };
        let res = {};
        let mockNext = jest.fn();

        authToken(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'No authorization header',
                status: 401,
            })
        );
    });

    test('invalid format', () => {
        let req = { headers: { authorization: 'Invalid' } };
        let res = {};
        let mockNext = jest.fn();

        authToken(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Invalid authorization header format',
                status: 401,
            })
        );
    });
    
    test('bearer token missing', () => {
        let req = { headers: { authorization: 'Bearer ' } };
        let res = {};
        let mockNext = jest.fn();

        authToken(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Invalid authorization header format',
                status: 401,
            })
        );
    });
    
    test('missing Bearer with valid token', () => {
        const validToken = jwt.sign({ id: 1 }, 'test', { expiresIn: '1h' });

        let req = { headers: { authorization: `${validToken}` } };
        let res = {};
        let mockNext = jest.fn();

        authToken(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Invalid authorization header format',
                status: 401,
            })            
        );
    });

    test('expired token', () => {
        const validToken = jwt.sign({ id: 1 }, 'test', { expiresIn: '-1h' });

        let req = { headers: { authorization: `Bearer ${validToken}` } };
        let res = {};
        let mockNext = jest.fn();

        authToken(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Token expired',
                status: 401,
            })            
        );
    });
    
    test('invalid token', () => {
        let req = { headers: { authorization: 'Bearer InvalidToken' } };
        let res = {};
        let mockNext = jest.fn();

        authToken(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Invalid token',
                status: 403,
            })            
        );
    });    

    test('valid token', () => {
        const validToken = jwt.sign({ id: 1 }, 'test', { expiresIn: '1h' });

        let req = { headers: { authorization: `Bearer ${validToken}` } };
        let res = {};
        let mockNext = jest.fn();

        authToken(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
    });
});