import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/initSupabase";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);

		return;
	}

	try {
		const { data, error } = await supabase
			.from("task_library")
			.select("*")
			.eq("uid", req.query.uid)
			.single();

		if (error) {
			console.error(error);
			res.status(500).json({ error: error.message });

			return;
		}

		res.status(200).json({
			status: "OK",
			message: `User ${data.uid} found`,
			data: data,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
}
