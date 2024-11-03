import React, {useEffect, useState} from "react"
import axios from "axios"

function App() {
    const [matchroom ,setMatchroom] = useState([])
    const api_key = "3c7c45ce-12d8-4f53-af38-95b64a714dd5"
    const game_id = "1-eec7b1a5-f0af-41a4-a86b-16ff2ecedd87"
    const matchroom_url = `https://open.faceit.com/data/v4/matches/${game_id}`
   
    const config = {
      headers: {Authorization: `Bearer ${api_key}`}
    }
    const fetchMatchroom = () => {
      return axios.get(matchroom_url, config).then((res) => {
        console.log("data haettu")
        setMatchroom(res.data)
      })}

      useEffect(() => {
        fetchMatchroom()
        console.log(matchroom)
      }, [])

  const Voittaja = () => {
    if (0==0) {

    }
  }
      
    

  return (
    <div>
    <body>
      <h1>Kausi: {matchroom.competition_name}</h1>
      
      {matchroom.results && matchroom.results.winner && (
    <p>Voittaja: {matchroom.teams.faction1.name}</p>
)}
    </body>
    </div>
  )
}

export default App
