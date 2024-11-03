import React, {useEffect, useState} from "react"
import axios from "axios"
import './App.css'

function App() {
    const [matchroom ,setMatchroom] = useState([])
    const [league ,setLeague] = useState([])
    const [loading, setLoading] = useState(true);


    const api_key = "3c7c45ce-12d8-4f53-af38-95b64a714dd5"
    const game_id = "1-eec7b1a5-f0af-41a4-a86b-16ff2ecedd87"
    const season_id = 1
    const league_id = "cs2/league/ESEA%20League/a14b8616-45b9-4581-8637-4dfd0b5f6af8/e60308e0-fa19-4266-a509-aa68fcd512d9"
    const season_url = `https://open.faceit.com/data/v4/leagues/${league_id}`
    const matchroom_url = `https://open.faceit.com/data/v4/matches/${game_id}`
   
    // faceit bearer token vahvistus
    const config = {
      headers: {Authorization: `Bearer ${api_key}`}
    }

    // Moneen 
    const fetchInfo = () => {
      const requestOne = axios.get(matchroom_url, config)
      // const requestTwo = axios.get(season_url, config)
      // käytä rq2 sitten vasta kun api osoite toimii
      axios.all([requestOne])
        .then(axios.spread((responseOne) => {
          setMatchroom(responseOne.data),
          console.log(responseOne.data),
          setLoading(false)
        }))
      }

      useEffect(() => {
        fetchInfo()
      }, [])

  const Voittaja = () => {
    if (0==0) {

    }
  }
      
  if (loading) return <div>Ladataan tietoja...</div>;


  return (
    <div>
    <body className="center">
      <h1>Kausi: {matchroom.competition_name}</h1>
      <p><img src={matchroom.teams.faction1.avatar} className="Logo" /> {matchroom.teams.faction1.name} vs {matchroom.teams.faction2.name} <img src={matchroom.teams.faction2.avatar} className="Logo" /></p>
      <p>Voittaja: {matchroom.teams.faction1.name}</p>
    </body>
    </div>
  )
}

export default App
