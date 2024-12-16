import { Dog, Heart, Calendar, MapPin, User, Home } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Dog Profiles", icon: Dog, url: "/profiles" },
  { title: "Health Records", icon: Heart, url: "/health" },
  { title: "Grooming", icon: Calendar, url: "/grooming" },
  { title: "Vet Directory", icon: MapPin, url: "/vets" },
  { title: "My Account", icon: User, url: "/account" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span className="flex items-center gap-2">
              <Dog className="w-6 h-6" />
              PawCare
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url} 
                      className="flex items-center gap-2"
                      data-active={location.pathname === item.url}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}