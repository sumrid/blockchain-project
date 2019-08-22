// To test
const service = require('../src/service');
jest.mock('../src/service');

describe('service test', () => {

    test('should ', async () => {
        // mock
        let contract = {};
        contract.evaluateTransaction = jest.fn().mockImplementation(() => {
            return Promise.resolve(Buffer.from('some results'));
        });
        service.getContractOrg1
            .mockImplementation(() => {
                Promise.resolve(contract);
            });

        try {
            const reuslt = await service.query('001');
            expect(reuslt).toEqual('some results..');
            console.log(reuslt);
        } catch (err) {
            console.log(err);
        }

    });
});