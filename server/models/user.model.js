/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    strNombre: {
        type: String,
        required: [true, 'Favor de insertar el nombre.']
    },
    strCorreo: {
        type: String,
        required: [true, 'Favor de insertar su correo.']
    },
    strContrasenia: {
        type: String,
        required: [true, 'Favor de ingresar una contraseña.']
    },

    blnActivo: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "user"
});

module.exports = mongoose.model('user', userSchema);