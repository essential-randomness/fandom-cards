// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  url: string;
  image: string;
};

const image =

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    // TODO: here we'll save the data
    res.status(200).json({ url: "abcdef", image });
    return;
  } else if (req.method === "GET") {
    console.log(req.query);
    res.status(200).json({ url: "abcdef", image });
    return;
  }
  res.status(400).end();
}