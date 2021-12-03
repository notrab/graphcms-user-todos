import { Fragment } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import cc from "classcat";

import NewBoardPopover from "./NewBoardPopover";

const CurrentUserDropdown = () => {
  const { data: session, status } = useSession();

  const loading = status === "loading";

  if (loading) return null;

  return (
    <>
      {session ? (
        <div className="flex items-center space-x-6">
          <NewBoardPopover />
          <Menu as="div" className="flex-shrink-0 relative ml-4 z-50">
            <div>
              <Menu.Button className="bg-white rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">Open user menu</span>
                <div className="w-8 h-8 bg-gray-800 rounded-full"></div>

                {/* <img
                className="h-8 w-8 rounded-full"
                src={`https://placehold..png`}
                alt=""
              /> */}
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
                <div className="px-4 py-3">
                  <p className="text-sm">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session?.user?.email}
                  </p>
                </div>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={signOut}
                      className={cc([
                        "block w-full text-left px-4 py-2 text-sm",
                        {
                          "bg-gray-100 text-gray-900": active,
                          "text-gray-700": !active,
                        },
                      ])}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      ) : (
        <div className="flex items-center">
          <button
            onClick={signIn}
            className="text-sm font-medium transition px-3 py-2 text-gray-700"
          >
            Login
          </button>
        </div>
      )}
    </>
  );
};

export default CurrentUserDropdown;
