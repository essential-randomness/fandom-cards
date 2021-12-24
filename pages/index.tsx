import { HolidayCardProps, HolidayCardRef } from "./HolidayCard";

import Head from "next/head";
import type { NextPage } from "next";
import React from "react";
import dynamic from "next/dynamic";
import styles from "../styles/Home.module.css";
import useImage from "use-image";

const HolidayCard = dynamic<
  HolidayCardProps & { innerRef: React.ForwardedRef<HolidayCardRef> }
>(() => import("./HolidayCard").then((mod) => mod.HolidayCard), {
  ssr: false,
  loading: () => <div>loading</div>,
});

enum Modes {
  EDIT,
  PREVIEW,
  DISPLAY,
}

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
  const [textColor, setTextColor] = React.useState("#000000");
  const [fontSize, setFontSize] = React.useState(45);
  const [selectedBackground, setSelectedBackground] = React.useState<
    string | null
  >(null);
  const [backgroundColor, setBackgroundColor] = React.useState("#ff5252");
  const [currentMode, setCurrentMode] = React.useState(Modes.EDIT);

  return (
    <div className={styles.container}>
      <HolidayCard
        backgroundColor={backgroundColor}
        images={uploadedImages}
        text={textValue}
        textColor={textColor}
        fontSize={fontSize}
        backgroundUrl={selectedBackground}
        innerRef={cardHandler}
        maskContent={currentMode != Modes.EDIT}
      />
      <div className={styles.controls}>
        <h3>Settings</h3>
        <label>Message</label>
        <textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
        />
        <input
          type="range"
          min="10"
          max="100"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
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
            e.target.value = "";
          }}
        />
        <label>Background color</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
        <button
          className="background"
          onClick={() => setSelectedBackground("/christmas_background.jpg")}
        >
          <img src="/christmas_background.jpg" />
        </button>
        <button
          className="background"
          onClick={() => setSelectedBackground("/gold_background.jpg")}
        >
          <img src="/gold_background.jpg" />
        </button>
        <button
          className="background"
          onClick={() => setSelectedBackground("/gifts_pattern.jpg")}
        >
          <img src="/gifts_pattern.jpg" />
        </button>
        <button onClick={() => setSelectedBackground(null)}>
          Remove background
        </button>
        {currentMode == Modes.EDIT && (
          <button
            onClick={() => {
              setCurrentMode(Modes.PREVIEW);
            }}
          >
            Preview
          </button>
        )}
        {currentMode == Modes.PREVIEW && (
          <div>
            <button
              onClick={() => {
                setCurrentMode(Modes.EDIT);
              }}
            >
              Back to edit
            </button>
            <button
              onClick={() => {
                console.log(cardHandler.current);
                console.log(cardHandler.current?.getImageUrl());
                setCurrentMode(Modes.DISPLAY);
              }}
            >
              Send to friend!
            </button>
          </div>
        )}
      </div>
      <style jsx>{`
        .background img {
          max-width: 100px;
        }
      `}</style>
    </div>
  );
};

export default Home;
