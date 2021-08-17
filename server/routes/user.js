/*jshint esversion: 9*/
const UserModel = require('../models/user.model');
const Helper = require("../libraries/helper");
const express = require('express');
const router = express.Router();
const email = require('../libraries/email');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
        if (req.query.idUsuario) req.queryMatch._id = req.query.idUsuario;
        if (req.query.termino) req.queryMatch.$or = Helper(["strNombre", "strCorreo"], req.query.termino);

        const usuario = await UserModel.find({ ...req.queryMatch });

        if (usuario.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron usuarios en la base de datos.',
                cont: {
                    usuario
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    usuario
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener a los usuarios.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

router.post('/', async (req, res) => {

    try {
        const user = new UserModel(req.body);

        let err = user.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar el usuario.',
                cont: {
                    err
                }
            });
        }

        const usuarioEncontrado = await UserModel.findOne({ strCorreo: { $regex: `^${user.strCorreo}$`, $options: 'i' } });
        if (usuarioEncontrado) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'El correo del usuario que desea registrar ya se encuentra en uso.',
            cont: {
                Correo: usuarioEncontrado.strCorreo
            }
        });

        const usuario = await user.save();

        if (usuario.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar el usuario.',
                cont: {
                    usuario
                }
            });
        } else {

            let mail = {
                to: usuario.strCorreo,
                subject: '¡Cuenta creada correctamente!',
                html: "<body>¡Cuenta creada correctamente!</body>"
            };

            email.sendEmail(mail);

            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Usuario agregado correctamente.',
                cont: {
                    usuario
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar al usuario.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

router.post('/login', async (req, res) => {

    try {

        UserModel.findOne({ strCorreo: req.body.strCorreo }, (err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: '¡Usuario y/o contraseña incorrecta!'
                    }
                });
            }

            if (!bcrypt.compareSync(req.body.strContrasenia, user.strContrasenia)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: '¡Usuario y/o contraseña incorrecta!'
                    }
                });
            }

            let token = jwt.sign({
                user: user
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            return res.status(200).json({
                ok: true,
                user: user,
                token
            });
        });
    } catch (error) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al intentar logearse.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

module.exports = router;