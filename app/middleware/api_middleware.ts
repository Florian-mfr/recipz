import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class ApiMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */

  async handle(ctx: HttpContext, next: NextFn) {
    const API_KEY = ctx.request.header('API_KEY')
    if (!API_KEY) {
      return ctx.response.status(403).send('Unauthorized')
    }
    if (API_KEY !== env.get('API_KEY')) {
      return ctx.response.status(403).send('Unauthorized')
    }
    return next()
  }
}
