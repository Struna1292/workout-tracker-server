import checkSync from "../../../middlewares/checkSync.js";
import { jest } from '@jest/globals';

describe('check sync middleware', () => {
    test('missing X-Last-Sync header', () => {
        let req = { headers: {} };
        let res = {};
        let mockNext = jest.fn();

        checkSync(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Missing X-Last-Sync header',
                status: 428,
            })
        );
    });

    test('null header', () => {
        let req = { headers: {
            'x-last-sync': null,
        }};
        let res = {};
        let mockNext = jest.fn();

        checkSync(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Missing X-Last-Sync header',
                status: 428,
            })
        );
    });
    
    test('invalid date', () => {
        let req = { headers: {
            'x-last-sync': 'Invalid Date',
        }};
        let res = {};
        let mockNext = jest.fn();

        checkSync(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Invalid date format in X-Last-Sync header',
                status: 400,
            })
        );
    });
    
    test('date not matching with server', () => {
        let req = { 
            headers: {
                'x-last-sync': '2025-02-02',
            },
            user: {
                last_sync: '2025-03-03',
            }
        };
        let res = {};
        let mockNext = jest.fn();

        checkSync(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Provided X-Last-Sync does not match with the server',
                status: 412,
            })
        );
    });
    
    test('valid matching date', () => {
        let req = { 
            headers: {
                'x-last-sync': '2025-03-03',
            },
            user: {
                last_sync: '2025-03-03',
            }
        };
        let res = {};
        let mockNext = jest.fn();

        checkSync(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
    });    
});