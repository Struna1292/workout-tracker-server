import User from "../models/User.js";

const validateNewMeasure = (reqBody, errors) => {
    if (!reqBody) {
        return undefined;
    }

    const validated = {
        weight: undefined,
        arm: undefined, 
        forearm: undefined, 
        chest: undefined,
        waist: undefined, 
        hips: undefined,
        thigh: undefined,
        calf: undefined
    };

    // check if there is atleast one valid parameter
    let validParameter = false;

    for (let key in validated) {
        if (reqBody[key]) {
            const value = reqBody[key];

            if (value > 0) {
                validated[key] = reqBody[key];
                validParameter = true;
            }
            else {
                // add error information
                errors.push(`${key} needs to be positive number`);
            }
        }           
    }
    
    if (!validParameter) {
        return undefined;
    }

    return validated;
};


export const addMeasure = async (req, res, next) => {
    try {
        const errors = [];

        const data = validateNewMeasure(req.body, errors);

        if (!data) {
            console.log("Failed to create measurement there is no valid data");
            let message = "Cant create new user measurement without any valid data.";
            for (const error of errors) {
                message += "\n" + error;
            }   
            const err = new Error(message);
            err.status = 422;
            return next(err);
        }

        const user = await User.findByPk(req.user.id);

        if (!user) {
            console.log("Failed to create new measurement. User does not exist");
            const err = new Error("Failed to create new measurement. User does not exist");
            err.status = 404;
            return next(err);
        }

        await user.createBodyMeasurement(data);

        return res.status(201).json({ message: "successfully created new measure" });        
    }
    catch (error) {
        console.log(`Error while trying to add new measurement: ${error}`);
        const err = new Error("Internal server error while trying to add new measurement");
        err.status = 500;
        return next(err);
    }
};