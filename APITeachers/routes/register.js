const router = require('express').Router();

const { checkSchema } = require('express-validator');
const bcrypt = require('bcryptjs');

const { newStudent } = require('../helpers/student.validators');
const { checkError, checkCity} = require('../helpers/common.validators');
const Student = require('../models/student.model');
const Location = require('../models/location.model');
const User = require('../models/user.model');

router.post('/student', checkSchema(newStudent), checkCity, checkError, async (req, res) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 8);

        // Insert location and get location_id
        const newLocation = await Location.create(req.body);
        req.body.location_id = newLocation.insertId;

        // Insert user and get user_id
        const newUser = await User.create(req.body);
        req.body.user_id = newUser.insertId;

        // Insert user and get data
        const response = await Student.create(req.body);
        const student = await Student.getById(response.insertId);

        res.status(200).json(student);
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router