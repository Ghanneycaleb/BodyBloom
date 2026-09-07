type PlaceholderPageProps = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section aria-labelledby="page-title" className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-primary">Coming next</p>
        <h2 id="page-title" className="text-3xl font-bold tracking-tight text-on-surface">{title}</h2>
        <p className="mt-3 text-base leading-7 text-secondary">{description}</p>
      </div>
    </section>
  )
}
