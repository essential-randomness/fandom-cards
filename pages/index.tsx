// { Image, Layer, Rect, Stage }
import Head from "next/head";
import { HolidayCard } from "./HolidayCard";
import type { NextPage } from "next";
import React from "react";
import styles from "../styles/Home.module.css";
import useImage from "use-image";

const Home: NextPage = () => {
  const [bigBoss] = useImage("/bigboss.png");
  const [uploadedImages, setUploadedImages] = React.useState<
    HTMLImageElement[]
  >([]);

  const [bigBossPosition, setBigBossPosition] = React.useState({
    x: 450,
    y: 250,
  });

  const [textValue, setTextValue] = React.useState("Merry Christmas!");
  const [backgroundColor, setBackgroundColor] = React.useState("#ff5252");

  return (
    <div className={styles.container}>
      <HolidayCard
        backgroundColor={backgroundColor}
        images={uploadedImages}
        text={textValue}
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
            console.log(e);
            console.log(e.target.files);
            console.log(URL.createObjectURL(e.target.files[0]));
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
      </div>
    </div>
  );
};

export default Home;
