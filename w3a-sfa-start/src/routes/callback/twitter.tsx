import { useSearchParams } from "@solidjs/router";
import { Component, onMount } from "solid-js";
import { useAuth } from "~/contexts/useAuth";

const Page: Component = () => {
  const { callbackTwitter } = useAuth();
  const [searchParams] = useSearchParams<{
    oauth_token: string;
    oauth_verifier: string;
  }>();

  onMount(async () => {
    const { oauth_token, oauth_verifier } = searchParams;
    if (!oauth_token || !oauth_verifier) {
      console.error(
        "callback: FAILED, missing oauth_token or oauth_verifier in callback url",
      );
      return;
    }
    try {
      await callbackTwitter(oauth_token, oauth_verifier);
    } catch (e) {
      console.error("error callbackTwitter: ", { e });
    }
  });

  return (
    <>
      <div class="items flex flex-1 justify-center p-3">Redirecting...</div>
    </>
  );
};

export default Page;
