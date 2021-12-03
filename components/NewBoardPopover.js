import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/solid";

import NewBoardForm from "./NewBoardForm";

const NewBoardPopover = ({ firstTime = false }) => {
  return (
    <Popover className="relative">
      <Popover.Button className="text-sm font-medium transition px-3 py-2 text-gray-700 hover:text-gray-800 inline-flex items-center">
        <PlusCircleIcon className="w-5 h-5 fill-current mr-1.5" />
        {firstTime ? "Add your first board" : "Create new board"}
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute -ml-4 mt-2 transform z-10 px-2 w-screen max-w-sm md:left-1/2 md:-translate-x-1/2">
          <div className="bg-white rounded shadow ring-1 ring-black ring-opacity-5 overflow-hidden p-6">
            <NewBoardForm firstTime={firstTime} />
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default NewBoardPopover;
