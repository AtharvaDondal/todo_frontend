import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="flex flex-col min-h-screen items-center justify-center text-center bg-gray-100">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Welcome to the Todo App
        </h1>
        <p className="mb-10 text-lg text-gray-600 max-w-xl">
          Please{" "}
          <span className="font-semibold text-blue-600">log in</span> to manage
          your todos. If you are new,{" "}
          <span className="font-semibold text-purple-600">register</span> first
          and then log in.
        </p>
        <nav className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 w-full max-w-lg">
          <Link
            href="/login"
            className="bg-green-500 text-white text-2xl font-semibold py-6 px-8 rounded-lg shadow-lg flex items-center justify-center transition hover:bg-green-600"
          >
            🔑 Login
          </Link>
          <Link
            href="/register"
            className="bg-purple-500 text-white text-2xl font-semibold py-6 px-8 rounded-lg shadow-lg flex items-center justify-center transition hover:bg-purple-600"
          >
            📝 Register
          </Link>
        </nav>
      </main>
    </>
  );
}
