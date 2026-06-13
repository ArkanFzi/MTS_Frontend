// src/components/layout/Sidebar/AppSidebar.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, LogIn, UserPlus, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "../../store/useAuthStore";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { logoutUser } from "../../features/Auth/F3_Logout/api";
import { toast } from "sonner";

// Import pecahan modul kita di sini 🚀
import NavGroup from "./NavGroup";
import { exploreItems, moderatorItems, adminItems, getUserItems } from "./navigationConfig";

export default function AppSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
      logout();
      toast.success("Logged out successfully.");
      navigate("/login");
    },
    onError: () => {
      queryClient.clear();
      logout();
      navigate("/login");
    },
  });

  const isModerator = user?.roles?.some((r) => r === "moderator" || r === "admin");
  const isAdmin = user?.roles?.some((r) => r === "admin");

  // Tarik data menu user lewat generator function
  const userItems = getUserItems(user?.id);

  const filteredModeratorItems = isAdmin
    ? moderatorItems.filter((item) => item.path !== "/moderator/tag-category")
    : moderatorItems;

  const roleBadge = isAdmin
    ? { label: "Admin", color: "bg-red-950/50 text-red-400 border-red-900" }
    : isModerator
      ? { label: "Mod", color: "bg-blue-950/50 text-blue-400 border-blue-900" }
      : user
        ? { label: "User", color: "bg-[#1A1A1C] text-gray-400 border-[#2A2A2C]" }
        : null;

  const closeMobileSidebar = () => {
    if (window.innerWidth < 1024) setIsExpanded(false);
  };

  return (
    <>
      {/* Backdrop Mobile */}
      <div
        onClick={() => setIsExpanded(false)}
        className={`fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 ease-in-out lg:hidden ${
          isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div className="w-[68px] min-w-[68px] lg:w-[250px] lg:min-w-[250px] h-screen sticky top-0 bg-transparent flex-shrink-0 z-50">
        <aside
          className={`h-screen bg-[#161618] border-r border-[#2A2A2C] flex flex-col p-4 font-['Inter'] transition-all duration-300 ease-in-out lg:fixed lg:left-0 lg:top-0 lg:w-[250px] ${
            isExpanded ? "fixed left-0 top-0 w-[250px] z-50 shadow-2xl shadow-black/80" : "absolute left-0 top-0 w-[68px]"
          }`}
        >
          {/* HEADER */}
          <div
            onClick={() => { if (window.innerWidth < 1024) setIsExpanded(!isExpanded); }}
            className={`flex items-center h-10 px-1 mb-4 select-none flex-shrink-0 lg:justify-between ${isExpanded ? "justify-between" : "justify-center"}`}
          >
            <div className={`w-full items-center justify-between lg:flex ${isExpanded ? "flex" : "hidden"}`}>
              <div className="text-xl font-bold text-[#D4AF37] tracking-tight truncate">
                <span>Mau Tanya Suhu</span>
              </div>
              <X className="h-4 w-4 text-gray-400 hover:text-white lg:hidden cursor-pointer" />
            </div>
            <div className={`p-1.5 rounded text-gray-400 hover:text-white lg:hidden ${!isExpanded ? "block" : "hidden"}`}>
              <Menu className="h-5 w-5 text-[#D4AF37]" />
            </div>
          </div>

          {/* USER INFO PANEL */}
          {user && (
            <div
              className={`flex items-center py-1.5 mb-6 rounded-lg bg-[#0B0B0C]/40 border border-[#2A2A2C]/40 w-full flex-shrink-0 transition-all duration-300 lg:px-2 lg:gap-3 ${
                isExpanded ? "px-2 gap-3 justify-start" : "justify-center"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className={`items-center justify-between flex-1 min-w-0 lg:flex ${isExpanded ? "flex ml-1" : "hidden"}`}>
                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-xs font-medium text-white truncate max-w-[100px]">{user.username}</span>
                  <span className="text-[10px] text-gray-500">Lv.{user.level || 1}</span>
                </div>
                {roleBadge && (
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ml-auto ${roleBadge.color}`}>
                    {roleBadge.label}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* SCROLLABLE MENU SCENE */}
          <div className="flex flex-col gap-6 flex-1 overflow-y-auto pr-1 tm-scrollbar">
            <NavGroup label="Explore" items={exploreItems} isExpanded={isExpanded} onNavigate={closeMobileSidebar} groupIndex={0} />
            
            {user && (
              <NavGroup label="My Space" items={userItems} isExpanded={isExpanded} onOpenSidebar={() => setIsExpanded(true)} onNavigate={closeMobileSidebar} groupIndex={1} />
            )}
            
            {isModerator && (
              <NavGroup label="Moderation" items={filteredModeratorItems} isExpanded={isExpanded} onOpenSidebar={() => setIsExpanded(true)} onNavigate={closeMobileSidebar} groupIndex={2} />
            )}
            
            {isAdmin && (
              <NavGroup label="Administration" items={adminItems} isExpanded={isExpanded} onOpenSidebar={() => setIsExpanded(true)} onNavigate={closeMobileSidebar} groupIndex={3} />
            )}
          </div>

          {/* FOOTER ACTIONS (LOGOUT / AUTH) */}
          <div className="mt-auto pt-4 flex-shrink-0 border-t border-[#2A2A2C]/30">
            {user ? (
              <Button
                variant="outline"
                className={`border-red-900 text-red-400 hover:bg-red-950/30 hover:text-red-300 text-xs h-9 bg-transparent transition-all duration-300 lg:w-full ${isExpanded ? "w-full px-4" : "w-9 p-0"}`}
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                title="Logout"
              >
                <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
                <div className={`overflow-hidden transition-all duration-300 lg:max-w-full lg:opacity-100 lg:ml-2 ${isExpanded ? "max-w-full opacity-100 ml-2" : "max-w-0 opacity-0"}`}>
                  <span className="whitespace-nowrap">{logoutMutation.isPending ? "..." : "Logout"}</span>
                </div>
              </Button>
            ) : (
              <div className={`bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg flex flex-col transition-all duration-300 lg:p-3 lg:gap-2 ${isExpanded ? "p-3 gap-2" : "p-1 gap-1"}`}>
                <Button variant="outline" className={`border-[#2A2A2C] text-[#F0F0F0] hover:bg-[#161618] text-xs h-8 bg-transparent transition-all duration-300 lg:w-full ${isExpanded ? "w-full px-3" : "w-9 p-0"}`} onClick={() => { navigate("/login"); setIsExpanded(false); }} title="Login">
                  <LogIn className="h-3.5 w-3.5 flex-shrink-0" />
                  <div className={`overflow-hidden transition-all duration-300 lg:max-w-full lg:opacity-100 lg:ml-2 ${isExpanded ? "max-w-full opacity-100 ml-2" : "max-w-0 opacity-0"}`}><span className="whitespace-nowrap">Login</span></div>
                </Button>
                <Button className={`bg-[#D4AF37] text-black hover:bg-[#c29f2f] text-xs font-bold tracking-tight h-8 transition-all duration-300 lg:w-full ${isExpanded ? "w-full px-3" : "w-9 p-0"}`} onClick={() => { navigate("/register"); setIsExpanded(false); }} title="Register">
                  <UserPlus className="h-3.5 w-3.5 flex-shrink-0" />
                  <div className={`overflow-hidden transition-all duration-300 lg:max-w-full lg:opacity-100 lg:ml-2 ${isExpanded ? "max-w-full opacity-100 ml-2" : "max-w-0 opacity-0"}`}><span className="whitespace-nowrap">Register</span></div>
                </Button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}