import { createRef } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import "@photo-sphere-viewer/markers-plugin/index.css";
import pinRed from "../../assets/pin-red.png";
import "../../App.css";

const getMarker = ({ x, y, label, nodeIndex }) => ({
  id: `${nodeIndex}`,
  position: { yaw: `${x}deg`, pitch: `${y}deg` },
  image: pinRed,
  anchor: "bottom center",
  size: { width: 32, height: 32 },
  tooltip: `<b>${label}</b>`,
});

const Image360 = ({ initSrc, initMarkers, nodes }) => {
  const pSRef = createRef();

  const readyHandler = (instance) => {
    const markersPlugs = instance.getPlugin(MarkersPlugin);
    if (!markersPlugs) return;
    markersPlugs.addEventListener("select-marker", (markerData) => {
      const nextNode = nodes[+markerData.marker.config.id];
      pSRef.current.setPanorama(nextNode.imageUrl, { transition: false });
      if (nextNode.markers) {
        markersPlugs.setMarkers(nextNode.markers.map(getMarker));
      } else {
        markersPlugs.clearMarkers();
      }
    });
  };

  const plugins = [[MarkersPlugin, { markers: initMarkers.map(getMarker) }]];

  return (
    <div className="container">
      <ReactPhotoSphereViewer
        src={initSrc}
        plugins={plugins}
        ref={pSRef}
        height="500px"
        width="500px"
        onReady={readyHandler}
      />
    </div>
  );
};

export default Image360;
