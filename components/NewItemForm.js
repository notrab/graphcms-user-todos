import { useRef } from "react";
import { useMutation, gql } from "urql";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const CreateTodo = gql`
  mutation CreateTodo($description: String!, $boardId: ID!) {
    createTodo(input: { description: $description, boardId: $boardId }) {
      id
      description
      completed
    }
  }
`;

const NewItemForm = ({ boardId }) => {
  const { handleSubmit, register, reset } = useForm();
  const [state, mutate] = useMutation(CreateTodo);

  const descriptionRef = useRef(null);
  const { ref, ...rest } = register("description", { required: true });

  const onSubmit = async ({ description }) => {
    const { error } = await mutate({ description, boardId });

    if (error) {
      console.log(error);
      toast.error("Something went wrong! Try again");
    }

    reset();
    descriptionRef.current.focus();

    toast.success("Item added successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center space-x-3"
    >
      {state.fetching ? (
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
          disabled
          type="checkbox"
          className="border-gray-400 group-hover:border-gray-800 shadow-sm rounded w-5 h-5"
        />
      )}
      <input
        {...rest}
        name="description"
        ref={(e) => {
          ref(e);
          descriptionRef.current = e;
        }}
        required
        type="text"
        placeholder="Hit enter to add a new item"
        className="border-gray-200 rounded shadow-sm w-full"
        disabled={state.fetching}
      />
    </form>
  );
};

export default NewItemForm;
