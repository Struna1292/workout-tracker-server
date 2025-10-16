import checkBody from "../../../middlewares/checkBody.js";
import { jest } from '@jest/globals';

describe('check body middleware', () => {
    test('missing body', () => {
        let req = {};
        let res = {};
        let mockNext = jest.fn();

        checkBody(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'There is no data sent',
                status: 400,
            })            
        );       
    });

    test('body null', () => {
        let req = { body: null };
        let res = {};
        let mockNext = jest.fn();

        checkBody(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'There is no data sent',
                status: 400,
            })            
        );       
    });    

    test('valid body', () => {
        let req = { body: {} };
        let res = {};
        let mockNext = jest.fn();

        checkBody(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith();        
    });
});