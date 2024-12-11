'use client';

import { useState } from 'react';
import { LogOut, Settings, UserCircle, ChevronDown } from 'lucide-react';
import { FancyButton } from '@/components/ui/fancy-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/user-context';
import { cn } from '@/lib/utils';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <FancyButton variant="dark">
            <div className="flex items-center gap-2">
              {user.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name || 'User'} 
                  className="w-6 h-6 rounded-full ring-1 ring-[rgb(255_255_255_/_8%)] shadow-inner"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[rgb(255_255_255_/_3%)] ring-1 ring-[rgb(255_255_255_/_8%)] flex items-center justify-center">
                  <UserCircle className="w-4 h-4 text-[hsl(0deg_0%_76%)]" />
                </div>
              )}
              <span className="text-sm">
                {user.name || 'Menu'}
              </span>
              <ChevronDown className={cn(
                "w-3.5 h-3.5 text-[hsl(0deg_0%_66%)] transition-transform duration-200",
                isOpen && "transform rotate-180"
              )} />
            </div>
          </FancyButton>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={cn(
          "w-64 p-2 mt-2",
          "bg-gradient-to-b from-[hsl(0deg_0%_12%)] to-[hsl(0deg_0%_8%)]",
          "border border-[rgb(255_255_255_/_5%)]",
          "shadow-[0_8px_32px_rgba(0,0,0,0.35)] rounded-lg",
          "backdrop-blur-sm backdrop-saturate-150",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
      >
        <div className="px-2 py-2 mb-1">
          <div className="flex items-center gap-3">
            {user.picture ? (
              <img 
                src={user.picture} 
                alt={user.name || 'User'} 
                className="w-10 h-10 rounded-full border border-[rgb(255_255_255_/_5%)] ring-1 ring-[rgb(255_255_255_/_8%)] shadow-inner"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[rgb(255_255_255_/_3%)] ring-1 ring-[rgb(255_255_255_/_8%)] flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-[hsl(0deg_0%_76%)]" />
              </div>
            )}
            <div className="flex flex-col">
              <p className="text-sm font-medium text-[hsl(0deg_0%_86%)]">{user.name}</p>
              <p className="text-xs text-[hsl(0deg_0%_46%)]">{user.email}</p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-[rgb(255_255_255_/_8%)] to-transparent mx-1" />
        <div className="p-1">
          <DropdownMenuItem 
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md",
              "text-xs text-[hsl(0deg_0%_76%)] hover:text-[hsl(0deg_0%_96%)]",
              "hover:bg-[rgb(255_255_255_/_4%)]",
              "cursor-pointer group",
              "transition-all duration-200 ease-out"
            )}
            onClick={() => router.push('/settings')}
          >
            <Settings className="w-3.5 h-3.5 group-hover:text-emerald-400 transition-colors" />
            <span>Settings & Preferences</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md mt-1",
              "text-xs text-red-400 hover:text-red-300",
              "hover:bg-[rgb(239_68_68_/_8%)]",
              "cursor-pointer group",
              "transition-all duration-200 ease-out"
            )}
          >
            <LogOut className="w-3.5 h-3.5 group-hover:text-red-300 transition-colors" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 