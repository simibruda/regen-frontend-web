import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <section className="space-y-4 text-left">
      <h2 className="text-2xl font-semibold">Project Setup Complete</h2>
      <p className="text-slate-300">
        This app uses <strong>Vite</strong>, <strong>TanStack Router</strong>,{' '}
        <strong>React Query</strong>, and <strong>Orval</strong>.
      </p>
      <p className="text-slate-300">
        Open the Posts page to see data fetched through generated Orval hooks.
      </p>
    </section>
  )
}
