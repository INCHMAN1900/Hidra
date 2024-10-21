import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";

const ConfigModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [twitterAPIKey, setTwitterAPIKey] = useState("");
  const [twitterAPISecret, setTwitterAPISecret] = useState("");
  const [twitterAccessToken, setTwitterAccessToken] = useState("");
  const [twitterAccessTokenSecret, setTwitterAccessTokenSecret] = useState("");
  const [blueskyIdentifier, setBlueskyIdentifier] = useState("");
  const [blueskyPassword, setBlueSkyPassword] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    window.electron.ipcRenderer.send("save-credentials", {
      twitterAPIKey,
      twitterAPISecret,
      twitterAccessToken,
      twitterAccessTokenSecret,
      blueskyIdentifier,
      blueskyPassword,
    });
    onClose();
  };

  useEffect(() => {
    async function getCredentials() {
      const credentials = await window.electron.ipcRenderer.invoke(
        "get-credentials"
      );
      setTwitterAPIKey(credentials.twitterAPIKey || "");
      setTwitterAPISecret(credentials.twitterAPISecret || "");
      setTwitterAccessToken(credentials.twitterAccessToken || "");
      setTwitterAccessTokenSecret(credentials.twitterAccessTokenSecret || "");
      setBlueskyIdentifier(credentials.blueskyIdentifier || "");
      setBlueSkyPassword(credentials.blueskyPassword || "");
    }
    getCredentials();
  }, []);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm">
          <Dialog.Title className="text-lg font-semibold">Configuration</Dialog.Title>
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="text-xs py-3 pt-0">
              <p>Twitter: generate keys & tokens in Developer Portal</p>
              <p>Bluesky: Settings -&gt; Advanced -&gt; App passwords </p>
            </div>
            <div className="mb-2">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="twitterAPIKeyKey"
              >
                Twitter API Key
              </label>
              <input
                type="text"
                id="twitterAPIKeyKey"
                value={twitterAPIKey}
                onChange={(e) => setTwitterAPIKey(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="twitterAPIKeySecretKey"
              >
                Twitter API Secret Key
              </label>
              <input
                type="text"
                id="twitterAPIKeySecretKey"
                value={twitterAPISecret}
                onChange={(e) => setTwitterAPISecret(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="twitterAccessToken"
              >
                Twitter Access Token
              </label>
              <input
                type="text"
                id="twitterAccessToken"
                value={twitterAccessToken}
                onChange={(e) => setTwitterAccessToken(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="twitterAccessTokenSecret"
              >
                Twitter Access Token Secret
              </label>
              <input
                type="text"
                id="twitterAccessTokenSecret"
                value={twitterAccessTokenSecret}
                onChange={(e) => setTwitterAccessTokenSecret(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="blueskyUsername"
              >
                Blue Sky Identifier(xxxx.bsky.social)
              </label>
              <input
                type="text"
                id="blueskyUsername"
                value={blueskyIdentifier}
                onChange={(e) => setBlueskyIdentifier(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="blueskyPassword"
              >
                Blue Sky Password
              </label>
              <input
                type="password"
                id="blueskyPassword"
                value={blueskyPassword}
                onChange={(e) => setBlueSkyPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-md px-3 py-1"
              >
                Submit
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConfigModal;
