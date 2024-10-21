import { useState } from "react";
import PostForm, { type PostContent } from "./components/PostForm";
import Header from "./components/Header";

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, ...args: unknown[]) => void;
        on: (
          channel: string,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: (data: Record<string, any>) => void
        ) => void;
        once: (
          channel: string,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: (data: Record<string, any>) => void
        ) => void;
        invoke: (
          channel: string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) => any;
      };
    };
  }
}

function App() {
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async (
    data: PostContent,
    callback: (success: boolean) => void
  ) => {
    setIsPosting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const postContent: Record<string, any> = { ...data };
      const files: { base64: string; mimeType: string }[] = [];
      for (const index in files) {
        const file = files[index];
        files.push({
          mimeType: file.mimeType,
          base64: file.base64,
        });
      }
      postContent.files = files;

      window.electron.ipcRenderer.send("post-to-socials", postContent);

      window.electron.ipcRenderer.once("post-response", (response) => {
        let twitterSucceed = false;
        let blueskySucceed = false;
        if (data.postToTwitter) {
          const twitterId = response.twitter?.value?.data?.id;
          if (twitterId) {
            alert("Post sent to Twitter.");
            twitterSucceed = true;
          } else {
            alert(
              "Post to Twitter failed: " +
                (response.twitter?.reason?.toString() ?? "")
            );
          }
        }
        if (data.postToBluesky) {
          const blueskyURI = response.bluesky?.value?.uri;
          if (blueskyURI) {
            alert("Post sent to Bluesky.");
            blueskySucceed = true;
          } else {
            alert(
              "Post to Bluesky failed: " +
                (response.bluesky?.reason?.toString() ?? "")
            );
          }
        }
        setIsPosting(false);
        if (twitterSucceed && blueskySucceed) {
          callback(true);
        }
      });

      window.electron.ipcRenderer.on("post-error", (error) => {
        alert("Post failed: " + String(error));
        setIsPosting(false);
        callback(false);
      });
    } catch (error) {
      alert("Initiate posting failed: " + String(error));
      setIsPosting(false);
      callback(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PostForm onPost={handlePost} isPosting={isPosting} />
      </main>
    </div>
  );
}

export default App;
