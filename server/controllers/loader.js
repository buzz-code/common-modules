import * as models from '../../../server/models'
import genericRoute from '../routes/generic.route';
import genericController from "./generic.controller";

export function loadContoller(name, model) {
    let controller = {};
    const generic = genericController(models[model]);
    try {
        controller = require(`../../../server/controllers/${name}.controller`);
    } catch (e) {
    }

    return {
        ...generic,
        ...controller,
    };
}

export function genericRouteWithController(name, model, ...args) {
    return genericRoute(loadContoller(name, model), ...args);
}
