'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { LuUser, LuSun, LuMoonStar } from 'react-icons/lu';
import { useTheme } from 'next-themes';
import clientIcon from '@/public/image/client-icon.svg';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { User } from 'lucide-react';
import Link from 'next/link';

export default function Navigation() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <NavigationMenu className="flex relative w-full items-center justify-between">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/dashboard" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/asset" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Asset
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/task" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Task
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      {/* <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="pr-8 sm:hidden"
        />
        <NavbarBrand>
          <Image
            priority
            src={clientIcon}
            alt="Petronas Logo"
            className="w-6 mr-3"
          />
          <p className="font-bold text-inherit">AMS</p>
        </NavbarBrand>
      </NavbarContent> */}
      {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navLinks.map(link => {
          const isCurrentPage =
            pathname === link.href || pathname.startsWith(link.href);
          const ariaProps: { 'aria-current'?: 'page' } = isCurrentPage
            ? { 'aria-current': 'page' }
            : {};

          return (
            <NavbarItem key={link.href} isActive={isCurrentPage}>
              <Link
                color={isCurrentPage ? 'primary' : 'foreground'}
                href={link.href}
                {...ariaProps}
              >
                {link.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent> */}
      {/* <NavbarContent justify="end">
        <Button
          isIconOnly
          onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark');
          }}
        >
          {theme === 'dark' ? <LuMoonStar /> : <LuSun />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <User />
              {session?.user?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent aria-label="Profile Actions">
            <DropdownMenuGroup>
              <DropdownMenuItem>{session?.user?.name}</DropdownMenuItem>
              <DropdownMenuItem>{session?.user?.email}</DropdownMenuItem>
              <DropdownMenuItem>My Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </NavbarContent> */}
      {/* <NavbarMenu>
        {navLinks.map(item => {
          const isCurrentPage = pathname === item.href;
          const linkColor = isCurrentPage ? 'primary' : 'foreground';

          return (
            <NavbarMenuItem key={item.href}>
              <Link
                color={linkColor}
                className="w-full"
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu> */}
    </NavigationMenu>
  );
}
