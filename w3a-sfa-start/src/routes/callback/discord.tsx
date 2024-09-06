import { useSearchParams } from "@solidjs/router";
import { Component, createEffect, onMount } from "solid-js";
import { useAuth } from "~/contexts/useAuth";

const Page: Component = () => {
  const { callbackDiscord } = useAuth();
  const [searchParams] = useSearchParams<{
    code: string;
    state: string;
  }>();

  onMount(async () => {
    const { code, state } = searchParams;
    if (!code || !state) {
      console.error("callback: FAILED, missing code or state in callback url");
      return;
    }
    await callbackDiscord(code, state);
  });

  createEffect(() => {
    console.log({ searchParams });
  });

  return (
    <>
      <div class="items flex flex-1 justify-center p-3">Redirecting...</div>
    </>
  );
};

export default Page;
