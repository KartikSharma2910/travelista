import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MessageCircle,
  Shield,
  Target,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type NotificationType =
  | "booking"
  | "mission"
  | "message"
  | "reward"
  | "invoice"
  | "approval"
  | "system";

interface Notification {
  id: string;
  title: string;
  time: string;
  read: boolean;
  roles: string[];
  description: string;
  type: NotificationType;
}

const typeConfig: Record<
  NotificationType,
  { icon: React.ElementType; color: string }
> = {
  booking: {
    icon: Calendar,
    color: "text-primary bg-primary/10",
  },

  mission: {
    icon: Target,
    color: "text-chart-4 bg-chart-4/10",
  },

  message: {
    icon: MessageCircle,
    color: "text-chart-2 bg-chart-2/10",
  },

  reward: {
    icon: CheckCircle,
    color: "text-chart-3 bg-chart-3/10",
  },

  invoice: {
    icon: FileText,
    color: "text-accent bg-accent/10",
  },

  approval: {
    icon: Shield,
    color: "text-primary bg-primary/10",
  },

  system: {
    icon: Users,
    color: "text-muted-foreground bg-muted",
  },
};

const allNotifications: Notification[] = [];

const NotificationPanel = () => {
  const { userRole } = useAuth();

  const role = userRole || "traveler";

  const roleNotifications = useMemo(() => {
    return allNotifications.filter((n) => n.roles.includes(role));
  }, [role]);

  const [notifications, setNotifications] =
    useState<Notification[]>(roleNotifications);

  const [filter, setFilter] = useState<"all" | NotificationType>("all");

  useEffect(() => {
    setNotifications(roleNotifications);
  }, [roleNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    );
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              read: true,
            }
          : n
      )
    );
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const filtered = useMemo(() => {
    return filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);
  }, [filter, notifications]);

  const availableTypes = useMemo(() => {
    return Array.from(new Set(roleNotifications.map((n) => n.type)));
  }, [roleNotifications]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-4 w-4" />

          {unreadCount > 0 && (
            <span
              className="
              absolute -top-0.5 -right-0.5
              w-4 h-4
              bg-destructive
              rounded-full
              text-[9px]
              text-destructive-foreground
              flex items-center justify-center
              font-bold
              "
            >
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[380px] p-0">
        <div
          className="
          p-3 border-b border-border
          flex items-center justify-between
          "
        >
          <h3 className="font-semibold text-sm">
            Notifications
            <span
              className="
              ml-1.5 text-[10px]
              bg-primary/10 text-primary
              px-1.5 py-0.5
              rounded-full capitalize
              "
            >
              {role}
            </span>
          </h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="
              text-xs text-primary
              hover:underline
              "
            >
              Mark all read
            </button>
          )}
        </div>
        <div
          className="
          flex gap-1 px-3 pt-2 pb-1
          overflow-x-auto
          "
        >
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "text-[11px] px-2.5 py-1 rounded-full",

              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            All
          </button>
          {availableTypes.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "text-[11px] px-2.5 py-1 rounded-full",

                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <ScrollArea className="h-[340px]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No notifications
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {filtered.map((n) => {
                const cfg = typeConfig[n.type];
                const Icon = cfg.icon;
                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      "flex gap-3 p-2.5 rounded-lg cursor-pointer group",

                      !n.read ? "bg-primary/5" : "hover:bg-muted/50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",

                        cfg.color
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm leading-tight",

                          !n.read && "font-semibold"
                        )}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {n.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">
                          {n.time}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        dismiss(n.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPanel;
