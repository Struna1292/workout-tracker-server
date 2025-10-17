import errorHandler from "../../../middlewares/errorHandler.js";
import { jest } from '@jest/globals';

describe('error handler middleware', () => {
    test('empty error', () => {
        let req = {};
        let res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        let next = {};
        const err = new Error();

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: err.message,
            details: err.details,
        });
    });

    test('error with message,status and details', () => {
        let req = {};
        let res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        let next = {};
        const err = new Error('Message');
        err.status = 400;
        err.details = ['Details', 'Message'];

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: err.message,
            details: err.details,
        });
    });
});