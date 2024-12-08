import { Link, Outlet } from "react-router-dom";
import { Button } from '@/components/ui/button'
// import { ThemeToggle } from './theme-toggle';
import { AvatarDropDown } from "./avatar-dropdown";

export default function MenuBar({ isLoggedIn = false, userEmail = '' }: { isLoggedIn?: boolean, userEmail?: string }) {

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-10 items-center">
          <div className="mr-4 hidden md:flex">
            <Link to={`/`} className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">MyApp</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center">
              {isLoggedIn ? (
                <AvatarDropDown userEmail={userEmail} />
              ) : (
                <div className="flex items-center space-x-2 mb-2">
                  <Button variant="ghost" asChild>
                    <Link to={`login`}>Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link to={`signup`}>Sign Up</Link>
                  </Button>
                </div>
              )}
              {/* <ThemeToggle /> */}
            </nav>
          </div>
        </div>
      </header>
      <div className="mt-4">
        <Outlet />
      </div>
    </>
  )
}