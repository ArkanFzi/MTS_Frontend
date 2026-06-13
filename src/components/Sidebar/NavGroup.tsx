// src/components/layout/Sidebar/NavGroup.tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import type { NavItem } from "./navigationConfig";

interface NavGroupProps {
  label: string;
  items: NavItem[];
  isExpanded: boolean;
  onNavigate: () => void;
  groupIndex: number;
  onOpenSidebar?: () => void;
}

export default function NavGroup({
  label,
  items,
  isExpanded,
  onNavigate,
  groupIndex,
  onOpenSidebar,
}: NavGroupProps) {
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isExpanded && onOpenSidebar) {
      onOpenSidebar();
      setOpenDropdowns((prev) => ({ ...prev, [name]: true }));
      return;
    }
    setOpenDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <nav className="flex flex-col gap-1.5">
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:max-h-10 lg:opacity-100 lg:mb-1 ${
          isExpanded ? "max-h-10 opacity-100 mb-1" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 truncate block">
          {label}
        </span>
      </div>

      {items.map((item, index) => {
        const globalIndex = groupIndex * 6 + index;
        const delayStyle = { transitionDelay: isExpanded ? `${globalIndex * 35}ms` : "0ms" };
        const hasChildren = !!item.children;
        const isOpen = !!openDropdowns[item.name];

        if (hasChildren) {
          return (
            <div key={item.name} className="flex flex-col gap-1">
              <button
                onClick={(e) => toggleDropdown(item.name, e)}
                className={`group relative flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-300 lg:justify-start lg:gap-3 lg:w-full ${
                  isExpanded ? "justify-start gap-3 w-full" : "justify-center"
                } ${
                  isOpen
                    ? "bg-[#0B0B0C] text-[#D4AF37] border border-[#2A2A2C]"
                    : "text-gray-400 hover:text-[#F0F0F0] hover:bg-[#0B0B0C]/50"
                }`}
              >
                {item.icon}
                <div
                  style={delayStyle}
                  className={`overflow-hidden transition-all duration-500 ease-in-out flex-1 flex items-center justify-between lg:max-w-full lg:opacity-100 lg:translate-x-0 lg:visible ${
                    isExpanded ? "max-w-full opacity-100 translate-x-0 visible" : "max-w-0 opacity-0 -translate-x-4 invisible"
                  }`}
                >
                  <span className="truncate text-xs block whitespace-nowrap ml-3 text-left">{item.name}</span>
                  <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform duration-300 mr-1 ${isOpen ? "rotate-180 text-[#D4AF37]" : ""}`} />
                </div>

                {!isExpanded && (
                  <div className="absolute left-full ml-4 hidden max-lg:group-hover:flex items-center z-[9999] pointer-events-none top-1/2 -translate-y-1/2 drop-shadow-2xl">
                    <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-[#111112]"></div>
                    <div className="bg-[#111112] text-zinc-200 text-[11px] font-normal px-3 py-1.5 rounded border border-[#2A2A2C] whitespace-nowrap">{item.name}</div>
                  </div>
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out flex flex-col gap-1 pl-7 border-l border-zinc-800/50 ml-5 ${
                  isOpen && isExpanded ? "max-h-40 opacity-100 mt-1 mb-1" : "max-h-0 opacity-0 pointer-events-none"
                }`}
              >
                {item.children?.map((child) => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-1.5 rounded text-[11px] font-medium transition-all duration-200 ${
                        isActive ? "text-[#D4AF37] font-semibold bg-[#111112]" : "text-gray-500 hover:text-zinc-200"
                      }`
                    }
                  >
                    <span className="truncate">{child.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          );
        }

        return (
          <NavLink
            key={item.path}
            to={item.path!}
            end={item.path === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-300 lg:justify-start lg:gap-3 lg:w-full ${
                isExpanded ? "justify-start gap-3 w-full" : "justify-center"
              } ${isActive ? "bg-[#0B0B0C] text-[#D4AF37] border border-[#2A2A2C]" : "text-gray-400 hover:text-[#F0F0F0] hover:bg-[#0B0B0C]/50"}`
            }
          >
            {item.icon}
            <div
              style={delayStyle}
              className={`overflow-hidden transition-all duration-500 ease-in-out flex-1 lg:max-w-full lg:opacity-100 lg:translate-x-0 lg:visible ${
                isExpanded ? "max-w-full opacity-100 translate-x-0 visible" : "max-w-0 opacity-0 -translate-x-4 invisible"
              }`}
            >
              <span className="truncate text-xs block whitespace-nowrap ml-3">{item.name}</span>
            </div>

            {!isExpanded && (
              <div className="absolute left-full ml-4 hidden max-lg:group-hover:flex items-center z-[9999] pointer-events-none top-1/2 -translate-y-1/2 drop-shadow-2xl">
                <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-[#111112]"></div>
                <div className="bg-[#111112] text-zinc-200 text-[11px] font-normal px-3 py-1.5 rounded border border-[#2A2A2C] whitespace-nowrap">{item.name}</div>
              </div>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}