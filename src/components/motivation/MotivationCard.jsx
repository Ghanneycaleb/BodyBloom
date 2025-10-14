import Card from '../common/Card';

const MotivationCard = ({ quote, author, icon = '💪' }) => {
  return (
    <Card className="text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <blockquote className="text-xl md:text-2xl font-medium text-gray-900 mb-4 leading-relaxed">
        "{quote}"
      </blockquote>
      {author && (
        <p className="text-gray-600 font-medium">— {author}</p>
      )}
    </Card>
  );
};

export default MotivationCard;