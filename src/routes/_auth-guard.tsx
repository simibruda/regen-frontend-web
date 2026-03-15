import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guard')({
  beforeLoad: async () => {

    //TODO: Add get current user if is not provided that is should redirect to the login page
    // const user = await getUser()
    // if (!user) {
    //   return redirect({ to: '/login' })
    // }
    // return { user }
  },
  component: Outlet,
})

