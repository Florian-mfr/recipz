import env from '#start/env';
export default class ApiMiddleware {
    async handle(ctx, next) {
        const API_KEY = ctx.request.header('API_KEY');
        if (!API_KEY) {
            return ctx.response.status(403).send('Unauthorized');
        }
        if (API_KEY !== env.get('API_KEY')) {
            return ctx.response.status(403).send('Unauthorized');
        }
        return next();
    }
}
//# sourceMappingURL=api_middleware.js.map