import { prisma } from "@/server/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function TargetHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = req.body;

    await prisma.jsonData.create({
      data: {
        json: JSON.stringify(data),
      },
    });

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json(error);
  }
}
