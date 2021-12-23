import React from "react";
import useImage from "use-image";

const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 600;

export const HolidayCard = React.forwardRef(
  ({ backgroundColor, text, images }: HolidayCardProps, ref) => {
    const [Konva, setKonva] = React.useState<
      typeof import("react-konva") | null
    >(null);
    const [santa] = useImage("/santa.png");
    const trRef = React.useRef<any>();

    const [selectedImage, setSelectedImage] =
      React.useState<HTMLImageElement | null>(null);
    const imageRefs = React.useRef<any>({});
    const containerRef = React.useRef<any>({});
    const stageRef = React.useRef<any>({});

    React.useImperativeHandle(ref, () => ({
      getImageUrl: () =>
        stageRef.current.toDataURL({
          pixelRatio: 2, // or other value you need
        }),
    }));

    React.useEffect(() => {
      import("react-konva").then((Konva) => {
        setKonva(Konva);
      });
    }, []);

    React.useEffect(() => {
      if (!selectedImage) {
        trRef.current?.nodes([]);
        trRef.current?.getLayer().batchDraw();
        return;
      }
      trRef.current?.nodes([imageRefs.current[selectedImage.src]]);
      trRef.current?.getLayer().batchDraw();
    }, [selectedImage]);

    if (!Konva) {
      return <div>Loading...</div>;
    }
    return (
      <Konva.Stage
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        onClick={() => {
          const toBeSelected = containerRef.current.getIntersection(
            stageRef.current.getPointerPosition()
          );
          console.log(toBeSelected);
          if (toBeSelected) {
            console.log("setting selected image", toBeSelected.getImage());
            setSelectedImage(toBeSelected.getImage());
          } else {
            setSelectedImage(null);
          }
        }}
        ref={stageRef}
      >
        <Konva.Layer>
          <Konva.Rect
            x={0}
            y={0}
            width={STAGE_WIDTH}
            height={STAGE_HEIGHT}
            fill={backgroundColor}
          />
        </Konva.Layer>
        <Konva.Layer ref={containerRef}>
          {images.map((image, index) => {
            return (
              <Konva.Image
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
                  imageRefs.current[image.src] = shapeRef;
                }}
              />
            );
          })}
          <Konva.Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Konva.Layer>
        <Konva.Layer>
          <Konva.Image x={0} y={0} image={santa} listening={false} />
          <Konva.Text
            text={text}
            fontSize={45}
            fontFamily="Comic Sans MS"
            listening={false}
            x={STAGE_WIDTH / 2}
            y={STAGE_HEIGHT / 2 - 50}
          />
        </Konva.Layer>
      </Konva.Stage>
    );
  }
);
HolidayCard.displayName = "HolidayCardForwardRef";

interface HolidayCardProps {
  text: string;
  backgroundColor: string;
  images: HTMLImageElement[];
}
