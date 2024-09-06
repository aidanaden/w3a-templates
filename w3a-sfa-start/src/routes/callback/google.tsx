import { useSearchParams } from "@solidjs/router";
import { Component, createEffect, onMount } from "solid-js";
import { useAuth } from "~/contexts/useAuth";

const Page: Component = () => {
  const { callbackGoogle } = useAuth();
  const [searchParams] = useSearchParams<{
    code: string;
    state: string;
  }>();

  createEffect(() => {
    console.log({ searchParams });
  });

  onMount(async () => {
    const { code, state } = searchParams;
    if (!code || !state) {
      console.error("callback: FAILED, missing code or state in callback url");
      return;
    }
    await callbackGoogle(code, state);
  });

  return (
    <>
      <div class="items flex flex-1 justify-center p-3">Redirecting...</div>
    </>
  );
};

export default Page;
