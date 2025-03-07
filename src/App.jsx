import React, {useEffect, useState} from "react"
import axios from "axios"
import './App.css'

  
  const Button = ({text, onClick}) => <button onClick={onClick}>{text}</button>

  // HAE TIEDOT KOSKA PELI ALKAA
  function timeConverter(pelin_aika){
    var a = new Date(pelin_aika * 1000);
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
    return <div className="boxi">
      <h2>Tuleva peli: </h2>
      <h1>{competition}</h1>
      <p className="jeejee"><img src={fc1_avatar} className="Logo" /> {fc1_name} vs {fc2_name} <img src={fc2_avatar} className="Logo" /></p>
      <p>Pelin ajoitus: {timeConverter(aika)}</p>
      </div>
  }

  const LastGame = ({mapinKuva_osoite, competition, score, fc1_avatar, fc2_avatar,
    fc1_name, fc2_name, fc1_id, kaitonki_id, winner_id, show, toggleShow, Statsit2}) => {
    let winner
    if (fc1_id!==kaitonki_id && kaitonki_id!==winner_id) {
      winner=fc1_name
    } else {
      winner=fc2_name
    }

    return <div  style={{backgroundImage: `url(${mapinKuva_osoite})`}} className="boxi">
      <h2>Viimeisin peli: </h2>
      <h1>{competition}</h1>
      <p className="jeejee">{score}</p> <p className="jeejee"><img src={fc1_avatar} className="Logo" /> {fc1_name} vs {fc2_name} <img src={fc2_avatar} className="Logo" /></p>
      <p>Voittaja: {winner} 
      </p>
      <Button onClick={() => toggleShow(!show)}
      text={show ? "Piilota statsit" : "Näytä statsit"}>
      </Button>
      {show && Statsit2()}
      </div>
  }


function App() {
    const [matchroom ,setMatchroom] = useState([])
    const [stats ,setStats] = useState([])
    const [upComingMatch ,setUpComingMatch] = useState([])
    const [loading, setLoading] = useState(true);
    const [show, toggleShow] = useState(false)

    // Api key + 
    const api_key = import.meta.env.VITE_FACEIT_API
    const game_id = "1-5cb0778d-8900-478a-b250-a49a1af261af"
    const upcoming_game_id = "1-71628d2c-011c-42ee-8199-80e20ad7e2fc"
    const matchStats_url = `https://open.faceit.com/data/v4/matches/${game_id}/stats`
    const matchroom_url = `https://open.faceit.com/data/v4/matches/${game_id}`
    const up_coming_matchroom_url = `https://open.faceit.com/data/v4/matches/${upcoming_game_id}`


    // faceit bearer token vahvistus
    const config = {
      headers: {Authorization: `Bearer ${api_key}`}
    }

    // Haetaan data 3 eri pyynnöllä -> tuleva peli, viimeisin peli ja matsin statsit
    const fetchInfo = () => {
      const requestOne = axios.get(matchroom_url, config)
      const requestTwo = axios.get(matchStats_url, config)
      const requestThree = axios.get(up_coming_matchroom_url, config)

      axios.all([requestOne, requestTwo, requestThree])
        .then(axios.spread((responseOne, responseTwo, responseThree) => {
          setMatchroom(responseOne.data),
          setStats(responseTwo.data),
          setUpComingMatch(responseThree.data),
          console.log("Mennyt peli:", responseOne.data),
          console.log("Tuleva peli:", responseThree.data),
          console.log("Matsin statsit", responseTwo.data)
          console.log("kaikki data haettu"),
          setLoading(false)
        }))
      }
      
      useEffect(() => {
        fetchInfo()
      }, [])

      if (loading) return <div>Ladataan tietoja...</div>;


      /*
        Muuttujat mitä tarvitaan ja nimetty paremmin selkeydeksi  
      */

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

    


      // Tarvittavat muuttujat
      const roundScore = stats.rounds[0].round_stats.Score
      const kaitonki_id = "1ce16320-21c5-4cfe-a4e1-1fcb599a2a35"
      const tulevaPeli_aika = upComingMatch.scheduled_at
      


      
  // Haku pelin mapin kuvalle + ei toimi app:n ulkopuolella -> async kusee
      function MapinKuva () {
        let mapinKuva_id = "" // muuta tätä jälkeenpäin
        matchroom.voting.map.entities.forEach(mappi => {
          if (mappi.game_map_id == matchroom.voting.map.pick[0]){
            mapinKuva_id = mappi.image_lg
          } 
        })
      return mapinKuva_id
    }


    // Pelaajien statsit
    function Statsit2(){
      const pelaajienStatsit = Kaitonki()
      pelaajienStatsit.sort((a, b) => b.player_stats.ADR - a.player_stats.ADR) // ADR mukaan scoreboard järjestys
      return(
        <table className="p">
        {pelaajienStatsit.map((pelaaja) => (
          <div>
          <tr key={pelaaja.id}>{pelaaja.nickname} {pelaaja.player_stats.Kills}/{pelaaja.player_stats.Deaths} ADR: {pelaaja.player_stats.ADR}</tr>
          </div>
        ))}
      </table>
      )
    }

    // Kumpi tiimi kaitonki on
    function Kaitonki() {
      let kaitonkiStatsit
      if (stats.rounds[0].teams[0].team_id == kaitonki_id) {
        return kaitonkiStatsit = stats.rounds[0].teams[0].players
      } else {
        return kaitonkiStatsit = stats.rounds[0].teams[1].players
      }
    }


  return (
    <div>
    <body>
      
      <UpcomingGame 
      competition={upComingGame_competition_type}
      fc1_avatar={upComingGame_fc1_avatar}
      fc2_avatar={upComingGame_fc2_avatar}
      fc1_name={upComingGame_fc1_name}
      fc2_name={upComingGame_fc2_name}
      aika={tulevaPeli_aika}/>

      <LastGame 
      mapinKuva_osoite={MapinKuva()}
      competition={LastGame_competition_type}
      score={roundScore}
      fc1_avatar={LastGame_fc1_avatar}
      fc2_avatar={LastGame_fc2_avatar}
      fc1_name={LastGame_fc1_name}
      fc2_name={LastGame_fc2_name}
      fc1_id={LastGame_fc1_id}
      kaitonki_id={kaitonki_id}
      winner_id={LastGame_winner_id}
      show={show} 
      toggleShow={toggleShow}
      Statsit2={Statsit2}/>

    </body>
    </div>
    )
  }

export default App