import { Suspense } from "react";
import GithubCallbackClient from "../../../components/GithubCallbackClient"

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <GithubCallbackClient />
    </Suspense>
  );
}