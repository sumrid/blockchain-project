const rewire = require("rewire");

// To test
const service = rewire('../src/service');
const serJest = require('../src/service')
// jest.mock('../src/service');

describe('service test', () => {

    test('query should success.', async () => {
        // mock contract
        let contract = {};
        contract.evaluateTransaction = jest.fn().mockImplementation(() => {
            return Promise.resolve(Buffer.from('some results'));
        });
        service.__set__({ // ทำการ mock private function
            getContractOrg1: function () {
                return Promise.resolve(contract);
            }
        });

        const reuslt = await service.query('001');
        expect(String(reuslt)).toEqual('some results');
    });

    test('query should fails.', async () => {
        // mock
        let contract = {};
        contract.evaluateTransaction = jest.fn().mockImplementation(() => {
            return Promise.reject(new Error('some error'));
        })
        service.__set__({ // ทำการ mock private function
            getContractOrg1: function () {
                return Promise.resolve(contract);
            }
        });

        await expect(service.query('001'))
            .rejects
            .toThrow('some error');
    });

    test('getContractOrg1 fails (user identity does not exist).', async () => {
        const user = 'some-user';
        await expect(serJest.getContractOrg1(user))
            .rejects
            .toThrow(`An identity for the user "${user}" does not exist in the wallet`);
    });
});