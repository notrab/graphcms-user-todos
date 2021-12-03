import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, gql } from "urql";

const ToggleTodoMutation = gql`
  mutation ToggleTodo($id: ID!, $completed: Boolean) {
    updateTodo(input: { id: $id, completed: $completed }) {
      id
      completed
    }
  }
`;

const ToggleTodo = ({ id, completed }) => {
  const [isCompleted, setIsCompleted] = useState(completed || false);
  const [state, mutate] = useMutation(ToggleTodoMutation);

  const handleToggle = async () => {
    const completedValue = !isCompleted;

    setIsCompleted(completedValue);

    const { error } = await mutate({
      id,
      completed: completedValue,
    });

    if (error) {
      console.log(error.message);
      toast.error("Something went wrong. Try again!");
      return;
    }

    if (completedValue) {
      toast.success("Yay! You completed a task!");
    }

    if (!completedValue) {
      toast.success("Marked as todo");
    }
  };

  return state.fetching ? (
    <svg
      className="animate-spin h-5 w-5 text-purple-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  ) : (
    <input
      disabled={state.fetching}
      type="checkbox"
      className="border-gray-400 group-hover:border-gray-800 shadow-sm rounded w-5 h-5"
      checked={isCompleted}
      onChange={handleToggle}
    />
  );
};

export default ToggleTodo;
