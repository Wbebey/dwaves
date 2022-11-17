import { checkEnv } from './checkEnv'

const config = {
  apiHost: checkEnv('API_HOST'),
  apiPort: checkEnv('API_PORT'),
}

type ApiRoutes = {
  MONTHLY_LISTENINGS: string
}

const routes: ApiRoutes = {
  MONTHLY_LISTENINGS: '/users/monthlyListenings',
}

Object.keys(routes).forEach((r) => {
  const route = r as keyof ApiRoutes
  routes[route] = `${config.apiHost}:${config.apiPort}${routes[route]}`
})

export default routes
