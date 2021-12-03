import { XIcon } from "@heroicons/react/solid";
import toast from "react-hot-toast";
import { useMutation, gql } from "urql";

const RemoveTodoMutation = gql`
  mutation RemoveTodo($id: ID!) {
    removeTodo(id: $id) {
      id
    }
  }
`;

const RemoveTodo = ({ id }) => {
  const [state, mutate] = useMutation(RemoveTodoMutation);

  const handleClick = async () => {
    const { error } = await mutate({ id });

    if (error) {
      toast.error("Could not remove todo. Try again!");
      return;
    }

    toast.success("Todo removed!");
  };

  return (
    <button
      disabled={state.fetching}
      onClick={handleClick}
      className="appearance-none p-1"
    >
      {state.fetching ? (
        <svg
          className="animate-spin -ml-1 h-5 w-5 text-purple-500"
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
        <XIcon className="w-5 h-5 fill-current text-gray-200 group-hover:text-gray-500 transition-colors" />
      )}
    </button>
  );
};

export default RemoveTodo;
