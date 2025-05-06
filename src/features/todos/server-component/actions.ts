"use server";

import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { Todo } from "../model";

async function sendCommand(
  command: (supabase: Awaited<ReturnType<typeof createClient>>) => PromiseLike<{ data: Todo[] | null; error: PostgrestError | null }>
) {
  const supabase = await createClient();
  const { data: todos, error } = await command(supabase);
  if (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
  return todos ?? ([] as Todo[]);
}

const getTodos = () => sendCommand((supabase) => supabase.from("todos").select());

async function addTodo(formData: FormData) {
  const content = formData.get("content") as string;
  if (!content) return;
  try {
    await sendCommand((supabase) => supabase.from("todos").insert({ content }));
    revalidatePath(".");
  } catch (err) {
    console.error("Error adding todo:", err);
  }
}

async function deleteTodo(formData: FormData) {
  const id = Number(formData.get("id") as string);
  if (!id || isNaN(id)) return;
  try {
    await sendCommand((supabase) => supabase.from("todos").delete().eq("id", id));
    revalidatePath(".");
  } catch (err) {
    console.error("Error deleting todo:", err);
  }
}

async function updateTodo(formData: FormData) {
  const id = Number(formData.get("id") as string);
  const content = formData.get("content") as string;
  if (!id || isNaN(id) || !content) return;
  try {
    await sendCommand((supabase) => supabase.from("todos").update({ content, updated_at: new Date() }).eq("id", id));
    revalidatePath(".");
  } catch (err) {
    console.error("Error updating todo:", err);
  }
}

export { addTodo, deleteTodo, getTodos, updateTodo };
