import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Compass, Home, Map, MessageCircle, User } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/explore", icon: Compass, label: "Explore" },
  { to: "/trips", icon: Map, label: "Trips" },
  {
    to: "/community",
    icon: MessageCircle,
    label: "Messages",
  },
  {
    to: "/profile",
    icon: User,
    label: "Profile",
  },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const { user, userRole } = useAuth();

  const dashboardPath = useMemo(() => {
    return userRole === "admin"
      ? "/dashboard/admin"
      : userRole === "host"
      ? "/dashboard/host"
      : "/dashboard/traveler";
  }, [userRole]);

  const getProfileLink = () => (user ? dashboardPath : "/signup");

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    if (path === "/profile") {
      return (
        location.pathname.startsWith("/dashboard") ||
        location.pathname === "/signup"
      );
    }

    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="
      fixed bottom-0 left-0 right-0 z-50
      lg:hidden
      bg-card/95 backdrop-blur-xl
      border-t border-border
      pb-safe
      "
    >
      <div
        className="
        flex items-center justify-around
        h-14 px-2
        "
      >
        {navItems.map((item) => {
          const to = item.to === "/profile" ? getProfileLink() : item.to;
          const active = isActive(item.to);

          return (
            <Link
              key={item.label}
              to={to}
              aria-label={item.label}
              className={cn(
                "flex flex-col items-center justify-center",

                "gap-0.5 w-16 py-1 rounded-lg",

                "transition-all duration-200",

                "active:scale-95",

                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",

                  active && "stroke-[2.5]"
                )}
              />
              <span
                className="
                text-[10px]
                font-medium
                "
              >
                {item.label}
              </span>

              {active && (
                <div
                  className="
                  w-4 h-0.5
                  bg-primary
                  rounded-full
                  "
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
