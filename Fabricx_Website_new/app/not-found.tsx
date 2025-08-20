import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#13191d] text-white flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#f2f827] mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#f2f827] text-[#13191d] font-semibold rounded-lg hover:bg-[#dadf23] transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
