import { addTodo, deleteTodo, getTodos, updateTodo } from "./actions";

export default async function Todos() {
  const todos = await getTodos();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-5xl">TODOS</h1>
      <div className="flex flex-col gap-1 *:*:m-1">
        <form action={addTodo}>
          <input type="text" name="content" placeholder="Enter todo content" className="border border-gray-300 rounded-md p-2" />
          <button type="submit" className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600">
            Add Todo
          </button>
        </form>
        <form action={deleteTodo}>
          <input type="text" name="id" placeholder="Enter todo id to delete" className="border border-gray-300 rounded-md p-2" />
          <button type="submit" className="bg-red-500 text-white rounded-md p-2 hover:bg-red-600">
            Delete Todo
          </button>
        </form>
        <form action={updateTodo}>
          <input type="text" name="id" placeholder="Enter todo id to update" className="border border-gray-300 rounded-md p-2" />
          <input type="text" name="content" placeholder="Enter new content" className="border border-gray-300 rounded-md p-2" />
          <button type="submit" className="bg-yellow-500 text-white rounded-md p-2 hover:bg-yellow-600">
            Update Todo
          </button>
        </form>
      </div>
      <ul className="flex flex-col gap-2">
        {todos.map((todo) => (
          <li key={todo.id}>{JSON.stringify(todo)}</li>
        ))}
      </ul>
    </div>
  );
}
