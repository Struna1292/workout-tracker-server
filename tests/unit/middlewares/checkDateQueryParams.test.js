import checkDateQueryParams from "../../../middlewares/checkDateQueryParams.js";
import { jest } from '@jest/globals';

describe('check date query params middleware', () => {
    test('missing end date', () => {
        let req = { 
            query: { 
                startDate: '2025-02-02',
            } 
        };
        let res = {};
        let mockNext = jest.fn();

        checkDateQueryParams(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'No endDate query param provided',
                status: 400,
            })            
        );       
    });

    test('invalid end date', () => {
        let req = { 
            query: { 
                startDate: '2025-02-02',
                endDate: 'Invalid Date', 
            } 
        };
        let res = {};
        let mockNext = jest.fn();

        checkDateQueryParams(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'endDate query param invalid date',
                status: 400,
            })            
        );       
    });

    test('invalid start date', () => {
        let req = { 
            query: { 
                startDate: 'Invalid Date',
                endDate: '2025-02-02', 
            } 
        };
        let res = {};
        let mockNext = jest.fn();

        checkDateQueryParams(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'startDate query param invalid date',
                status: 400,
            })            
        );       
    });

    test('start date older than end date', () => {
        let req = { 
            query: { 
                startDate: '2025-03-02',
                endDate: '2025-02-02', 
            } 
        };
        let res = {};
        let mockNext = jest.fn();

        checkDateQueryParams(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'startDate cant be the same or older than endDate',
                status: 400,
            })            
        );       
    });
    
    test('start date equal to end date', () => {
        let req = { 
            query: { 
                startDate: '2025-02-02',
                endDate: '2025-02-02', 
            } 
        };
        let res = {};
        let mockNext = jest.fn();

        checkDateQueryParams(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'startDate cant be the same or older than endDate',
                status: 400,
            })            
        );       
    });
    
    test('valid without start date', () => {
        let req = { 
            query: { 
                endDate: '2025-02-02', 
            } 
        };
        let res = {};
        let mockNext = jest.fn();

        checkDateQueryParams(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
        expect(req.startDate).toBeNull();
        expect(req.endDate).toBeInstanceOf(Date);        
    });    

    test('valid with start date null', () => {
        let req = { 
            query: { 
                startDate: null,
                endDate: '2025-02-02', 
            } 
        };
        let res = {};
        let mockNext = jest.fn();

        checkDateQueryParams(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
        expect(req.startDate).toBeNull();
        expect(req.endDate).toBeInstanceOf(Date);
    });

    test('valid start date, valid end date', () => {
        let req = { 
            query: { 
                startDate: '2025-01-01',
                endDate: '2025-02-02', 
            } 
        };
        let res = {};
        let mockNext = jest.fn();

        checkDateQueryParams(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
        expect(req.startDate).toBeInstanceOf(Date);
        expect(req.endDate).toBeInstanceOf(Date);
    });
});