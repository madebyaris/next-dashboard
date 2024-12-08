import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Welcome to Next.js Dashboard</h1>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left gap-4">
        <Link
          href="/login"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Login{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              &rarr;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Sign in to access your dashboard
          </p>
        </Link>

        <Link
          href="/signup"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Sign Up{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              &rarr;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Create a new account to get started
          </p>
        </Link>
      </div>
    </main>
  )
}
