export const workoutSongs = [
  {
    title: "Eye of the Tiger",
    artist: "Survivor",
    genre: "Rock",
    bpm: 109,
    spotifyUrl: "https://open.spotify.com/track/2KH16WveTQWT6KOG9Rg6e2"
  },
  {
    title: "Lose Yourself",
    artist: "Eminem",
    genre: "Hip Hop",
    bpm: 171,
    spotifyUrl: "https://open.spotify.com/track/5Z01UMMf7V1o0MzF86s6WJ"
  },
  {
    title: "Stronger",
    artist: "Kanye West",
    genre: "Hip Hop",
    bpm: 104,
    spotifyUrl: "https://open.spotify.com/track/4fzsfWzRhPawzqhX8Qt9F3"
  },
  {
    title: "Till I Collapse",
    artist: "Eminem ft. Nate Dogg",
    genre: "Hip Hop",
    bpm: 171,
    spotifyUrl: "https://open.spotify.com/track/4xkOaSrkexMciUUogZKVTS"
  },
  {
    title: "High Hopes",
    artist: "Panic at the Disco",
    genre: "Pop Rock",
    bpm: 100,
    spotifyUrl: "https://open.spotify.com/track/1rqqCSm0Qe4I9rUvWncaom"
  },
  {
    title: "Unstoppable",
    artist: "Sia",
    genre: "DanceElectronic",
    bpm: 146,
    spotifyUrl: "https://open.spotify.com/track/1yvMUkIOTeUNtNWlWRgANS?si=2f55aebc3cb14ec4"
  },
  {
    title: "Power",
    artist: "Kanye West",
    genre: "Hip Hop",
    bpm: 130,
    spotifyUrl: "https://open.spotify.com/track/2gZUPNdnz5Y45eiGxpHGSc"
  },
  {
    title: "Afrobeats and Amapiano workout song.",
    artist: "Rubber band nation",
    genre: "Ep",
    bpm: 150,
    spotifyUrl: "https://open.spotify.com/playlist/78KrIQfaNEQS4RN0pqHRXa?si=iFHXJSI_Q5GNr6gUUQ29kQ"
  },
  {
    title: "Thunderstruck",
    artist: "AC/DC",
    genre: "Rock",
    bpm: 133,
    spotifyUrl: "https://open.spotify.com/track/57bgtoPSgt236HzfBOd8kj"
  },
  {
    title: "We Will Rock You",
    artist: "Queen",
    genre: "Rock",
    bpm: 81,
    spotifyUrl: "https://open.spotify.com/track/4pbJqGIASGPr0ZpGpnWkDn"
  },
  {
    title: "Back in Black",
    artist: "AC/DC",
    genre: "Rock",
    bpm: 93,
    spotifyUrl: "https://open.spotify.com/track/08mG3Y1vljYA6bvDt4Wqkj"
  },
  {
    title: "Pump It",
    artist: "The Black Eyed Peas",
    genre: "Pop",
    bpm: 136,
    spotifyUrl: "https://open.spotify.com/track/2ygMBIctKIAfbEBcT9065L?si=c1a3abb38add493d"
  },
  {
    title: "Radioactive",
    artist: "Imagine Dragons",
    genre: "Rock",
    bpm: 136,
    spotifyUrl: "https://open.spotify.com/track/62yJjFtgkhUrXktIoSjgP2?si=b5e5684e712b493f"
  },
  {
    title: "Warriors",
    artist: "Imagine Dragons",
    genre: "Rock",
    bpm: 141,
    spotifyUrl: "https://open.spotify.com/track/1lgN0A2Vki2FTON5PYq42m"
  },
  {
    title: "Believer",
    artist: "Imagine Dragons",
    genre: "Pop Rock",
    bpm: 128,
    spotifyUrl: "https://open.spotify.com/track/0pqnGHJpmpxLKifKRmU6WP?si=99dfa2ed788a46aa"
  }
];

// Get songs by genre
export const getSongsByGenre = (genre) => {
  return workoutSongs.filter(song => song.genre.toLowerCase() === genre.toLowerCase());
};

// Get high energy songs (BPM > 120)
export const getHighEnergySongs = () => {
  return workoutSongs.filter(song => song.bpm > 120);
};

export default workoutSongs;