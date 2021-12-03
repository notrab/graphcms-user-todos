import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcryptjs";
import { gql } from "graphql-request";

import { client } from "../../../lib/graphcms";

const GetNextAuthUserByEmail = gql`
  query GetNextAuthUserByEmail($email: String!) {
    nextAuthUser(where: { email: $email }, stage: DRAFT) {
      id
      password
    }
  }
`;

const CreateNextAuthUserByEmail = gql`
  mutation CreateNextAuthUserByEmail($email: String!, $password: String!) {
    createNextAuthUser(data: { email: $email, password: $password }) {
      id
    }
  }
`;

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  session: {
    strategy: "jwt",
  },

  debug: true,
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      authorize: async ({ email, password }) => {
        const { nextAuthUser } = await client.request(GetNextAuthUserByEmail, {
          email,
        });

        if (!nextAuthUser) {
          const { createNextAuthUser } = await client.request(
            CreateNextAuthUserByEmail,
            {
              email,
              password: await hash(password, 12),
            }
          );

          return {
            id: createNextAuthUser.id,
            username: email,
            email,
          };
        }

        const isValid = await compare(password, nextAuthUser.password);

        if (!isValid) {
          throw new Error("Wrong credentials. Try again.");
        }

        return {
          id: nextAuthUser.id,
          username: email,
          email,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.userId = token.sub;
      return Promise.resolve(session);
    },
  },
});
