import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';

const HistoryCard = ({ workout, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleDelete = () => {
    onDelete(workout.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Card className="hover:border-primary-300 transition-all">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{workout.name}</h3>
              <span className="text-xs text-gray-500">{formatDate(workout.date)}</span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <span className="font-medium text-primary-600">{workout.exercises.length}</span>
                <span>exercises</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-primary-600">{workout.duration}</span>
                <span>min</span>
              </div>
              {workout.totalVolume > 0 && (
                <div className="flex items-center gap-1">
                  <span className="font-medium text-primary-600">{workout.totalVolume}</span>
                  <span>kg volume</span>
                </div>
              )}
            </div>

            {workout.notes && (
              <p className="text-sm text-gray-600 italic border-l-2 border-primary-300 pl-3 mb-3">
                "{workout.notes}"
              </p>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDetails(true)}
                className="text-sm py-2 px-4"
              >
                View Details
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm py-2 px-4"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={workout.name}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600">Exercises</p>
              <p className="text-xl font-bold text-primary-600">{workout.exercises.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-xl font-bold text-primary-600">{workout.duration} min</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Volume</p>
              <p className="text-xl font-bold text-primary-600">{workout.totalVolume} kg</p>
            </div>
          </div>

          {workout.notes && (
            <div className="p-4 bg-primary-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
              <p className="text-sm text-gray-600">{workout.notes}</p>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Exercises</h4>
            <div className="space-y-2">
              {workout.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{exercise.name}</p>
                      <p className="text-sm text-gray-600">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.weight > 0 && ` @ ${exercise.weight} kg`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Workout?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{workout.name}"? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default HistoryCard;