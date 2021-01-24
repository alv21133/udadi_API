'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.post('/api/beta/login', 'UserController.login')
Route.post('/api/beta/register', 'UserController.register')
Route.post('/api/beta/check-user', 'UserController.checkUser')
Route.post('/api/beta/create-history', 'UserController.loginReport')
Route.post('/api/beta/logout', 'UserController.logout')
