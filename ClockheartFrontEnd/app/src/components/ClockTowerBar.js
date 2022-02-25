import GroundPlane from './GroundPlane'
import React, { useEffect, useState } from 'react'
import Music from './Music'
import Shop from './Shop'
import QuestGiver from './QuestGiver'
const ClockTowerBar= ({updatePlayerTarget, playerMesh, shopOpen, setShopOpen, questGiverOpen,setQuestGiverOpen}) => {

    useEffect( () => 
    {

    }, [])
    
    return(
        <>
            <GroundPlane updatePlayerTarget={updatePlayerTarget} colour={"grey"}/>

            <Shop shopOpen={shopOpen} setShopOpen={setShopOpen} playerMesh={playerMesh} updatePlayerTarget={updatePlayerTarget}/>

            <QuestGiver questGiverOpen={questGiverOpen} setQuestGiverOpen={setQuestGiverOpen} playerMesh={playerMesh} updatePlayerTarget={updatePlayerTarget}/>

            <Music url={"/SteampunkAmbience.mp3"} soundLevel={0.03}/>
            
        </>
    )
}

export default ClockTowerBar;