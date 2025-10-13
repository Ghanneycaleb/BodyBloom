import { useState } from 'react';
import Card from '../common/Card';
import Modal from '../common/Modal';

const ExerciseCard = ({ exercise }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Strip HTML tags from description
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const description = exercise.description ? stripHtml(exercise.description) : 'No description available.';
  const shortDescription = description.length > 100 ? description.substring(0, 100) + '...' : description;

  return (
    <>
      <Card className="h-full flex flex-col cursor-pointer" onClick={() => setShowDetails(true)}>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{exercise.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{shortDescription}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          {exercise.category && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
              Category {exercise.category}
            </span>
          )}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
              Equipment
            </span>
          )}
        </div>

        <button className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
          View Details
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </Card>

      {/* Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={exercise.name}
        size="lg"
      >
        <div className="space-y-4">
          {/* Metadata */}
          <div className="flex flex-wrap gap-2">
            {exercise.category && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-lg">
                Category {exercise.category}
              </span>
            )}
            {exercise.equipment && exercise.equipment.length > 0 && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg">
                {exercise.equipment.length} Equipment
              </span>
            )}
            {exercise.muscles && exercise.muscles.length > 0 && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg">
                {exercise.muscles.length} Muscles
              </span>
            )}
          </div>

          {/* Description */}
          {exercise.description && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
          )}

          {/* Equipment List */}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Required Equipment</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {exercise.equipment.map((item, index) => (
                  <li key={index}>Equipment ID: {item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Muscles */}
          {exercise.muscles && exercise.muscles.length > 0 && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Target Muscles</h4>
              <div className="flex flex-wrap gap-2">
                {exercise.muscles.map((muscle, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-200 text-purple-800 text-sm rounded">
                    Muscle {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ExerciseCard;