import { useEffect, useState } from 'react';
import './App.css';
import { Image360 } from './components';
import imagesService from './services/images';

// const imagesCoordinates = {
//   'sede-principal': {
//     'carrera-16-40a': { x: 0, y: 0 },
//     'sede-frente-principal': { x: 10, y: 11 }
//   }
// };

function App() {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    //aca se simula el llamado del back que retorna el listado de nodos apartir de un origen y un destino
    const backResponse = [
      { nodeName: 'sede-principal', nextNodeCoordinates: { x: 0, y: 0 } },
      { nodeName: 'sede-frente-principal', nextNodeCoordinates: { x: -180, y: -10 } },
      { nodeName: 'carrera-16-40a', nextNodeCoordinates: { x: 10, y: 10 } },
      { nodeName: 'sede-administrativa' }
    ];
    const completeNodes = backResponse.map((node, i) => ({
      ...node,
      imageUrl: imagesService[node.nodeName],
      ...(node.nextNodeCoordinates && {
        markers: [
          {
            x: node.nextNodeCoordinates.x,
            y: node.nextNodeCoordinates.y,
            label: backResponse[i + 1]?.nodeName || '',
            nodeIndex: i + 1
          }
        ]
      })
    }));
    setNodes(completeNodes);
  }, []);

  const isViewerVisible = nodes.length > 0;

  return (
    <div className='App'>
      {isViewerVisible && <Image360 initSrc={nodes[0].imageUrl} initMarkers={nodes[0].markers} nodes={nodes} />}
    </div>
  );
}

export default App;
