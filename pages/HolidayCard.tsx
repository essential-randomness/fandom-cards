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
    return { newWidth: 0, newHeight: 0 };
  }
  var widthRatio = containerWidth / width,
    heightRatio = containerHeight / height;
  var bestRatio = Math.max(widthRatio, heightRatio);
  var newWidth = width * bestRatio,
    newHeight = height * bestRatio;
  return { newWidth, newHeight };
}

const HolidayCardWithRef = React.forwardRef<HolidayCardRef, HolidayCardProps>(
  (
    {
      backgroundColor,
      text,
      textColor,
      fontSize,
      images,
      backgroundUrl,
      maskContent,
    },
    ref
  ) => {
    const [santa] = useImage("/sexy_santa.png");
    const [sexySantaMask] = useImage("/sexy_santa_mask.png");
    const trRef = React.useRef<any>();
    const [backgroundImage, setBackgroundImage] =
      React.useState<HTMLImageElement | null>(null);

    const [selectedImage, setSelectedImage] =
      React.useState<HTMLImageElement | null>(null);
    const imageRefs = React.useRef<{ [key: string]: typeof Image }>({});
    const containerRef = React.useRef<Konva.Layer>(null);
    const textRef = React.useRef<Konva.Text>(null);
    const stageRef = React.useRef<any>(null);

    const [textDimension, setTextDimension] = React.useState({
      width: 0,
      height: 0,
    });

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

    React.useEffect(() => {
      if (!textRef.current) {
        return;
      }
      const lineAmounts = text.split("\n").length;
      const textSize = textRef.current.measureSize(text);

      setTextDimension({
        width: textSize.width,
        height: textSize.height * lineAmounts,
      });
    }, [text]);

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
              alt="The card background"
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
          {maskContent && (
            <Group globalCompositeOperation={"destination-in"}>
              <Image
                x={0}
                y={0}
                image={sexySantaMask}
                listening={false}
              ></Image>
            </Group>
          )}
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
            fontSize={fontSize}
            fontFamily="Comic Sans MS"
            listening={false}
            x={STAGE_WIDTH / 2}
            y={
              textDimension.height > 0
                ? STAGE_HEIGHT / 2 - textDimension.height / 2
                : STAGE_HEIGHT / 2
            }
            fill={textColor}
            ref={textRef}
          />
        </Layer>
      </Stage>
    );
  }
);
HolidayCardWithRef.displayName = "HolidayCardForwardRef";

export const HolidayCard: React.FC<
  HolidayCardProps & { innerRef: React.ForwardedRef<HolidayCardRef> }
> = (props) => {
  return <HolidayCardWithRef {...props} ref={props.innerRef} />;
};
export interface HolidayCardRef {
  getImageUrl: () => string | undefined;
}
export interface HolidayCardProps {
  text: string;
  textColor: string;
  fontSize: number;
  backgroundColor: string;
  backgroundUrl: string | null;
  images: HTMLImageElement[];
  maskContent: boolean;
}
