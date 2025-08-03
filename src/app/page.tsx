
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { logout } from "./auth/actions";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-900 text-white py-4 px-6 flex items-center justify-between">
        <div className="text-2xl font-bold">Audio Recorder</div>
        <div>
          {data.user ? (
            <form action={logout}>
              <button className="text-white hover:underline">Logout</button>
            </form>
          ) : (
            <>
              <Link href="/login" className="text-white hover:underline">Login</Link>
            </>
          )}
        </div>
      </header>
      <main className="flex-1 bg-gray-100 dark:bg-gray-800">
        <section className="py-20 px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">Welcome to Audio Recorder</h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Record, store, and manage your audio files with ease.</p>
          {data.user ? (
            <Link href="/dashboard" className="mt-8 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg">
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/login" className="mt-8 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg">
              Get Started
            </Link>
          )}
        </section>
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Features</h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Easy to Use</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">A simple and intuitive interface for recording and managing your audio files.</p>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Secure Storage</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Your audio files are stored securely in the cloud, accessible only by you.</p>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Cross-Platform</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Access your audio files from any device, anywhere in the world.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white py-4 px-6 text-center">
        <p>&copy; 2025 Audio Recorder. All rights reserved.</p>
      </footer>
    </div>
  );
}
