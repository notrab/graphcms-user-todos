import { useRef } from "react";
import { useMutation, gql } from "urql";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const CreateBoard = gql`
  mutation CreateBoard($name: String!) {
    createBoard(input: { name: $name }) {
      id
      name
      todos {
        id
        description
        completed
      }
    }
  }
`;

const NewBoardForm = ({ firstTime }) => {
  const { handleSubmit, register, reset } = useForm();
  const [state, mutate] = useMutation(CreateBoard);

  const nameRef = useRef(null);
  const { ref, ...rest } = register("name", { required: true });

  const onSubmit = async ({ name }) => {
    const myPromise = mutate({ name });

    toast.promise(myPromise, {
      loading: "Creating new board",
      success: "Board created successfully!",
      error: "Something went wrong. Try again!",
    });

    const { error } = myPromise;

    if (firstTime) return;

    if (!error) {
      reset();
      nameRef.current.focus();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center space-x-3"
    >
      <input
        {...rest}
        name="name"
        ref={(e) => {
          ref(e);
          nameRef.current = e;
        }}
        required
        autoFocus
        type="text"
        placeholder="Name your board"
        className="border-gray-200 rounded shadow-sm w-full"
        disabled={state.fetching}
      />
      <button
        type="submit"
        className="bg-purple-500 text-white font-semibold px-3 py-2 rounded shadow-sm border border-purple-700"
        disabled={state.fetching}
      >
        {state.fetching ? "Loading..." : "Create"}
      </button>
    </form>
  );
};

export default NewBoardForm;
