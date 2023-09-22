import { supabase } from "@/lib/initSupabase";
import { uidAsset } from "@/models/asset";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "DELETE") {
		res.setHeader("Allow", ["DELETE"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
		return;
	}

	try {
		const result = uidAsset.safeParse(req.body);

		if (!result.success) {
			res.status(400).json({
				message: result.error.issues.map((issue) => issue.message).join(", "),
			});
		} else {
			const { data, error } = await supabase
				.from("asset")
				.delete()
				.eq("uid", result.data.uid)
				.single();

			if (error) {
				res.status(418).json({
					message: error.message,
					details: error.details,
					hint: error.hint,
					code: error.code,
				});
				return;
			}

			res.status(200).json({
				status: "OK",
				message: `Asset ${req.body.uid} has been deleted`,
				data: data,
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
