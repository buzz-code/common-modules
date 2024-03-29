import express from 'express';
import isAuthenticated from '../middlewares/authenticate';
import validate from '../config/joi.validate';
import schema from '../utils/validator';
import { exportPdf } from '../utils/template';

export default (ctrl, callback, skipAuthentication) => {
    const router = express.Router();

    router.use((req, res, next) => {
        if (!skipAuthentication || !skipAuthentication(req)) {
            isAuthenticated(req, res, next);
        } else {
            next();
        }
    });

    if (callback) {
        callback(router, ctrl);
    }

    router.route('/')
        .post(validate(schema.any), (req, res) => {
            ctrl.store(req, res);
        })
        .get((req, res) => {
            ctrl.findAll(req, res);
        });

    router.route('/:id')
        .get((req, res) => {
            ctrl.findById(req, res);
        })
        .put((req, res) => {
            ctrl.update(req, res);
        })
        .delete((req, res) => {
            ctrl.destroy(req, res);
        });

    router.route('/upload-multiple')
        .post((req, res) => {
            ctrl.uploadMultiple(req, res);
        });

    router.route('/export-pdf')
        .post((req, res) => {
            exportPdf(req, res);
        });

    return router;
};