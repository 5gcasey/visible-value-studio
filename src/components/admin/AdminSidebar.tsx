import {
  LayoutDashboard, CalendarDays, Users, Search, Building2,
  Scale, FileText, MessageSquare, AlertTriangle, Mail, Settings, LogOut, Circle,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/use-auth";
import { useCityConfig } from "@/hooks/use-data";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Meetings", url: "/admin/meetings", icon: CalendarDays },
  { title: "Officials", url: "/admin/officials", icon: Users },
  { title: "Issues", url: "/admin/issues", icon: Search },
  { title: "Developers", url: "/admin/developers", icon: Building2 },
  { title: "GRAMA Requests", url: "/admin/grama", icon: Scale },
  { title: "Reports", url: "/admin/reports", icon: FileText },
  { title: "Community Posts", url: "/admin/community", icon: MessageSquare },
  { title: "Alerts", url: "/admin/alerts", icon: AlertTriangle },
  { title: "Subscribers", url: "/admin/subscribers", icon: Mail },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { user, signOut } = useAuth();
  const { data: config } = useCityConfig();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="bg-primary px-4 py-4">
        {!collapsed && (
          <>
            <span className="text-sm font-bold tracking-wide text-primary-foreground">
              Open Cities Admin
            </span>
            <span className="text-xs text-primary-foreground/60">
              {config?.city_name}, {config?.city_state_abbr}
            </span>
          </>
        )}
        {collapsed && (
          <span className="text-xs font-bold text-primary-foreground">OC</span>
        )}
      </SidebarHeader>

      <SidebarContent className="bg-primary">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                      activeClassName="border-l-2 border-accent bg-primary-foreground/10 text-primary-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 text-accent" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-primary px-4 py-3">
        {!collapsed && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-primary-foreground/60">
              <Circle className="h-2.5 w-2.5 fill-green-400 text-green-400" />
              System healthy
            </div>
            <p className="truncate text-xs text-primary-foreground/50">
              {user?.email}
            </p>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-xs text-primary-foreground/60 hover:text-primary-foreground"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        )}
        {collapsed && (
          <button onClick={signOut} className="text-primary-foreground/60 hover:text-primary-foreground">
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
