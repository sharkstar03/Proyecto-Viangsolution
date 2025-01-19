//src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  FileSignature,
  Users,
  Settings,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Facturas', href: '/facturas', icon: FileText },
  { name: 'Cotizaciones', href: '/cotizaciones', icon: FileSignature },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900/80"
          onClick={onClose}
        />

        {/* Sidebar Panel */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex h-16 items-center justify-between px-6">
              <span className="text-2xl font-bold">Logo</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                        isActive
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )
                    }
                  >
                    <item.icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          {/* Header */}
          <div className="flex h-16 items-center px-6">
            <span className="text-2xl font-bold">Logo</span>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )
                  }
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default Sidebar;