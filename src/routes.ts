/**
 * An array of routesthat that accesibleto the public
 * These routes do not require authentication
 * @type {string[]}
 */
const publicRoutes: string[] = ['/', '/auth/new-verification']

/**
 * An array of routesthat that accesibleto the authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
const authRoutes: string[] = ['/auth/login', '/auth/register']

/**
 * The prefix for authentification api routes
 * Routes that starts with this prefix are used for API authentification purproses
 * @type {string[]}
 */
const apiAuthPrefix: string = '/api/auth'

/**
 * The default redirect path after userlogged in
 * @type {string}
 */
const DEFAULT_LOGIN_REDIRECT: string = '/'

export { publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT }
