import { useSession } from "next-auth/react";

import UserDropdown from "../components/UserDropdown";
import BoardList from "../components/BoardList";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="bg-white border-b border-gray-200 shadow-sm py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-3 md:px-6">
          <div>Todo App</div>
          <UserDropdown />
        </div>
      </div>
      <div className="p-3 md:p-12">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-3 md:px-6">
          <div className="w-full space-y-3">{session && <BoardList />}</div>
        </div>
      </div>
    </div>
  );
}
