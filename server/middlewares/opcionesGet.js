/*jshint esversion: 8*/
const opcionesGet = (req, res, next) => {

    if (req.method === 'GET') {

        req.queryMatch = {
            blnActivo: true
        };

        if (req.query.mostrarDesactivados) {
            if (req.query.mostrarDesactivados != 'false' && req.query.mostrarDesactivados != 'true') {
                return res.status(400).json({
                    ok: false,
                    resp: 400,
                    msg: 'No se recibió un valor booleano en el parámetro mostrarDesactivados.',
                    cont: {
                        mostrarDesactivados: req.query.mostrarDesactivados || null
                    }
                });
            }

            if (req.query.mostrarDesactivados === 'true') {
                delete req.queryMatch.blnActivo;
            }
        }
    }

    next();
};

module.exports = opcionesGet;