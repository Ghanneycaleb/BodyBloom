import { useState, useEffect } from "react";
import { getRandomQuote } from "../data/quotes";
import { workoutSongs, getHighEnergySongs } from "../data/songs";
import MotivationCard from "../components/motivation/MotivationCard";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { Quote, Flame, Headphones, Lightbulb, Music } from "lucide-react";

const Motivation = () => {
  const [dailyQuote, setDailyQuote] = useState(null);
  const [showAllSongs, setShowAllSongs] = useState(false);

  useEffect(() => {
    // Get a random quote on component mount
    setDailyQuote(getRandomQuote());
  }, []);

  const handleNewQuote = () => {
    setDailyQuote(getRandomQuote());
  };

  const displayedSongs = showAllSongs
    ? workoutSongs
    : getHighEnergySongs().slice(0, 6);

  return (
    <div>
        {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Daily Motivation
          </h1>
        <p className="text-gray-600 dark:text-gray-400">
            Stay inspired with quotes and energizing music
          </p>
        </div>

        {/* Quote Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">_
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Quote className="text-primary-600" /> Quote of the Day
            </h2>
            <Button
              variant="outline"
              onClick={handleNewQuote}
              className="text-sm"
            >
              New Quote
            </Button>
          </div>
          {dailyQuote && (
            <MotivationCard
              quote={dailyQuote.quote}
              author={dailyQuote.author}
              Icon={Flame}
            />
          )}
        </section>

        {/* Playlist Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <Headphones className="text-primary-600" /> Workout Playlist
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Pump up your workout with these high-energy tracks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {displayedSongs.map((song, index) => (
              <Card
                key={index}
                className="hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <Music />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {song.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {song.artist}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-medium rounded">
                        {song.genre}
                      </span>
                      <span className="text-xs text-gray-500">
                        {song.bpm} BPM
                      </span>
                    </div>
                  </div>
                </div>
                {song.spotifyUrl && (
                  <a
                    href={song.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    Play on Spotify
                  </a>
                )}
              </Card>
            ))}
          </div>

          {!showAllSongs && workoutSongs.length > 6 && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setShowAllSongs(true)}>
                Show All {workoutSongs.length} Songs
              </Button>
            </div>
          )}

          {showAllSongs && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setShowAllSongs(false)}>
                Show Less
              </Button>
            </div>
          )}
        </section>

        {/* Motivational Tips */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Lightbulb className="text-primary-600" /> Quick Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-primary-50 dark:from-primary-900 to-primary-100 dark:to-primary-800 border-primary-200 dark:border-primary-700 transition-colors duration-300">
              <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
                Consistency Over Perfection
              </h3>
              <p className="text-gray-800 dark:text-primary-200 text-sm">
                It's better to work out 3 times a week consistently than to aim
                for 7 days and burn out.
              </p>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 dark:from-blue-900 to-blue-100 dark:to-blue-800 border-blue-200 dark:border-blue-700 transition-colors duration-300">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Rest is Progress
              </h3>
              <p className="text-gray-800 dark:text-blue-200 text-sm">_
                Your muscles grow during rest, not during workouts. Don't skip
                recovery days.
              </p>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 dark:from-purple-900 to-purple-100 dark:to-purple-800 border-purple-200 dark:border-purple-700 transition-colors duration-300">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                Track Your Progress
              </h3>
              <p className="text-gray-800 dark:text-purple-200 text-sm">_
                What gets measured gets improved. Log every workout to see your
                growth.
              </p>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 dark:from-orange-900 to-orange-100 dark:to-orange-800 border-orange-200 dark:border-orange-700 transition-colors duration-300">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                Celebrate Small Wins
              </h3>
              <p className="text-gray-800 dark:text-orange-200 text-sm">_
                Every rep, every workout, every healthy choice is a step toward
                your goal.
              </p>
            </Card>
          </div>
        </section>
    </div>
  );
};

export default Motivation;
