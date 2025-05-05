import { createClient } from "@/utils/supabase/client";
import { Todo } from "../model";

async function getTodos() {
  const supabase = createClient();
  const { data: todos, error } = await supabase.from("todos").select();
  if (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
  return todos ?? [];
}

async function addTodo(content: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("todos").insert({ content }).select();
  if (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
  return data;
}

async function deleteTodo(id: number) {
  const supabase = createClient();
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
  return true;
}

async function updateTodo(id: number, content: string) {
  const supabase = createClient();
  // 끝에 select()를 붙여서 업데이트된 데이터를 가져올 수 있음
  const { data, error } = await supabase.from("todos").update({ content, updated_at: new Date() }).eq("id", id).select();
  if (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
  return data[0] as Todo;
}

export { addTodo, deleteTodo, getTodos, updateTodo };
