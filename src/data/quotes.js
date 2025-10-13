export const motivationalQuotes = [
  {
    quote: "The only bad workout is the one that didn't happen.",
    author: "Unknown"
  },
  {
    quote: "Success starts with self-discipline.",
    author: "Unknown"
  },
  {
    quote: "Your body can stand almost anything. It's your mind you have to convince.",
    author: "Unknown"
  },
  {
    quote: "The pain you feel today will be the strength you feel tomorrow.",
    author: "Unknown"
  },
  {
    quote: "Don't wish for it. Work for it.",
    author: "Unknown"
  },
  {
    quote: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
    author: "Rikki Rogers"
  },
  {
    quote: "The difference between try and triumph is a little umph.",
    author: "Marvin Phillips"
  },
  {
    quote: "Wake up with determination. Go to bed with satisfaction.",
    author: "Unknown"
  },
  {
    quote: "You don't have to be extreme, just consistent.",
    author: "Unknown"
  },
  {
    quote: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  },
  {
    quote: "The hard days are what make you stronger.",
    author: "Aly Raisman"
  },
  {
    quote: "Push yourself because no one else is going to do it for you.",
    author: "Unknown"
  },
  {
    quote: "Fall in love with taking care of yourself.",
    author: "Unknown"
  },
  {
    quote: "Your health is an investment, not an expense.",
    author: "Unknown"
  },
  {
    quote: "A one hour workout is 4% of your day. No excuses.",
    author: "Unknown"
  },
  {
    quote: "Sweat is magic. Cover yourself in it daily to grant your wishes.",
    author: "Unknown"
  },
  {
    quote: "The clock is ticking. Are you becoming the person you want to be?",
    author: "Greg Plitt"
  },
  {
    quote: "Making excuses burns zero calories per hour.",
    author: "Unknown"
  },
  {
    quote: "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    author: "Christian D. Larson"
  },
  {
    quote: "The body achieves what the mind believes.",
    author: "Unknown"
  }
];

// Function to get a random quote
export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};

export default motivationalQuotes;