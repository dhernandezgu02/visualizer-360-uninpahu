import { useEffect, useState } from "react";
import "./App.css";
import { Image360 } from "./components";
import imagesService from "./services/images";
function App() {
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [nodes, setNodes] = useState([]);
  useEffect(() => {
    //aca se simula el llamado del back que retorna el listado de nodos apartir de un origen y un destino
    const backResponse = [
      { nodeName: "sede-principal", nextNodeCoordinates: { x: 0.1, y: 0.1 } },
      { nodeName: "carrera-16-40a", nextNodeCoordinates: { x: 0.1, y: 0.1 } },
      {
        nodeName: "sede-administrativa",
        nextNodeCoordinates: { x: 0.1, y: 0.1 },
      },
    ];
    const completeNodes = backResponse.map((node) => ({
      ...node,
      imageUrl: imagesService[node.nodeName],
    }));
    setNodes(completeNodes);
  }, []);

  return (
    <div className="App">
      <Image360 src={nodes} />
    </div>
  );
}

export default App;
