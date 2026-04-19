import CurrencySwitcher from "@/components/CurrencySwitcher";
import NotificationPanel from "@/components/NotificationPanel";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const GlobalSearch = lazy(() => import("@/components/GlobalSearch"));

const navLinks = [
  { to: "/explore", label: "Explore" },
  { to: "/experiences", label: "Experiences" },
  { to: "/destinations", label: "Destinations" },
  { to: "/trips", label: "Trips", icon: Compass },
  { to: "/beta-wanderers", label: "🧭 Wanderers" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const { user, userRole, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const dashboardPath =
    userRole === "admin"
      ? "/dashboard/admin"
      : userRole === "host"
      ? "/dashboard/host"
      : "/dashboard/traveler";

  const userInitials = user?.user_metadata?.first_name
    ? `${user.user_metadata.first_name[0]}${
        user.user_metadata.last_name?.[0] || ""
      }`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  const handleSignOut = useCallback(async () => {
    await signOut();

    toast({
      title: "Signed out successfully",
    });

    navigate("/");
  }, [signOut, navigate, toast]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHome
          ? scrolled
            ? "bg-card/95 backdrop-blur-xl shadow-md"
            : "bg-transparent"
          : "bg-card/95 backdrop-blur-xl shadow-md border-b border-border"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-primary">
              Travelista
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive(link.to)
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.icon && <link.icon className="w-3.5 h-3.5" />}

                {link.label}
              </Link>
            ))}
            <Link
              to="/become-host"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive("/become-host")
                  ? "text-primary bg-primary/10"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Become a Host
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
            {searchOpen && (
              <Suspense fallback={null}>
                <GlobalSearch onClose={() => setSearchOpen(false)} />
              </Suspense>
            )}
            <ThemeToggle />
            <CurrencySwitcher />
            {user ? (
              <div className="flex items-center gap-2">
                <NotificationPanel />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-full gap-2 pl-1.5 pr-3 h-10"
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground hidden xl:block">
                        {user.user_metadata?.first_name || "Account"}
                      </span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">
                          {user.user_metadata?.first_name}{" "}
                          {user.user_metadata.last_name}
                        </p>

                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(dashboardPath)}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/signup">
                  <Button variant="ghost" className="rounded-full px-4">
                    Log In
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button className="rounded-full bg-primary px-6">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <CurrencySwitcher />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="lg:hidden bg-card/95 backdrop-blur-xl border-t border-border"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block py-2.5 px-3 text-sm font-medium rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
