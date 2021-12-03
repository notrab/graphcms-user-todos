import { useQuery, gql } from "urql";

import EmptyBoards from "./EmptyBoards";
import Board from "./Board";

export const GetBoards = gql`
  query GetBoards {
    boards {
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

const BoardList = () => {
  const [result] = useQuery({
    query: GetBoards,
  });

  const { data, fetching, error } = result;

  if (fetching) {
    return (
      <div className="flex justify-center">
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
      </div>
    );
  }

  if (error) {
    return <p>Something went wrong: {error.message}</p>;
  }

  return data?.boards?.length === 0 ? <EmptyBoards /> : data?.boards.map(Board);
};

export default BoardList;
