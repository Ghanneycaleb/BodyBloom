// import { Link } from 'react-router-dom';
// import Button from '../components/common/Button';
// import Card from '../components/common/Card';

// const Home = () => {
//   const features = [
//     {
//       title: 'Log Workouts',
//       description: 'Track exercises, sets, reps, and weights with ease.',
//       icon: '📝',
//       link: '/log',
//     },
//     {
//       title: 'View History',
//       description: 'Review past workouts and monitor your consistency.',
//       icon: '📊',
//       link: '/history',
//     },
//     {
//       title: 'Explore Exercises',
//       description: 'Discover new workouts from our exercise library.',
//       icon: '🔍',
//       link: '/explore',
//     },
//     {
//       title: 'Stay Motivated',
//       description: 'Get daily quotes and workout playlists for inspiration.',
//       icon: '💪',
//       link: '/motivation',
//     },
//   ];

//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="text-center py-16 px-4">
//         <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
//           Welcome to <span className="text-primary-600">BodyBloom</span>
//         </h1>
//         <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//           Track your progress. Feel your growth. Your fitness journey starts here.
//         </p>
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <Link to="/log">
//             <Button variant="primary" className="w-full sm:w-auto">
//               Start Logging Workouts
//             </Button>
//           </Link>
//           <Link to="/dashboard">
//             <Button variant="secondary" className="w-full sm:w-auto">
//               View Dashboard
//             </Button>
//           </Link>
//         </div>
//       </section>

//       {/* Features Grid */}
//       <section className="py-16">
//         <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
//           Everything You Need to Succeed
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {features.map((feature, index) => (
//             <Link key={index} to={feature.link}>
//               <Card className="h-full hover:border-primary-300 transition-colors cursor-pointer">
//                 <div className="text-4xl mb-4">{feature.icon}</div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-600 text-sm">{feature.description}</p>
//               </Card>
//             </Link>
//           ))}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-center text-white">
//         <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Fitness?</h2>
//         <p className="text-primary-100 mb-8 max-w-xl mx-auto">
//           Join BodyBloom today and start tracking your progress towards a healthier, stronger you.
//         </p>
//         <Link to="/log">
//           <Button variant="secondary" className="bg-white text-primary-700 hover:bg-gray-50">
//             Get Started Now
//           </Button>
//         </Link>
//       </section>
//     </div>
//   );
// };

// export default Home;

import { Sparkle } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const Home = () => {
  const features = [
    {
      title: "Log Workouts",
      description: "Track exercises, sets, reps, and weights with ease.",
      icon: "📝",
      link: "/log",
    },
    {
      title: "View History",
      description: "Review past workouts and monitor your consistency.",
      icon: "📊",
      link: "/history",
    },
    {
      title: "Explore Exercises",
      description: "Discover new workouts from our exercise library.",
      icon: "🔍",
      link: "/explore",
    },
    {
      title: "Stay Motivated",
      description: "Get daily quotes and workout playlists for inspiration.",
      icon: "💪",
      link: "/motivation",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-4 bg-gradient-to-b from-white to-indigo-50 scroll-smooth">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary-600 mb-6 flex items-center justify-center gap-2">
          Welcome to BodyBloom
          <Sparkle className="w-8 h-8 text-primary-600 animate-spin-pulse" />
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Where your fitness journey blooms — track, train, and transform with
          ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/log">
            <Button variant="primary" className="w-full sm:w-auto">
              Start Logging Workouts
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary" className="w-full sm:w-auto">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link}>
              <Card className="h-full hover:border-primary-300 transition-colors cursor-pointer">
                <div className="text-4xl mb-4">{feature.icon}</div>
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
