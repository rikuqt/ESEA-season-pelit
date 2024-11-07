import React, {useEffect, useState} from "react"
import axios from "axios"
import './App.css'

  // HAE TIEDOT KOSKA PELI ALKAA
  function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu','Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = '0'+ a.getMinutes();
    var sec = '0'+ a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

const UpcomingGame = ({competition, fc1_avatar, fc2_avatar, fc1_name, fc2_name, aika}) => {
  return <div className="center">
    <h2>Tuleva peli: </h2>
    <h1>{competition}</h1>
    <p className="jeejee"><img src={fc1_avatar} className="Logo" /> {fc1_name} vs {fc2_name} <img src={fc2_avatar} className="Logo" /></p>
    <p>Pelin ajoitus: {timeConverter(aika)}</p>
    </div>
}

const GameDefault = ({competition, score, fc1_avatar, fc2_avatar, fc1_name, fc2_name, fc1_id, kaitonki_id, winner_id}) => {
  let winner
  if (!fc1_id==kaitonki_id && !kaitonki_id==winner_id) {
    winner=fc1_name
  } else {
    winner=fc2_name
  }

  return <div className="center">
    <h2>Viimeisin peli: </h2>
    <h1>{competition}</h1>
    <p>{score}</p> <p className="jeejee"><img src={fc1_avatar} className="Logo" /> {fc1_name} vs {fc2_name} <img src={fc2_avatar} className="Logo" /></p>
    <p>Voittaja: {winner} <form action="https://stackoverflow.com/questions/2906582/how-do-i-create-an-html-button-that-acts-like-a-link"><input type="submit" value="Lataa demo"/></form>
    </p>
    </div>
}


function App() {
    const [matchroom ,setMatchroom] = useState([])
    const [stats ,setStats] = useState([])
    const [upComingMatch ,setUpComingMatch] = useState([])
    const [loading, setLoading] = useState(true);
    const tulevaPeli_aika = 1731006000


  

    // Api key + 
    const api_key = "3c7c45ce-12d8-4f53-af38-95b64a714dd5"
    const game_id = "1-d9823f78-a875-4470-9837-d42609fa3cdd"
    const upcoming_game_id = "1-5cb0778d-8900-478a-b250-a49a1af261af"
    const matchStats_url = `https://open.faceit.com/data/v4/matches/${game_id}/stats`
    const matchroom_url = `https://open.faceit.com/data/v4/matches/${game_id}`
    const up_coming_matchroom_url = `https://open.faceit.com/data/v4/matches/${upcoming_game_id}`


    // faceit bearer token vahvistus
    const config = {
      headers: {Authorization: `Bearer ${api_key}`}
    }

    // Moneen apiin
    const fetchInfo = () => {
      const requestOne = axios.get(matchroom_url, config)
      const requestTwo = axios.get(matchStats_url, config)
      const requestThree = axios.get(up_coming_matchroom_url, config)

      axios.all([requestOne, requestTwo, requestThree])
        .then(axios.spread((responseOne, responseTwo, responseThree) => {
          setMatchroom(responseOne.data),
          setStats(responseTwo.data),
          setUpComingMatch(responseThree.data)
          console.log(responseOne.data),
          console.log(responseThree.data),
          console.log("kaikki data haettu")
          setLoading(false)
        }))
      }
      
      useEffect(() => {
        fetchInfo()
      }, [])

      if (loading) return <div>Ladataan tietoja...</div>;

      // Pelattu peli
      const {
        teams: {
          faction1: { faction_id: LastGame_fc1_id, name: LastGame_fc1_name, avatar: LastGame_fc1_avatar },
          faction2: { name: LastGame_fc2_name, avatar: LastGame_fc2_avatar }
        },
        results: { winner: LastGame_winner_id },
        competition_name: LastGame_competition_type
      } = matchroom;

      // Tuleva peli
      const {
        teams: {
          faction1: { name: upComingGame_fc1_name, avatar: upComingGame_fc1_avatar },
          faction2: { name: upComingGame_fc2_name, avatar: upComingGame_fc2_avatar }
        },
        competition_name: upComingGame_competition_type
      } = upComingMatch;
      
      

      // Fillteri mapin kuvalle (kesken)
      const mapinKuva = () => {
        const pickattu_mappi = matchroom.voting.map.pick[0]
        console.log(pickattu_mappi)
        const filtteri = matchroom.voting.map.entities.filter(pelattuMappi => ``.includes(pickattu_mappi))

      }
     

      const roundScore = stats.rounds[0].round_stats.Score
      const kaitonki_id = "1ce16320-21c5-4cfe-a4e1-1fcb599a2a35"

    



  return (
    <div>
    <body>
      <UpcomingGame competition={upComingGame_competition_type} fc1_avatar={upComingGame_fc1_avatar} fc2_avatar={upComingGame_fc2_avatar} fc1_name={upComingGame_fc1_name} fc2_name={upComingGame_fc2_name} aika={tulevaPeli_aika}/>
      <GameDefault competition={LastGame_competition_type} score={roundScore} fc1_avatar={LastGame_fc1_avatar} fc2_avatar={LastGame_fc2_avatar}
      fc1_name={LastGame_fc1_name} fc2_name={LastGame_fc2_name} fc1_id={LastGame_fc1_id} kaitonki_id={kaitonki_id} winner_id={LastGame_winner_id}/>   
      </body>
    </div>
  )
}

export default App
