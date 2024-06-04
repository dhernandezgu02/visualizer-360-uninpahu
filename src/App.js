import { useState } from "react";
import "./App.css";
import { Image360 } from "./components";
import imagesService from "./services/images";
import logo from "./assets/logo.png"; // Asegúrate de tener un logo en la carpeta 'src'

const predefinedNodes = {
  ADMINISTRATIVE_BUILDING_MAIN_ENTRANCE:
    "Edificio Administrativo - Entrada Principal",
  MAIN_BUILDING_MAIN_ENTRANCE: "Edificio Principal - Entrada Principal",
  OTHER_BUILDING_MAIN_ENTRANCE: "Otro Edificio - Entrada Principal",
  STREETS_CARRERA_16_40A: "Calle Carrera 16 #40A",
  // Agrega más nodos según sea necesario
};

function App() {
  const [nodes, setNodes] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (origin && destination) {
      try {
        const response = await fetch(
          "https://scrapingweb.pythonanywhere.com/calcular_ruta",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ origen: origin, destino: destination }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("API Response Data:", data); // Log para verificar la estructura de la respuesta

          if (Array.isArray(data.ruta_mas_corta)) {
            const completeNodes = data.ruta_mas_corta.map((node, i) => ({
              ...node,
              imageUrl: imagesService[node.nodeName],
              ...(node.nextNodeCoordinates && {
                markers: [
                  {
                    x: node.nextNodeCoordinates.x,
                    y: node.nextNodeCoordinates.y,
                    label: data.ruta_mas_corta[i + 1]?.nodeName || "",
                    nodeIndex: i + 1,
                  },
                ],
              }),
            }));

            console.log("Complete Nodes:", completeNodes); // Log para depuración
            setNodes(completeNodes);
            setIsViewerVisible(true);
            setError("");
          } else {
            console.error(
              "La propiedad ruta_mas_corta no es un arreglo:",
              data
            );
            setError("La propiedad ruta_mas_corta no es un arreglo");
          }
        } else {
          const errorMessage = await response.text();
          console.error("Error al obtener la ruta del backend:", errorMessage);
          setError(`Error al obtener la ruta del backend: ${errorMessage}`);
        }
      } catch (error) {
        console.error("Error al realizar la petición:", error);
        setError(`Error al realizar la petición: ${error.message}`);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="App-content">
        <div className="select-container">
          <label htmlFor="origin">Origen: </label>
          <select
            id="origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          >
            <option value="">Seleccione el punto de origen</option>
            {Object.keys(predefinedNodes).map((node) => (
              <option key={node} value={node}>
                {predefinedNodes[node]}
              </option>
            ))}
          </select>

          <label htmlFor="destination">Destino: </label>
          <select
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="">Seleccione el punto de destino</option>
            {Object.keys(predefinedNodes).map((node) => (
              <option key={node} value={node}>
                {predefinedNodes[node]}
              </option>
            ))}
          </select>
        </div>
        <button className="search-button" onClick={handleSearch}>
          Buscar
        </button>

        {error && <div className="error">{error}</div>}

        {isViewerVisible && nodes.length > 0 && (
          <div className="Image360-container">
            <Image360
              initSrc={nodes[0].imageUrl}
              initMarkers={nodes[0].markers || []} // Asegura que los markers no sean undefined
              nodes={nodes}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
