// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { nanoid } from "nanoid";
import pool from "../../db/pool";

type Data = {
  url: string;
  image: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "POST") {
      if (!req.body || !req.body.image) {
        res.status(400).end();
        return;
      }
      const uploadId = nanoid();
      await pool.none(
        `INSERT INTO CARDS(url, image) 
         VALUES ($/url/, $/image/);`,
        {
          url: uploadId,
          image: req.body.image,
        }
      );
      res.status(200).json({ url: uploadId, image: req.body.image });
      return;
    } else if (req.method === "GET") {
      console.log(req.query);
      if (!req.query || !req.query.cardId) {
        res.status(400).end();
        return;
      }
      const cardResult = await pool.one(
        `SELECT * FROM cards WHERE url = $/url/`,
        {
          url: req.query.cardId,
        }
      );
      res
        .status(200)
        .json({ url: req.query.cardId as string, image: cardResult.image });
      return;
    }
    res.status(400).end();
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};
