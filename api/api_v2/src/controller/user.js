const validator = require('validator');
const service = require('../service/service');
const register = require('../service/register');
const firebase = require('../service/firebase');

function queryObj() {
    return {
        selector: {
            type: {
                $eq: ""
            }
        }
    }
}

async function regisUser(req, res) {
    console.info(`[${process.env.ORG}] [controller] regisUser`);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role || "";

    try {
        const user = await firebase.registerUser(name, email, password);
        const setRole = firebase.setUser(user.uid, name, role);
        const regisCA = register.regis(user.uid);
        const addToBlock = service.addUser(user.uid, role);
        firebase.sendConfirmEmail(email);
        await Promise.all([setRole, regisCA, addToBlock]);
        res.json({ user: user });
    } catch (error) {
        res.status(500).json(error);
    }
}

async function updateUser(req, res) {
    try {
        const uid = req.params.id;
        await firebase.updateUser(uid, req.body);
        res.json({ uid, ...req.body });
    } catch (error) {
        res.status(500).json(error);
    }
}

async function deleteUser(req, res) {
    try {
        const input = req.params.id;
        // Input email or uid
        const isEmail = validator.isEmail(input);
        if (isEmail) {
            const user = await firebase.getUserByEmail(input);
            await firebase.deleteUser(user.uid);
            await service.deleteUser(user.uid);
            await register.deleteUser(user.uid);
        } else {
            await firebase.deleteUser(input); // auth, DB
            await service.deleteUser(input);  // world state
            await register.deleteUser(input); // wallet
        }
        res.json({ input });
    } catch (error) {
        res.status(500).json(error);
    }
}

async function verifyUserIDCard(req, res) {
    try {
        const user = req.params.id;
        const checker = req.body.checker;
        const verifyState = req.body.verify;

        const result = await service.changeUserVerifyState(checker, user, verifyState);
        const payload = JSON.parse(String(result));
        firebase.updateUser(user, { verifyIDCard: true, verifyID_tx: payload.txid });

        res.json(payload);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function getUser(req, res) {
    try {
        const input = req.params.id;
        const isEmail = validator.isEmail(input);
        if (isEmail) {
            const user = await firebase.getUserByEmail(input);
            const isExsits = await register.checkUserExists(user.uid);
            if (isExsits) {
                const userAsBuffer = await service.query(user.uid);
                const userBlock = JSON.parse(String(userAsBuffer));
                res.json({ ...user, ...userBlock });
            }
            else {
                console.info(`[service] [getUser]: user not in wallet`);
                res.status(404).json({ message: "user not found." });
            }
        } else {
            const isExsits = await register.checkUserExists(input);
            if (isExsits) {
                const user = await firebase.getUserByUID(input);
                const userAsBuffer = await service.query(input);
                const userBlock = JSON.parse(String(userAsBuffer));
                res.json({ ...user, ...userBlock });
            }
            else {
                res.status(404).json({ message: "user not found." });
            }
        }
    } catch (error) {
        res.status(404).json(error);
    }
}

async function getAllUsers(req, res) {
    try {
        const query = queryObj();
        query.selector.type.$eq = "user";
        const queryString = JSON.stringify(query);

        const results = await service.queryWithSelector(queryString);
        const users = JSON.parse(String(results));

        if (users) res.json(users);
        else res.status(404).json([]);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function getDonations(req, res) {
    try {
        const userid = req.params.id;
        const query = queryObj();
        query.selector.type.$eq = "donation"
        query.selector.user = { $eq: userid };
        const queryString = JSON.stringify(query);

        const result = await service.queryWithSelector(queryString);
        const donations = JSON.parse(String(result));
        if (donations) res.json(donations);
        else res.status(404).json([]);
    } catch (err) {
        res.json(err);
    }
}

async function getProjects(req, res) {
    try {
        const uid = req.params.id;
        const query = queryObj();
        query.selector.type.$eq = "project"
        query.selector.owner = { $eq: uid };
        const queryString = JSON.stringify(query);

        const result = await service.queryWithSelector(queryString);
        const projects = JSON.parse(String(result));
        if (projects) res.json(projects);
        else res.status(404).json([]);
    } catch (err) {
        res.status(500).json(err);
    }
}

async function getReceiveProject(req, res) {
    try {
        const uid = req.params.id;
        const query = queryObj();
        query.selector.type.$eq = "project";
        query.selector.receiver = { $eq: uid };
        const queryString = JSON.stringify(query);

        const result = await service.queryWithSelector(queryString);
        const projects = JSON.parse(String(result));
        if (projects) res.json(projects);
        else res.status(404).json([]);
    } catch (err) {
        res.status(500).json(err);
    }
}

async function rating(req, res) {
    try {
        const creator = req.params.id;
        const rater = req.body.rater;
        const rate = req.body.rate;
        const user = await firebase.getUserData(creator);
        await firebase.addRating(rater, creator, rate);

        // if (user) {
        //     // const num = user.num_rating || 0;
        //     // const avg = user.avg_rating || 0;

        //     // num += 1;
        //     // avg = (avg + rate) / num;

        //     // user.num_rating = num;
        //     // user.avg_rating = avg;

        //     res.json(user);
        // } else {

        // }

        res.json({ creator, rater, rate });
    } catch (error) {
        res.status(500).json(error);
    }
}

async function getRate(req, res) {
    try {
        const id = req.params.id;
        const rating = await firebase.getRatingByCreator(id);
        if (rating.length > 0) {
            const num_rating = rating.length;
            let avg_rating = 0;
            let total_rate = 0;
            let one_star = 0;
            let two_star = 0;
            let three_star = 0;
            let four_star = 0;
            let five_star = 0;

            rating.forEach(item => {
                total_rate += item.rate;
                switch (item.rate) {
                    case 1:
                        one_star++;
                        break;
                    case 2:
                        two_star++;
                        break;
                    case 3:
                        three_star++;
                        break;
                    case 4:
                        four_star++;
                        break;
                    case 5:
                        five_star++;
                        break;
                    default:
                        break;
                }
            });
            avg_rating = total_rate / num_rating;
            res.json({ avg_rating, total_rate, num_rating, one_star, two_star, three_star, four_star, five_star });
        } else {
            res.status(404).json({});
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

async function sendConfirmEmail(req, res) {
    try {
        const email = req.params.email;
        firebase.sendConfirmEmail(email);
        res.json({email});
    } catch (error) {
        res.status(500).json(error);        
    }
}

module.exports = {
    rating,
    getUser,
    getRate,
    regisUser,
    deleteUser,
    updateUser,
    getAllUsers,
    getProjects,
    getDonations,
    sendConfirmEmail,
    verifyUserIDCard,
    getReceiveProject,
}