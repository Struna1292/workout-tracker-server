import { jest } from '@jest/globals';

describe('load user middleware', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test('db error', async () => {
        await jest.unstable_mockModule('../../../models/User.js', () => ({
            default: { findByPk: async () => { throw new Error('DB error'); } },
        }));

        const { default: loadUser } = await import('../../../middlewares/loadUser.js');

        const req = { user: { id: 1 } };
        const res = {};
        const next = jest.fn();

        await loadUser(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Internal server error while loading user',
                status: 500,
            })
        );
    });

    test('user not found', async () => {
        await jest.unstable_mockModule('../../../models/User.js', () => ({
            default: { findByPk: async () => null },
        }));

        const { default: loadUser } = await import('../../../middlewares/loadUser.js');

        const req = { user: { id: 1 } };
        const res = {};
        const next = jest.fn();

        await loadUser(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'User does not exist',
                status: 404,
            })
        );
    });

    test('user found', async () => {
        await jest.unstable_mockModule('../../../models/User.js', () => ({
            default: { findByPk: async () => { return { id: 1, username: 'user' } } },
        }));

        const { default: loadUser } = await import('../../../middlewares/loadUser.js');

        const req = { user: { id: 1 } };
        const res = {};
        const next = jest.fn();

        await loadUser(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(req.user).toBeInstanceOf(Object);
    });
});