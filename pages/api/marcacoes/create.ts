import type { NextApiRequest, NextApiResponse } from "next";

type Data = { message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "POST") {
    const { servico, barbeiro, data, hora } = req.body;

    if (!servico || !barbeiro || !data || !hora) {
      return res.status(400).json({ message: "Campos obrigatórios em falta" });
    }

    try {
      // Aqui você pode salvar no Supabase, Prisma, MongoDB, etc.
      // Exemplo simples:
      console.log("Nova marcação:", { servico, barbeiro, data, hora });

      return res.status(200).json({ message: "Marcação registada com sucesso!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao salvar marcação" });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
