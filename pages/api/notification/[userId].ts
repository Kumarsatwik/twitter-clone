import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid ID");
    }

    const notifications = await prisma?.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    await prisma?.user.update({
      where: {
        id: userId,
      },
      data: {
        hasNotifications: false,
      },
    });

    return res.status(200).json(notifications);

    // const {currentUser}=await serverAuth(req,res)
  } catch (err) {
    console.log(err);
    return res.status(400).end();
  }
}
