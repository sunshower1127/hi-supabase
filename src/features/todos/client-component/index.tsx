"use client";

import { useEffect, useState } from "react";
import { Todo } from "../model";
import { addTodo, deleteTodo, getTodos, updateTodo } from "./service";

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTodos = await getTodos();
      setTodos(fetchedTodos);
    } catch (err) {
      setError("todos를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    const input = prompt("Enter new todo");
    if (!input) return;

    setLoading(true);
    setError(null);
    try {
      const newTodo = await addTodo(input);
      if (!newTodo || newTodo.length === 0) {
        throw new Error("Todo 추가에 실패했습니다.");
      }
      setTodos((prev) => [...prev, newTodo[0]]);
    } catch (err) {
      setError("Todo 추가에 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async () => {
    const input = prompt("Enter todo id to delete");
    if (!input) return;
    const id = parseInt(input);
    if (isNaN(id)) {
      alert("유효한 ID를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(`ID ${id}의 Todo 삭제에 실패했습니다.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTodo = async () => {
    const input = prompt("Enter todo id to update");
    if (!input) return;
    const id = parseInt(input);
    if (isNaN(id)) {
      alert("유효한 ID를 입력해주세요.");
      return;
    }

    const content = prompt("Enter new content");
    if (!content) return;

    setLoading(true);
    setError(null);
    try {
      const newRecord = await updateTodo(id, content);
      setTodos((prev) => prev.map((todo) => (todo.id === id ? newRecord! : todo)));
    } catch (err) {
      setError(`ID ${id}의 Todo 업데이트에 실패했습니다.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-5xl">TODOS</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div className="flex flex-row gap-2 *:border *:cursor-pointer *:p-1 *:rounded-sm">
        <button onClick={handleAddTodo} disabled={loading}>
          {loading ? "처리 중..." : "Add Todo"}
        </button>
        <button onClick={handleDeleteTodo} disabled={loading}>
          {loading ? "처리 중..." : "Delete Todo"}
        </button>
        <button onClick={handleUpdateTodo} disabled={loading}>
          {loading ? "처리 중..." : "Update Todo"}
        </button>
        <button onClick={fetchTodos} disabled={loading}>
          {loading ? "처리 중..." : "새로고침"}
        </button>
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <ul>{todos.length === 0 ? <p>Todo가 없습니다.</p> : todos.map((todo) => <li key={todo.id}>{JSON.stringify(todo)}</li>)}</ul>
      )}
    </div>
  );
}
