// To mock
const service = require('../src/service/service');
const firebase = require('../src/service/firebase');
jest.mock('../src/service/service');
jest.mock('../src/service/firebase');

// To test
const controller = require('../src/controller/controller');

describe('controller test', () => {
    const req = {};
    const res = {};

    beforeEach(() => {
        res.json = jest.fn();
        res.status = jest.fn().mockReturnValue(res);
    });

    test('should query success', async () => {
        req.params = { key: "some-id" };
        service.query.mockResolvedValue(Buffer.from(`{"id": "${req.params.key}"}`));

        await controller.query(req, res);

        expect(service.query).toHaveBeenLastCalledWith("some-id");
        expect(res.json).toHaveBeenLastCalledWith({ id: "some-id" });
    });

    test('should query fail with status 500', async () => {
        req.params = { key: "some-id" };
        service.query.mockRejectedValue(new Error('Async error'));

        await controller.query(req, res);

        expect(res.status).toHaveBeenLastCalledWith(500);
    });

    test('should get tx success.', async () => {
        req.params = { txid: "tx00001" };
        service.queryTx.mockResolvedValue({ txid: req.params.txid });

        await controller.getTx(req, res);

        expect(service.queryTx).toHaveBeenLastCalledWith(req.params.txid);
        expect(res.json).toHaveBeenLastCalledWith({ txid: req.params.txid });
    });

    test('should get tx fail.', async () => {
        req.params = { txid: "tx00001" };
        service.queryTx.mockRejectedValue(new Error('Async error'));

        await controller.getTx(req, res);

        expect(res.status).toHaveBeenLastCalledWith(500);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
});