import {
  Group,
  Image,
  Layer,
  Rect,
  Stage,
  Text,
  Transformer,
} from "react-konva";

import Konva from "konva";
import React from "react";
import useImage from "use-image";

const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 600;

function getScaledImageCoordinates({
  containerHeight,
  containerWidth,
  width,
  height,
}: {
  containerWidth: number;
  containerHeight: number;
  width: number;
  height: number;
}) {
  if (width == 0 || height == 0) {
    console.log("removing width and height");
    return { newWidth: 0, newHeight: 0 };
  }
  var widthRatio = containerWidth / width,
    heightRatio = containerHeight / height;
  var bestRatio = Math.max(widthRatio, heightRatio);
  var newWidth = width * bestRatio,
    newHeight = height * bestRatio;
  console.log(newWidth, newHeight);
  console.log("returning width and height");
  return { newWidth, newHeight };
}

export const HolidayCard = React.forwardRef<HolidayCardRef, HolidayCardProps>(
  ({ backgroundColor, text, images, backgroundUrl }, ref) => {
    const [santa] = useImage("/sexy_santa.png");
    const [sexySantaMask] = useImage("/sexy_santa_mask.png");
    const trRef = React.useRef<any>();
    const [backgroundImage, setBackgroundImage] =
      React.useState<HTMLImageElement | null>(null);

    const [selectedImage, setSelectedImage] =
      React.useState<HTMLImageElement | null>(null);
    const imageRefs = React.useRef<{ [key: string]: typeof Image }>({});
    const containerRef = React.useRef<Konva.Layer>(null);
    const stageRef = React.useRef<any>(null);

    React.useImperativeHandle(ref, () => ({
      getImageUrl: () =>
        stageRef.current?.toDataURL({
          pixelRatio: 2, // or other value you need
        }),
    }));

    React.useEffect(() => {
      if (!selectedImage) {
        trRef.current?.nodes([]);
        trRef.current?.getLayer().batchDraw();
        return;
      }
      trRef.current?.nodes([imageRefs.current[selectedImage.src]]);
      trRef.current?.getLayer().batchDraw();
    }, [selectedImage]);

    React.useEffect(() => {
      if (selectedImage && !images.includes(selectedImage)) {
        setSelectedImage(null);
        trRef.current?.nodes([]);
        trRef.current?.getLayer().batchDraw();
      }
    }, [images, selectedImage]);

    React.useEffect(() => {
      if (!backgroundUrl) {
        setBackgroundImage(null);
        return;
      }
      const backgroundImage = document.createElement("img");
      backgroundImage.src = backgroundUrl;
      backgroundImage.onload = () => {
        setBackgroundImage(backgroundImage);
      };
    }, [backgroundUrl]);

    return (
      <Stage
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        onClick={() => {
          if (!containerRef.current || !stageRef.current) {
            return;
          }
          const toBeSelected = containerRef.current.getIntersection(
            stageRef.current.getPointerPosition()!
          );
          console.log(toBeSelected);
          if (toBeSelected && "image" in toBeSelected) {
            setSelectedImage(
              ((toBeSelected as Konva.Image).image() as HTMLImageElement) ||
                null
            );
          } else {
            setSelectedImage(null);
          }
        }}
        ref={stageRef}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={STAGE_WIDTH}
            height={STAGE_HEIGHT}
            fill={backgroundColor}
          />
          {backgroundImage && (
            <Image
              image={backgroundImage}
              width={
                getScaledImageCoordinates({
                  containerWidth: STAGE_WIDTH,
                  containerHeight: STAGE_HEIGHT,
                  width: backgroundImage.width,
                  height: backgroundImage.height,
                }).newWidth
              }
              height={
                getScaledImageCoordinates({
                  containerWidth: STAGE_WIDTH,
                  containerHeight: STAGE_HEIGHT,
                  width: backgroundImage.width,
                  height: backgroundImage.height,
                }).newHeight
              }
            />
          )}
        </Layer>
        <Layer ref={containerRef}>
          <Group>
            {images.map((image, index) => {
              return (
                <Image
                  key={index}
                  width={100}
                  height={100}
                  //   onClick={() => setSelectedImage(image)}
                  image={image}
                  // isSelected={true}
                  draggable
                  // onDragEnd={(e) => {
                  //   setBigBossPosition({ x: e.target.x(), y: e.target.y() });
                  // }}
                  alt="big boss' sweet face"
                  ref={(shapeRef) => {
                    // @ts-ignore
                    imageRefs.current[image.src] = shapeRef!;
                  }}
                />
              );
            })}
          </Group>
          {/* <Group globalCompositeOperation={"destination-in"}>
            <Image x={0} y={0} image={sexySantaMask} listening={false}></Image>
          </Group> */}
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
        <Layer>
          <Image x={0} y={0} image={santa} listening={false} />
          <Text
            text={text}
            fontSize={45}
            fontFamily="Comic Sans MS"
            listening={false}
            x={STAGE_WIDTH / 2}
            y={STAGE_HEIGHT / 2 - 50}
          />
        </Layer>
      </Stage>
    );
  }
);
HolidayCard.displayName = "HolidayCardForwardRef";

export interface HolidayCardRef {
  getImageUrl: () => string | undefined;
}
export interface HolidayCardProps {
  text: string;
  backgroundColor: string;
  backgroundUrl: string | null;
  images: HTMLImageElement[];
}
