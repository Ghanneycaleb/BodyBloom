import { FileEdit, BarChart3, Search, Flame } from "lucide-react";
import { Sparkle } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const Home = () => {
  const features = [
    {
      title: "Log Workouts",
      description: "Track exercises, sets, reps, and weights with ease.",
      icon: <FileEdit className="w-8 h-8 text-primary-600" />,
      link: "/log",
    },
    {
      title: "View History",
      description: "Review past workouts and monitor your consistency.",
      icon: <BarChart3 className="w-8 h-8 text-primary-600" />,
      link: "/history",
    },
    {
      title: "Explore Exercises",
      description: "Discover new workouts from our exercise library.",
      icon: <Search className="w-8 h-8 text-primary-600" />,
      link: "/explore",
    },
    {
      title: "Stay Motivated",
      description: "Get daily quotes and workout playlists for inspiration.",
      icon: <Flame className="w-8 h-8 text-primary-600" />,
      link: "/motivation",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-4 bg-gradient-to-b from-white to-indigo-50 scroll-smooth">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          <span className="text-gray-900 animate-fade-in">Welcome to </span>
          <span className="text-primary-600 animate-fade-in delay-100">BodyBloom</span>
          {/* Use inline-block and vertical alignment for the icon */}
          <Sparkle className="w-8 h-8 text-primary-600 animate-spin-pulse inline-block align-middle ml-2" />
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in delay-200">
          Where your fitness journey blooms — track, train, and transform with
          ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Link to="/log">
            <Button
              variant="primary"
              className="w-full sm:w-auto transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:animate-bounce-smooth"
            >
              Start Logging Workouts
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button
              variant="secondary"
              className="w-full sm:w-auto transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:animate-bounce-smooth"
            >
              View Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Succeed
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link} className="block h-full">
              <Card className="h-full transition-all duration-500 ease-out hover:border-primary-500 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
                {/* <div className="text-4xl mb-4">{feature.icon}</div> */}
                <div className="mb-4">{feature.icon}</div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Fitness?
        </h2>
        <p className="text-primary-100 mb-8 max-w-xl mx-auto">
          Join BodyBloom today and start tracking your progress towards a
          healthier, stronger you.
        </p>
        <Link to="/log">
          <Button
            variant="secondary"
            className="bg-white text-primary-700 hover:bg-gray-50 hover:shadow-lg hover:animate-bounce-smooth"
          >
            Get Started Now
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
