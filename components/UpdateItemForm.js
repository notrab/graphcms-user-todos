import { useMutation, gql } from "urql";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const UpdateTodo = gql`
  mutation UpdateTodo($id: ID!, $completed: Boolean, $description: String) {
    updateTodo(
      input: { id: $id, completed: $completed, description: $description }
    ) {
      id
      completed
      description
    }
  }
`;

const UpdateItemForm = ({ todo, onSuccess }) => {
  const { id, ...defaultValues } = todo;

  const { handleSubmit, register } = useForm({
    defaultValues,
  });
  const [state, mutate] = useMutation(UpdateTodo);

  const onSubmit = async ({ completed, description }) => {
    const { error } = await mutate({ id, completed, description });

    if (error) {
      toast.error("Something went wrong! Try again");
    }

    toast.success("Item updated successfully!");
    onSuccess();
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
          {...register("completed")}
          name="completed"
          type="checkbox"
          className="border-gray-400 group-hover:border-gray-800 shadow-sm rounded w-5 h-5"
        />
      )}
      <input
        {...register("description", { required: true })}
        name="description"
        required
        type="text"
        placeholder="What do you want to do?"
        className="border-gray-200 rounded shadow-sm w-full"
        disabled={state.fetching}
      />
      <button
        type="submit"
        className="bg-purple-500 text-white font-semibold px-3 py-2 rounded shadow-sm border border-purple-700"
        disabled={state.fetching}
      >
        {state.fetching ? (
          <svg
            className="animate-spin -ml-1 h-5 w-5 text-white"
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
          "Save"
        )}
      </button>
    </form>
  );
};

export default UpdateItemForm;
