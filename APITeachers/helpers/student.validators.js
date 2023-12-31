const Student = require('../models/student.model');

const newStudent = {
    name: {
        exists: {
            errorMessage: 'El campo nombre es obligatorio'
        },
        trim: true,
        isLength: {
            options: { min: 3 },
            errorMessage: 'El nombre debe tener como mínimo 3 caracteres'
        }
    },
    surname: {
        exists: {
            errorMessage: 'El campo apellidos es obligatorio'
        },
        trim: true,
        isLength: {
            options: {min: 3, max: 80},
            errorMessage: 'La longitud del campo apellidos no es válida'
        }
    },
    email: {
        exists: {
            errorMessage: "El campo email es obligatorio",
        },
        trim: true,
        isEmail: {
            errorMessage: "Introduzca un email válido",
        }
    },
    password: {
        exists: {
            errorMessage: "El campo contraseña es obligatorio",
        },
        trim: true,
        isLength: {
            options: { min: 8 },
            errorMessage: "La contraseña requiere 8 caracteres como mínimo"
        }
        // isStrongPassword: {
        //     minLength: 8,
        //     minLowercase: 1,
        //     minUppercase: 1,
        //     minNumbers: 1,
        // },
        // errorMessage: "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number"
    },
    role_id: {
        exists: {
            errorMessage: "El campo rol es obligatorio"
        },
        isInt: {
            errorMessage: "El rol debe ser un valor numérico"
        }
    },
    phone: {
        exists: {
            errorMessage: "El campo número de teléfono es obligatorio"
        },
        trim: true,
        isLength: {
            options: { max: 12 },
            errorMessage: 'El número de teléfono no puede superar los 12 dígitos'
        }
    },
    avatar: {     
        optional: {
            options: { 
                checkFalsy: true,
                checkNull: true
            }
        },
        trim: true,        
        isURL: {
            errorMessage: 'Introduzca una URL válida para el avatar'
        }
    },
    latitude: {
        optional: {
            options: { 
                checkFalsy: true,
                checkNull: true
            }
        },
        isDecimal: {
            errorMessage: "La latitud debe ser un número decimal utilizando el . como separador"
        }
    },
    longitude: {
        optional: {
            options: { 
                checkFalsy: true,
                checkNull: true
            }
        },
        isDecimal: {
            errorMessage: "La longitud debe ser un número decimal utilizando el . como separador"
        }
    },
    city_id: {
        exists: {
            errorMessage: 'El campo ciudad es obligatorio',
        },
        isInt: {
            options: { gt: 0 },
            errorMessage: 'El campo identificador de la ciudad tiene que ser un número entero mayor que cero'
        }
    },
    address: {
        optional: true,
        trim: true
    },
    active: {
        optional: true
    }
}

const checkStudent = async (req, res, next) => {
   
    let studentId;

    try {
       
        studentId = ((Object.keys(req.params).length !== 0 && req.params.studentId !== undefined)? req.params.studentId : req.body.studentId);

        if (studentId === undefined) {
            return res.status(400).json({ error: 'Ocurrió un error al validar el identificador del estudiante. El valor '+ studentId + ' no existe'});
        }

        const student = await Student.getById(studentId);

        if (!student) {            
            return res.status(400).json({ error: 'No existe el estudiante con Id = ' + studentId + '. Debe darlo de alta en la base de datos.' });
        }

        next();       
    } 
    catch (error) {     
        if (err.code === 'ECONNREFUSED') {
            res.status(503);
        }
        else {
            res.status(400);
        }   
        return res.json({ error: 'No se pudo verificar el estudiante con Id = ' + studentId + '. Error ' + error.errno + ": " + error.message});        
    }
}

const checkEmptyFields = (req, res, next) => {
    req.body.latitude = (req.body.latitude === "" || req.body.latitude === undefined ? null : req.body.latitude);
    req.body.longitude = (req.body.longitude === "" || req.body.longitude === undefined ? null : req.body.longitude);
    req.body.address = (req.body.address === "" || req.body.address === undefined ? null : req.body.address);
    req.body.avatar = (req.body.avatar === "" || req.body.avatar === undefined ? null : req.body.avatar);

    next();
}

module.exports = {
    newStudent, checkStudent, checkEmptyFields
}