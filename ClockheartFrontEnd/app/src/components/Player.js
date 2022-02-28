import React, { Suspense } from 'react';
import { useFrame, useLoader } from "@react-three/fiber"
import { Vector3, TextureLoader, Raycaster, DoubleSide } from "three";

const Player = ({ playerTargets,setPlayerTargets, mesh }) => {
 
  const raycaster = new Raycaster();

  useFrame(() => {

    //loading textures can take time, the mesh will not be defined until the textues is loaded
    if (mesh.current == undefined)
      return;

    const speed = .1
    let direction = new Vector3();
    
    direction.subVectors(playerTargets[1], mesh.current.position)
    const rayStart = new Vector3(mesh.current.position.x, mesh.current.position.y, mesh.current.position.z);    
    raycaster.set(rayStart, new Vector3(0, -1, 0), 20);
    const intersects = raycaster.intersectObjects(mesh.current.parent.children)//using all atm, could optimise
    
    //catching re render, only ground plane loads before another re-render. Re-renders twice because of two state sets (fix?)
    // if(intersects.length <=1)
    //   return

    for (let i = 0; i < intersects.length; i++) {
    
      if(intersects[i].object.name == "Collision"){
     
        let newPlayerTargets = playerTargets
        newPlayerTargets[1].x = mesh.current.position.x
        newPlayerTargets[1].y = mesh.current.position.y
        newPlayerTargets[1].z = mesh.current.position.z

        setPlayerTargets(newPlayerTargets)
        return        
      }      
   
      if (intersects[i].object.name == "GroundPlane") {
         
        //amended target flattens y levels
          const amendedTarget = new Vector3(playerTargets[1].x, mesh.current.position.y, playerTargets[1].z)
          //snap the plyer to its final position, but only do this if it doesn't already equal it - stops re renders
        if (!mesh.current.position.equals( playerTargets[1] )&& mesh.current.position.distanceTo(amendedTarget) < speed) {
          //set the target position to the position we got to          
          setPlayerTargets([mesh.current.position,mesh.current.position])

          return;
        }

        //re-use direction variable
        direction.subVectors(playerTargets[1],mesh.current.position)
        // set direction to unit vector
        direction.normalize()
        // now we can choose the length of the movement (speed)
        direction.multiplyScalar(speed, 0, speed);
        //set the mesh position - has to be done on each axis individually
        mesh.current.position.x += direction.x;
        mesh.current.position.y = 5; //player layer is always 5
        mesh.current.position.z += direction.z;

        //don't look for other collision, jump out of for loop
        break
      }     
   }

   //flip texture if travelling left
   if(direction.x < 0)
     mesh.current.rotation.y = Math.PI
  });

  function TexturedPlane({ url }) {
    const texture = useLoader(TextureLoader, ...url);

    return (
      <mesh name='playerMesh' ref={mesh}  position={playerTargets[0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeBufferGeometry attach="geometry" args={[1, 2]} />
        <meshStandardMaterial map={texture} transparent={true} side={DoubleSide}/>
      </mesh>
    );
  };

  //Suspense tag is needed because TextureLoader needs it (async)
  return (
    <>
      <Suspense fallback={null}>
        <TexturedPlane url={["/redguy.png"]} />
      </Suspense>
    </>
  )
};

export default Player;