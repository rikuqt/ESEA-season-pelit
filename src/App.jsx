import React, {useEffect, useState} from "react"
import axios from "axios"
import './App.css'

const Matchroom = ({}) => {
  <p> </p>
}

function App() {
    const [matchroom ,setMatchroom] = useState([])
    const [stats ,setStats] = useState([])
    const [loading, setLoading] = useState(true);


    const api_key = "3c7c45ce-12d8-4f53-af38-95b64a714dd5"
    const game_id = "1-30362d47-8878-4a6c-8af3-9e75ccfb9e69"
    const season_id = 51
    const league_id = "a14b8616-45b9-4581-8637-4dfd0b5f6af8"
    const match_url = `https://open.faceit.com/data/v4/matches/${game_id}/stats`
    const matchroom_url = `https://open.faceit.com/data/v4/matches/${game_id}`
   
    // faceit bearer token vahvistus
    const config = {
      headers: {Authorization: `Bearer ${api_key}`}
    }

    // Moneen apiin
    const fetchInfo = () => {
      const requestOne = axios.get(matchroom_url, config)
      const requestTwo = axios.get(match_url, config)
      // käytä rq2 sitten vasta kun api osoite toimii
      axios.all([requestOne, requestTwo])
        .then(axios.spread((responseOne, responseTwo) => {
          setMatchroom(responseOne.data),
          setStats(responseTwo.data),
          console.log(responseOne.data),
          console.log(responseTwo.data),
          setLoading(false)
        }))
      }

      useEffect(() => {
        fetchInfo()
      }, [])

  const Voittaja = () => {
    if ("1ce16320-21c5-4cfe-a4e1-1fcb599a2a35") {
      
    } else {

    }
  }
      
  if (loading) return <div>Ladataan tietoja...</div>;



  return (
    <div>
    <body className="center">
      <h1>Kausi: {matchroom.competition_name}</h1>
      <p>{stats.rounds[0].round_stats.Score}</p>
      <p><img src={matchroom.teams.faction1.avatar} className="Logo" /> {matchroom.teams.faction1.name} vs 
      {matchroom.teams.faction2.name} <img src={matchroom.teams.faction2.avatar} className="Logo" /></p>
      <p>Voittaja: {matchroom.teams.faction1.name}</p>
    </body>
    </div>
  )
}

export default App
