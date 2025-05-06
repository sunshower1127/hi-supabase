import LoginForm from "@/features/auth";
import { Props } from "@/types";

export default async function Page({ searchParams }: Props) {
  const errorMessage = (await searchParams)["error_message"] as string | undefined;
  const successMessage = (await searchParams)["success_message"] as string | undefined;
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <LoginForm errorMessage={errorMessage} successMessage={successMessage} />
    </main>
  );
}
