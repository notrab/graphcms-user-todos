import { useState } from "react";
import cc from "classcat";

import ToggleTodo from "./ToggleTodo";
import UpdateItemForm from "./UpdateItemForm";
import RemoveTodo from "./RemoveTodo";

const TodoItem = ({ id, description, completed }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={cc(["px-6 py-3 group transition"])}>
      {isEditing ? (
        <UpdateItemForm
          todo={{ id, completed, description }}
          onSuccess={() => setIsEditing(false)}
        />
      ) : (
        <div className="flex items-center space-x-3">
          <ToggleTodo id={id} completed={completed} />
          <div className="flex-1">
            <p
              className={cc([
                "text-sm text-gray-600",
                {
                  "line-through opacity-50": completed,
                  "group-hover:text-gray-800": !completed,
                },
              ])}
              onClick={() => setIsEditing(true)}
            >
              {description}
            </p>
          </div>
          <div>
            <RemoveTodo id={id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
