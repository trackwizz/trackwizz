import { RequestHandler, Router } from 'express';
import { handleErrors } from '../middlewares/handle_errors';

/**
 * GET decorator.
 *
 * @param path: path for the get function
 */
export function get({ path }: { path: string } = { path: '' }) {
    return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
        const method: RequestHandler = propertyDesciptor.value;
        if (target.router === undefined) {
            target.router = Router({ mergeParams: true });
        }
        target.router.get(path, handleErrors(method));
        return propertyDesciptor;
    };
}

/**
 * POST decorator
 *
 * @param path: path for the post function
 */
export function post({ path }: { path: string } = { path: '' }) {
    return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
        const method: RequestHandler = propertyDesciptor.value;
        if (target.router === undefined) {
            target.router = Router({ mergeParams: true });
        }
        target.router.post(path, handleErrors(method));
        return propertyDesciptor;
    };
}

/**
 * PUT decorator
 *
 * @param path: path for the put function
 */
export function put({ path }: { path: string } = { path: '' }) {
    return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
        const method: RequestHandler = propertyDesciptor.value;
        if (target.router === undefined) {
            target.router = Router({ mergeParams: true });
        }
        target.router.put(path, handleErrors(method));
        return propertyDesciptor;
    };
}

/**
 * DELETE decorator
 *
 * @param path: path for the put function
 */
export function del({ path }: { path: string } = { path: '' }) {
    return function getDecorator(target: Controller, _: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
        const method: RequestHandler = propertyDesciptor.value;
        if (target.router === undefined) {
            target.router = Router({ mergeParams: true });
        }
        target.router.delete(path, handleErrors(method));
        return propertyDesciptor;
    };
}

export abstract class Controller {
    public router: Router;
    public path: string;

    protected constructor(path: string) {
        this.path = path;
    }
}
