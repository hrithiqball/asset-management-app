"use client";

import React, { useEffect, useState } from "react";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	Button,
	NavbarMenu,
	NavbarMenuItem,
	Link,
	DropdownTrigger,
	DropdownMenu,
	Dropdown,
	DropdownItem,
} from "@nextui-org/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
	LiaUserCogSolid,
	LiaUserTieSolid,
	LiaUserLockSolid,
} from "react-icons/lia";
import clientIcon from "../public/client-icon.svg";
import { BsSun } from "react-icons/bs";
import { RiMoonClearFill } from "react-icons/ri";
import { useTheme } from "next-themes";

export default function Navigation({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();

	const navLinks = [
		{ href: "/dashboard", label: "Dashboard" },
		{ href: "/asset", label: "Asset" },
		{ href: "/task", label: "Task" },
	];

	const user = {
		name: "Harith Iqbal",
		role: "supervisor",
		department: "Software",
		email: "harith@gmail.com",
		userId: "PET-0001",
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<Navbar
			disableAnimation={true}
			onMenuOpenChange={setIsMenuOpen}
			className="flex relative w-full items-center justify-between"
			maxWidth="full"
		>
			<NavbarContent justify="start">
				<NavbarMenuToggle
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
			</NavbarContent>
			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				{navLinks.map((link) => {
					const isCurrentPage = pathname === link.href;
					const ariaProps: { "aria-current"?: "page" } = isCurrentPage
						? { "aria-current": "page" }
						: {};

					return (
						<NavbarItem key={link.href} isActive={isCurrentPage}>
							<Link color="foreground" href={link.href} {...ariaProps}>
								{link.label}
							</Link>
						</NavbarItem>
					);
				})}
			</NavbarContent>
			<NavbarContent justify="end">
				<Button
					isIconOnly
					onClick={() => {
						setTheme(theme === "dark" ? "light" : "dark");
					}}
				>
					{theme === "dark" ? <RiMoonClearFill /> : <BsSun />}
				</Button>
				<Dropdown placement="bottom-end">
					<DropdownTrigger>
						<Button
							variant="ghost"
							size="sm"
							endContent={
								<>
									{user.role === "admin" && <LiaUserLockSolid size={25} />}
									{(user.role === "supervisor" || user.role === "manager") && (
										<LiaUserTieSolid size={25} />
									)}
									{(user.role === "maintainer" || user.role === "worker") && (
										<LiaUserCogSolid size={25} />
									)}
								</>
							}
						>
							{user.name}
						</Button>
					</DropdownTrigger>
					<DropdownMenu aria-label="Profile Actions" variant="flat">
						<DropdownItem key="profile" className="h-14 gap-2">
							<p className="font-semibold">zoey@example.com</p>
						</DropdownItem>
						<DropdownItem key="settings">My Settings</DropdownItem>
						<DropdownItem key="logout" color="danger">
							{children}
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarContent>
			<NavbarMenu>
				{navLinks.map((item) => {
					const isCurrentPage = pathname === item.href;
					const linkColor = isCurrentPage ? "primary" : "foreground";

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
			</NavbarMenu>
		</Navbar>
	);
}
