import { Loader } from '@/common/components/_base/loader'

export function LoadingPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary-2/70 via-primary to-primary" />
      <div className="pointer-events-none absolute -left-24 top-12 size-64 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 size-72 rounded-full bg-accent/20 blur-3xl" />

      <section className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/25 bg-card/95 shadow-2xl backdrop-blur-sm">
        <div className="h-2 w-full bg-accent" />

        <div className="space-y-6 p-8 text-center">
          <header className="space-y-2">
            <p className="text-4xl uppercase tracking-tight text-accent">
              <span className="font-bold">Re</span>
              <span className="font-normal">Manage</span>
            </p>
            <h1 className="text-xl font-medium tracking-tight text-primary">Preparing your workspace</h1>
            <p className="text-xs text-black/50">Please wait a moment while we load everything.</p>
          </header>

          <Loader />
        </div>
      </section>
    </main>
  )
}
