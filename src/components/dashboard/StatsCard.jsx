import Card from "../common/Card";

const StatsCard = ({ title, value, subtitle, icon, color = "primary" }) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600 text-primary-100",
    blue: "from-blue-500 to-blue-600 text-blue-100",
    purple: "from-purple-500 to-purple-600 text-purple-100",
    orange: "from-orange-500 to-orange-600 text-orange-100",
    green: "from-green-500 to-green-600 text-green-100",
  };

  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} border-none text-white dark:text-white shadow-lg dark:shadow-2xl`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm opacity-90 mb-1">{title}</p>
          <p className="text-4xl font-bold mb-2">{value}</p>
          {subtitle && <p className="text-sm opacity-75">{subtitle}</p>}
        </div>
        {icon && <div className="text-4xl opacity-50">{icon}</div>}
      </div>
    </Card>
  );
};

export default StatsCard;
