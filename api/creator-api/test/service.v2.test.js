// Mock
const { FileSystemWallet, Gateway } = require('fabric-network');
jest.mock('fabric-network');
const { project } = require('./mock.data');

// Test
const service = require('../src/service');

describe('test with mock fabric-network (fabric pass)', () => {

    const contract = {};

    beforeAll(() => {
        // mock fabric-network
        const wallet = {};
        wallet.exists = jest.fn().mockReturnValue(true);
        FileSystemWallet.mockImplementation(() => wallet);

        const network = {};
        network.getContract = jest.fn().mockResolvedValue(contract);
        const gateway = {};
        gateway.connect = jest.fn().mockResolvedValue('');
        gateway.getNetwork = jest.fn().mockResolvedValue(network);
        Gateway.mockImplementation(() => gateway);
    });

    // afterEach(()=>{
    //     jest.resetAllMocks();
    // })

    test('should query success.', async () => {
        // mock
        contract.evaluateTransaction = jest.fn().mockResolvedValue(Buffer.from('some-result'));

        const result = await service.query('some-key');

        expect(String(result)).toEqual('some-result');
        expect(contract.evaluateTransaction).toHaveBeenCalledWith('query', 'some-key');
    });

    test('should query fails.', async () => {
        // mock
        contract.evaluateTransaction = jest.fn().mockRejectedValue(new Error('some error'));

        try {
            await service.query('key');
        } catch (err) {
            expect(err).toEqual(new Error('some error'));
        }
    });

    test('should create project success.', async () => {
        // mock
        const mockProject = project;
        contract.submitTransaction = jest.fn().mockResolvedValue(Buffer.from(JSON.stringify(mockProject)));

        const result = await service.createProject('userID', mockProject);

        expect(contract.submitTransaction)
            .toHaveBeenCalledWith(
                'createProject',
                'p_01',
                'ช่วยเหลือโรงเรียนห่างไกล',
                'open',
                '0',
                'user1',
                '2019-08-09T13:54:44Z',
                '2019-08-15T13:54:44Z',
                'user2',
                '50000',
            );
        expect(JSON.parse(String(result))).toEqual(mockProject);
    });

    test('should create project throw error', async () => {
        contract.submitTransaction = jest.fn().mockRejectedValue(new Error('some error'));
        const mockProject = project;
        try {
            await service.createProject('userID', mockProject);
        } catch (err) {
            expect(err).toEqual(new Error('some error'));
        }
    });

    test('should donate success.', async () => {
        const donate = {
            user: 'userID',
            project: 'projectID',
            amount: '500',
            time: '2019-08-15T13:54:44Z',
            displayname: 'salala'
        }
        contract.submitTransaction = jest.fn().mockResolvedValue();

        await service.donate('userID', donate);
        expect(contract.submitTransaction).toHaveBeenCalledWith(
            'donate',
            donate.user,
            donate.project,
            donate.amount.toString(),
            donate.time,
            donate.displayname
        );
    });

    test('should donate throw error', async () => {
        const donate = {
            user: 'userID',
            project: 'projectID',
            amount: '500',
            time: '2019-08-15T13:54:44Z',
            displayname: 'salala'
        }
        contract.submitTransaction = jest.fn().mockRejectedValue(new Error('some error'));
        try {
            await service.donate('userID', donate);
        } catch (err) {
            expect(err).toEqual(new Error('some error'));
        }
    });
});
