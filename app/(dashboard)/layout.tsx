import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import Link from "next/link";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-gray-100 border-b-2 border-transparent hover:border-gray-600 transition-colors"
    >
      {children}
    </Link>
  );
}

async function DashboardNav({ userName }: { userName: string | null }) {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center px-2 text-xl font-bold text-gray-100"
            >
              Experiment Manager
            </Link>
            <div className="ml-6 flex space-x-8">
              <NavLink href="/">Dashboard</NavLink>
              <NavLink href="/experiments">Experiments</NavLink>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-400 mr-4">{userName}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirect: true, redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="text-sm text-gray-400 hover:text-gray-200"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardNav userName={session.user?.name || session.user?.email || null} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
