import Card from '../common/Card';

const ExerciseDetail = ({ exercise, onClose }) => {
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{exercise.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {exercise.description && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {stripHtml(exercise.description)}
            </p>
          </div>
        )}

        {exercise.category && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-lg">
              Category {exercise.category}
            </span>
          </div>
        )}

        {exercise.equipment && exercise.equipment.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Equipment</h3>
            <div className="flex flex-wrap gap-2">
              {exercise.equipment.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">
                  Equipment {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {exercise.muscles && exercise.muscles.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Target Muscles</h3>
            <div className="flex flex-wrap gap-2">
              {exercise.muscles.map((muscle, index) => (
                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg">
                  Muscle {muscle}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExerciseDetail;