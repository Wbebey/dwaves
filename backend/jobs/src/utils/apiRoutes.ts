import { checkEnv } from './checkEnv'

const config = {
  apiHost: checkEnv('API_HOST'),
}

type ApiRoutes = {
  LOGIN: string
  MONTHLY_LISTENINGS: string
}

const routes: ApiRoutes = {
  LOGIN: '/auth/login',
  MONTHLY_LISTENINGS: '/users/monthlyListenings',
}

Object.keys(routes).forEach((r) => {
  const route = r as keyof ApiRoutes
  routes[route] = `${config.apiHost}${routes[route]}`
})

export default routes
