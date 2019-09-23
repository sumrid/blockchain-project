// to mock
const firebase = require('../src/service.firebase');
const service = require('../src/service');
jest.mock('../src/service');
jest.mock('../src/service.firebase');

// to test
const controller = require('../src/controller');

describe('Test controller.js', () => {

    let req = {};
    let res = {};
    res.json = jest.fn();
    res.status = jest.fn().mockReturnValue(res);

    test('should register success.', async () => {
        req = {
            body: {
                name: "user",
                email: "test@test.com",
                password: "12341234"
            }
        }
        let user = {
            uid: "mock-uid"
        }
        firebase.registerUser.mockResolvedValue(user);

        // Action
        await controller.registerReceiver(req, res);

        // Assert
        expect(firebase.registerUser).toHaveBeenCalledWith("user", "test@test.com", "12341234")
        expect(service.registerReceiver).toHaveBeenCalledWith("mock-uid");
        expect(res.json).toHaveBeenCalledWith({ user: user });
    });

    test('should have user. (with email)', async () => {
        req = { params: { id: "test@test.com" } };
        let user = {uid: "mock-uid"};
        firebase.getUserByEmail.mockResolvedValue(user);
        service.checkUserExists.mockResolvedValue(true);
        
        // Action
        await controller.getUser(req, res);

        // Assert
        expect(firebase.getUserByEmail).toHaveBeenCalledWith("test@test.com");
        expect(res.json).toHaveBeenCalledWith("mock-uid");
    });

    test('should have user. (with uid)', async () => {
        req = { params: { id: "mock-uid" } };
        service.checkUserExists.mockResolvedValue(true);

        // Action
        await controller.getUser(req, res);

        // Assert
        expect(service.checkUserExists).toHaveBeenCalledWith("mock-uid");
        expect(res.json).toHaveBeenCalledWith("mock-uid");
    });

    test('should get user not found. (with email)', async () => {
        req = { params: { id: "test@test.com" } };
        // firebase.getUserByEmail.mockResolvedValue(user);
        service.checkUserExists.mockResolvedValue(false);
        
        // Action
        await controller.getUser(req, res);

        // Assert
        expect(firebase.getUserByEmail).toHaveBeenCalledWith("test@test.com");
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.status().json).toHaveBeenCalledWith({message: "user not found."});
    });

    test('should get user not found. (with uid)', async () => {
        req = { params: { id: "mock-uid" } };
        service.checkUserExists.mockResolvedValue(false);
        
        // Action
        await controller.getUser(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.status().json).toHaveBeenCalledWith({message: "user not found."});
    });

    test('should update project status success.', async () => {
        req = {
            body: {
                user: "user-uid",
                project: "project-uid",
                status: "open"
            }
        }
        service.updateProjectStatus.mockResolvedValue(Buffer.from(String({id:"project-uid"})));

        // Action
        await controller.updateProjectStatus(req, res);

        // Assert
        expect(service.updateProjectStatus).toHaveBeenCalledWith("user-uid","project-uid","open");
        expect(service.updateProjectStatus).toHaveReturned();
        // expect(res.json).toHaveBeenCalledWith("");
    });

    test('should query project success.', async () => {
        let result = [{id:1}, {id:2}];
        service.getAllProjects.mockResolvedValue(Buffer.from(String(result)));

        // Action
        await controller.getAllProjects(req, res);

        // Assert
        expect(service.getAllProjects).toHaveBeenCalled();
        expect(service.getAllProjects).toHaveReturned();
        // expect(res.json).toHaveBeenCalledWith("");
    });

    afterEach(() => {
        jest.clearAllMocks();
        // jest.resetAllMocks();
      });
});