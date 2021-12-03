import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from "graphql-helix";
import { gql } from "graphql-request";
import { getSession } from "next-auth/react";

import { client } from "../../lib/graphcms";

const GetAllBoardsByNextAuthUser = gql`
  query GetAllBoardsByNextAuthUser($userId: ID!) {
    boards(where: { nextAuthUser: { id: $userId } }, orderBy: createdAt_DESC) {
      id
      name
      todos(orderBy: createdAt_ASC) {
        id
        description
        completed
      }
    }
  }
`;

const GetNextAuthUserByUserId = gql`
  query GetNextAuthUserByUserId($userId: ID!) {
    nextAuthUser(where: { id: $userId }) {
      id
      name
      email
    }
  }
`;

const GetTodosByBoardId = gql`
  query GetTodosByBoardId($id: ID!) {
    todos(where: { board: { id: $id } }) {
      id
      description
      completed
    }
  }
`;

const GetBoardById = gql`
  query GetBoardById($id: ID!) {
    board(where: { id: $id }) {
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

const CreateBoardAndConnectUserById = gql`
  mutation CreateBoardAndConnectUserById($userId: ID!, $name: String!) {
    createBoard(
      data: { name: $name, nextAuthUser: { connect: { id: $userId } } }
    ) {
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

const CreateItemAndConnectBoardById = gql`
  mutation CreateItemAndConnectBoardById($boardId: ID!, $description: String!) {
    createTodo(
      data: { description: $description, board: { connect: { id: $boardId } } }
    ) {
      id
      description
      completed
    }
  }
`;

const UpdateItemById = gql`
  mutation UpdateItemById($id: ID!, $description: String, $completed: Boolean) {
    updateTodo(
      where: { id: $id }
      data: { description: $description, completed: $completed }
    ) {
      id
      description
      completed
    }
  }
`;

const RemoveTodoById = gql`
  mutation RemoveTodoById($id: ID!) {
    deleteTodo(where: { id: $id }) {
      id
      description
      completed
    }
  }
`;

const typeDefs = `
  type Query {
    me: NextAuthUser!
    boards: [Board!]!
    todosByBoardId(id: ID!): [Todo!]!
    board(id: ID!): Board!
  }

  type Mutation {
    createBoard(input: CreateBoardInput!): Board!
    createTodo(input: CreateTodoInput!): Todo!
    updateTodo(input: UpdateTodoInput!): Todo
    removeTodo(id: ID!): Todo
  }

  type NextAuthUser {
    id: ID!
    name: String!
    email: String!
  }

  type Board {
    id: ID!
    name: String!
    todos: [Todo!]!
  }

  type Todo {
    id: ID!
    description: String!
    completed: Boolean
  }
  
  input CreateBoardInput {
    name: String!
  }

  input CreateTodoInput {
    description: String!
    boardId: ID!
  }

  input UpdateTodoInput {
    id: ID!
    description: String
    completed: Boolean
  }
`;

const resolvers = {
  Query: {
    me: async (_, __, { graphcms, userId }) => {
      const { nextAuthUser } = await graphcms.request(GetNextAuthUserByUserId, {
        userId,
      });

      return nextAuthUser;
    },
    board: async (_, { id }, { graphcms }) => {
      const { board } = await graphcms.request(GetBoardById, {
        id,
      });

      return board;
    },
    boards: async (_, __, { graphcms, userId }) => {
      const { boards } = await graphcms.request(GetAllBoardsByNextAuthUser, {
        userId,
      });

      return boards;
    },
    todosByBoardId: async (_, { id }, { graphcms }) => {
      const { todos } = await graphcms.request(GetTodosByBoardId, { id });

      return todos;
    },
  },
  Mutation: {
    createBoard: async (_, { input }, { graphcms, userId }) => {
      const { createBoard } = await graphcms.request(
        CreateBoardAndConnectUserById,
        {
          name: input.name,
          userId,
        }
      );

      return createBoard;
    },
    createTodo: async (_, { input }, { graphcms }) => {
      const { createTodo } = await graphcms.request(
        CreateItemAndConnectBoardById,
        {
          description: input.description,
          boardId: input.boardId,
        }
      );

      return createTodo;
    },
    updateTodo: async (_, { input }, { graphcms }) => {
      const { updateTodo } = await graphcms.request(UpdateItemById, input);

      return updateTodo;
    },
    removeTodo: async (_, { id }, { graphcms }) => {
      const { deleteTodo } = await graphcms.request(RemoveTodoById, { id });

      return deleteTodo;
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default async (req, res) => {
  const { userId } = await getSession({ req });

  const request = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    query: req.query,
  };

  if (shouldRenderGraphiQL(request)) {
    res.send(renderGraphiQL({ endpoint: "/api" }));
  } else {
    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
      contextFactory: () => {
        return {
          graphcms: client,
          userId,
        };
      },
    });

    sendResult(result, res);
  }
};
