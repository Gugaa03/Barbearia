import { supabase } from "../../lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.from("clientes").select("*");
  console.log({ data, error });
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}
