import type { NextPage } from "next";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
const CardDisplay: NextPage<{ cardId: string }> = () => {
  const router = useRouter();

  const { data } = useQuery(["card", router.query.cardId], () => {
    if (!router.query.cardId) {
      return null;
    }
    console.log(router.query.cardId);
    return fetch(`/api/card?cardId=${router.query.cardId}`).then((res) =>
      res.json()
    );
  });

  return <div>{data?.image && <img src={data.image} />}</div>;
};

export default CardDisplay;
