import Card from "../common/Card";
import { Dumbbell } from "lucide-react";

// eslint-disable-next-line no-unused-vars
const MotivationCard = ({ quote, author, Icon = Dumbbell }) => {
  return (
    <Card className="text-center">
      <div className="text-5xl mb-4 text-gray-400">
        <Icon />
      </div>
      <blockquote className="text-xl md:text-2xl font-medium text-gray-900 mb-4 leading-relaxed">
        "{quote}"
      </blockquote>
      {author && <p className="text-gray-600 font-medium">— {author}</p>}
    </Card>
  );
};

export default MotivationCard;
