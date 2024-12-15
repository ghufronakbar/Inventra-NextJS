import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/constants";
import { Decoded } from "@/interface/response/Api";

type Data = {
  status: number;
  message: string;
  data: Decoded | null;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { auth } = req.query as { auth: string };
    if (!auth) {
      return res
        .status(401)
        .json({ status: 401, message: "Unauthorized", data: null });
    }

    jwt.verify(auth, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ status: 401, message: "Unauthorized", data: null });
      }
      if (decoded) {
        const dec = decoded as Decoded;
        return res.status(200).json({ status: 200, message: "OK", data: dec });
      } else {
        return res
          .status(401)
          .json({ status: 401, message: "Unauthorized", data: null });
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ status: 401, message: "Unauthorized", data: null });
  }
}
