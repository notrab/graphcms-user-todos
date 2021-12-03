import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { withUrqlClient } from "next-urql";
import { dedupExchange, fetchExchange, gql } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";

import "tailwindcss/tailwind.css";

import { GetBoards as GetBoardsQuery } from "../components/BoardList";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Toaster position="bottom-center" />
    </SessionProvider>
  );
}

export default withUrqlClient((_ssrExchange, ctx) => ({
  url: "/api",
  requestPolicy: "network-only",
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          createBoard({ createBoard }, args, cache, _info) {
            cache.updateQuery(
              {
                query: GetBoardsQuery,
              },
              (cacheData) => {
                cacheData.boards.unshift(createBoard);

                return cacheData;
              }
            );
          },
          createTodo({ createTodo }, { input }, cache, _info) {
            // cache.invalidate({
            //   __typename: "Board",
            //   id: input.boardId,
            // });
            const board = cache.readFragment(
              gql`
                fragment _ on Board {
                  id
                  name
                  todos {
                    id
                    description
                    completed
                  }
                }
              `,
              { id: input.boardId }
            );

            cache.writeFragment(
              gql`
                fragment _ on Board {
                  id
                  todos {
                    id
                    name
                    completed
                  }
                }
              `,
              {
                id: input.boardId,
                todos: [, ...board.todos, createTodo],
              }
            );
          },
          removeTodo(_result, args, cache, _info) {
            cache.invalidate({
              __typename: "Todo",
              id: args.id,
            });
          },
        },
      },
      optimistic: {
        ToggleTodo: (variables, cache, info) => ({
          __typename: "Todo",
          id: variables.id,
          completed: variables.completed,
        }),
        UpdateTodo: (variables, cache, info) => ({
          __typename: "Todo",
          ...variables,
        }),
      },
    }),
    fetchExchange,
  ],
}))(MyApp);
