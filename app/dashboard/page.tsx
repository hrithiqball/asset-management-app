import Navigation from "@/components/Navigation";
import SignOutItem from "@/components/SignOutItem";
import Dashboard from "@/components/Dashboard";
import { readUserInfo } from "@/utils/actions/route";

export default async function DashboardPage() {
	const userInfo = await readUserInfo();

	return (
		<div className="flex flex-col h-screen">
			<Navigation user={userInfo}>
				<SignOutItem />
			</Navigation>
			<Dashboard />
		</div>
	);
}
