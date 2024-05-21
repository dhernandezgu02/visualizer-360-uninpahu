import { createRef } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/markers-plugin/index.css";
// import testImage from "../../assets/nodes/sede-frente-principal.jpeg";
import pinRed from "../../assets/pin-red.png";

const Image360 = ({ src }) => {
  const pSRef = createRef();

  const readyHandler = (instance) => {
    const markersPlugs = instance.getPlugin(MarkersPlugin);
    if (!markersPlugs) return;
    console.log(markersPlugs);
    markersPlugs.addEventListener("select-marker", () => {
      console.log("asd");
    });
  };

  const clickHandler = () => {};

  const plugins = [
    [
      MarkersPlugin,
      {
        // list of markers
        markers: [
          {
            // image marker that opens the panel when clicked
            id: "image",
            position: { yaw: "0.33deg", pitch: "0.1deg" },
            image: pinRed,
            anchor: "bottom center",
            size: { width: 32, height: 32 },
            tooltip: "Mountain peak. <b>Click me!</b>",
          },
          {
            // image marker rendered in the 3D scene
            id: "imageLayer",
            position: { yaw: "13.5deg", pitch: "-0.1deg" },
            image: pinRed,
            anchor: "bottom center",
            size: { width: 220, height: 220 },
            tooltip: "Image embedded in the scene",
          },
        ],
      },
    ],
  ];

  return (
    <div className="App">
      <ReactPhotoSphereViewer
        ref={pSRef}
        src={src}
        // src="../../assets/sede-frente-principal.jpeg"
        height="500px"
        width="500px"
        // littlePlanet={false}
        onClick={clickHandler}
        onReady={readyHandler}
        plugins={plugins}
      ></ReactPhotoSphereViewer>
    </div>
  );
};

export default Image360;
