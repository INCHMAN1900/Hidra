import React, { useState, useRef } from "react";
import { Switch } from "@headlessui/react";
import { ImageIcon, XCircleIcon } from "lucide-react";
import { convertFileToBase64 } from "../utils";

interface PostFile {
  base64: string;
  mimeType: string;
  original: File;
}
export interface PostContent {
  text: string;
  files: PostFile[];
  postToTwitter: boolean;
  postToBluesky: boolean;
}

interface UploadFormParam {
  isPosting: boolean;
  onPost: (data: PostContent, callback: (success: boolean) => void) => void;
}

function UploadForm({ onPost, isPosting }: UploadFormParam) {
  const [postText, setPostText] = useState("");
  const [files, setFiles] = useState<PostFile[]>([]);
  const [postToTwitter, setpostToTwitter] = useState(true);
  const [postToBluesky, setpostToBluesky] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxTwitterLength = 280;
  const maxBlueskyLength = 300;

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newFiles = e.target.files;
    if (newFiles) {
      addFiles([...newFiles]);
    }
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleDeleteFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const addFiles = async (files: File[]) => {
    const newFiles: PostFile[] = [];
    for (const file of files) {
      const mimeType = file.type;
      const base64 = await convertFileToBase64(file);
      newFiles.push({ base64, mimeType, original: file });
    }
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const inputData = {
      text: postText,
      files: files,
      postToTwitter: postToTwitter,
      postToBluesky: postToBluesky,
    };

    if (!postText && files.length == 0) {
      alert("It seems that you tried to post nothing 😓.");
      return;
    }
    alert("Start posting...");

    onPost(inputData, (success: boolean) => {
      if (success) {
        setPostText("");
        setFiles([]);
      }
    });
    console.log("Start posting:", inputData);
  };

  const isSubmitDisabled = (!postToTwitter && !postToBluesky) || isPosting;

  const renderFilePreview = () => {
    return files.map((file, index) => {
      const isImage = file.mimeType.startsWith("image");
      const isVideo = file.mimeType.startsWith("video");

      return (
        <div
          key={index}
          className="relative group w-full h-32 border border-gray-300 rounded-lg overflow-hidden"
        >
          <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <XCircleIcon
              className="w-6 h-6 text-red-500 cursor-pointer"
              onClick={() => handleDeleteFile(index)}
            />
          </div>
          {isImage && (
            <img
              src={file.base64}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          {isVideo && (
            <video controls className="w-full h-full object-cover">
              <source
                src={URL.createObjectURL(file.original)}
                type={file.mimeType}
              />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      );
    });
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md space-y-4">
      <h2 className="text-lg font-bold text-gray-800 pb-0">Post</h2>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Limit: Twitter {maxTwitterLength}, Bluesky {maxBlueskyLength}
        </label>
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          maxLength={Math.min(maxTwitterLength, maxBlueskyLength)}
          className="w-full rounded-md border border-gray-200 shadow-sm focus:ring-gray-300 focus:border-gray-500 sm:text-sm p-3"
          rows={4}
          placeholder="Type something..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image/Video (Up to 4)
        </label>
        <div
          className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
          onClick={handleClickUpload}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              Click or drag to upload images or videos.
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Twitter supports uploading a mix of images and videos, while Bluesky
          only supports uploading a single video.
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">{renderFilePreview()}</div>
      )}

      <div className="items-center space-x-4">
        <Switch.Group>
          <div className="inline-block items-center">
            <Switch.Label className="mr-4 text-sm">Post to Twitter</Switch.Label>
            <Switch
              checked={postToTwitter}
              onChange={setpostToTwitter}
              className={`${
                postToTwitter ? "bg-blue-600" : "bg-gray-200"
              } relative inline-flex items-center h-4 w-8 rounded-full`}
            >
              <span className="sr-only">Upload to Twitter</span>
              <span
                className={`${
                  postToTwitter ? "translate-x-4" : "translate-x-1"
                } inline-block w-3 h-3 transform bg-white rounded-full transition`}
              />
            </Switch>
          </div>
        </Switch.Group>

        <Switch.Group>
          <div className="inline-block items-center">
            <Switch.Label className="mr-4 text-sm">Post to Bluesky</Switch.Label>
            <Switch
              checked={postToBluesky}
              onChange={setpostToBluesky}
              className={`${
                postToBluesky ? "bg-blue-600" : "bg-gray-200"
              } relative inline-flex items-center h-4 w-8 rounded-full`}
            >
              <span className="sr-only">Upload to Bluesky</span>
              <span
                className={`${
                  postToBluesky ? "translate-x-4" : "translate-x-1"
                } inline-block w-3 h-3 transform bg-white rounded-full transition`}
              />
            </Switch>
          </div>
        </Switch.Group>
      </div>

      <div>
        <button
          onClick={handleSubmit}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            !isSubmitDisabled
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-400 cursor-not-allowed"
          }`}
          disabled={isSubmitDisabled || isPosting}
        >
          <span>{isPosting ? "Posting..." : "Post"}</span>
        </button>
      </div>
    </div>
  );
}

export default UploadForm;
