import TodoItem from "./TodoItem";

const TodoList = ({ items = [] }) => {
  return items.map((item) => <TodoItem key={item.id} {...item} />);
};

export default TodoList;
