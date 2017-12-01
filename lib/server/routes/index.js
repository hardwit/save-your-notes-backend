import authRoutes from './auth'

const combineRoutes = routes => app => {
  Object.keys(routes).forEach(route => routes[route](app))
}

const routes = {
  authRoutes
}

export default combineRoutes(routes)
