import { Image, Layer, Rect, Stage, Text, Transformer } from "react-konva";

import Konva from "konva";
import React from "react";
import useImage from "use-image";

const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 600;

export const HolidayCard = React.forwardRef<HolidayCardRef, HolidayCardProps>(
  ({ backgroundColor, text, images }, ref) => {
    const [santa] = useImage("/santa.png");
    const trRef = React.useRef<any>();

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
        </Layer>
        <Layer ref={containerRef}>
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
  images: HTMLImageElement[];
}
