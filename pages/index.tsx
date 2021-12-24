import { HolidayCardProps, HolidayCardRef } from "./HolidayCard";

import Head from "next/head";
import type { NextPage } from "next";
import React from "react";
import dynamic from "next/dynamic";
import styles from "../styles/Home.module.css";
import useImage from "use-image";

const HolidayCard = dynamic<
  HolidayCardProps & { ref: React.ForwardedRef<HolidayCardRef> }
>(() => import("./HolidayCard").then((mod) => mod.HolidayCard), {
  ssr: false,
  loading: () => <div>loading</div>,
});

const Home: NextPage = () => {
  const [bigBoss] = useImage("/bigboss.png");
  const [uploadedImages, setUploadedImages] = React.useState<
    HTMLImageElement[]
  >([]);

  const [bigBossPosition, setBigBossPosition] = React.useState({
    x: 450,
    y: 250,
  });
  const cardHandler = React.useRef<HolidayCardRef>(null);
  const outputRef = React.useRef<any>({});

  const [textValue, setTextValue] = React.useState("Merry Christmas!");
  const [backgroundColor, setBackgroundColor] = React.useState("#ff5252");

  return (
    <div className={styles.container}>
      <HolidayCard
        backgroundColor={backgroundColor}
        images={uploadedImages}
        text={textValue}
        ref={cardHandler}
      />
      <div className={styles.controls}>
        <h3>Settings</h3>
        <label>Message</label>
        <textarea
          // type="text"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />
        {uploadedImages.map((uploadedImage) => (
          <div key={uploadedImage.src} className={styles.imagesContainer}>
            <img src={uploadedImage.src} />
            <button
              onClick={() =>
                setUploadedImages(
                  uploadedImages.filter((img) => img.src != uploadedImage.src)
                )
              }
            >
              Remove
            </button>
          </div>
        ))}
        <label>Upload new image</label>
        <input
          type="file"
          onChange={(e) => {
            if (!e.target.files) {
              return;
            }
            const image = document.createElement("img");
            image.src = URL.createObjectURL(e.target.files[0]);
            setUploadedImages([...uploadedImages, image]);
          }}
        />
        <label>Background color</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
        <button
          onClick={() => {
            const result = document.createElement("img");
            result.src = cardHandler.current!.getImageUrl()!;
            outputRef.current.appendChild(result);
          }}
        >
          Save
        </button>
        <div ref={outputRef}>Output:</div>
      </div>
    </div>
  );
};

export default Home;
