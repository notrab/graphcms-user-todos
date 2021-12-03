import { Disclosure } from "@headlessui/react";
import { ArrowSmDownIcon, ArrowSmUpIcon } from "@heroicons/react/solid";
import cc from "classcat";

import TodoList from "./TodoList";
import NewItemForm from "./NewItemForm";

const Board = ({ id, name, todos = [] }) => {
  return (
    <div key={id} className="bg-white rounded shadow-sm">
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <div
              className={cc([
                "bg-white flex items-center space-x-3 p-3 border border-gray-200 rounded",
                {
                  "rounded-b-none": open,
                },
              ])}
            >
              <Disclosure.Button className="p-2.5">
                {open ? (
                  <ArrowSmDownIcon className="w-5 h-5 fill-current text-purple-500" />
                ) : (
                  <ArrowSmUpIcon className="w-5 h-5 fill-current text-purple-500" />
                )}
              </Disclosure.Button>
              <p
                className={cc([
                  "font-semibold",
                  {
                    "text-purple-500": open,
                    "text-gray-800": !open,
                  },
                ])}
              >
                {name}
              </p>
            </div>

            <Disclosure.Panel>
              <div className="bg-gray-50 divide-y divide-gray-200 border border-t-0 border-gray-200">
                <TodoList items={todos} />
                <div className="px-6 py-3">
                  <NewItemForm boardId={id} />
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default Board;
