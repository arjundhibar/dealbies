"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import EmojiPicker from "emoji-picker-react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  Minus,
  Smile,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  X,
  Link2,
} from "lucide-react";

interface SubmissionEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  focused?: boolean;
  onFocusChange?: (focused: boolean) => void;
  error?: boolean;
  disableFocusExpand?: boolean;
}

export function SubmissionEditor({
  content,
  onUpdate,
  placeholder = "Add the details about the product, links to relevant info/reviews and why you think it's a good deal",
  className = "",
  minHeight = "400px",
  focused = false,
  onFocusChange,
  error = false,
  disableFocusExpand = false,
}: SubmissionEditorProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageInsertUrl, setImageInsertUrl] = useState("");
  const [imageInsertFile, setImageInsertFile] = useState<File | null>(null);
  const [selected, setSelected] = useState<"left" | "middle">("left");
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "w-full bg-white dark:bg-[#1d1f20] border text-black focus:outline-none dark:text-white rounded-lg p-4 pb-16 resize-none text-base leading-6 transition-all duration-300 ease-in-out flex-shrink-0 list-disc list-inside placeholder:text-gray-400",
          error
            ? "border-red-500 focus:border-red-500"
            : "border-[rgba(3,12,25,0.23)] dark:border-[hsla(0,0%,100%,0.35)]"
        ),
        style: `min-height: ${minHeight};`,
      },
      handleDOMEvents: {
        focus: () => {
          onFocusChange?.(true);
          return false;
        },
        blur: () => {
          onFocusChange?.(false);
          return false;
        },
      },
    },
  });

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageInsertFile(file);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageInsertUrl(e.target.value);
  };

  const handlePlaceImage = () => {
    if (!editor) return;

    const imageSource = imageInsertFile || imageInsertUrl;
    if (!imageSource) return;

    if (imageInsertFile) {
      // Handle file upload logic here
      console.log("File upload:", imageInsertFile);
    } else if (imageInsertUrl) {
      editor.chain().focus().setImage({ src: imageInsertUrl }).run();
    }

    setShowImageInput(false);
    setImageInsertFile(null);
    setImageInsertUrl("");
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="relative">
      <EditorContent editor={editor} className="w-full" />

      {/* Toolbar */}
      <div className="relative -top-14 w-fit left-2 inline-flex items-center gap-1 bg-[#fff] dark:bg-[#1d1f20] rounded-xl p-[7px] border border-[rgba(3,12,25,0.1)] dark:border-[#1d1f20] shadow-lg overflow-x-auto">
        <Button
          variant="ghost"
          size="sm"
          className="icon-button flex-shrink-0"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4 stroke-[3.2]" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="icon-button flex-shrink-0"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4 stroke-[3.2]" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="icon-button flex-shrink-0"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4 stroke-[3.2]" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="icon-button flex-shrink-0"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4 stroke-[3.2]" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="icon-button flex-shrink-0"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4 stroke-[3.2]" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="icon-button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowEmojiPicker((v) => !v)}
        >
          <Smile className="h-4 w-4 stroke-[3.2]" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="icon-button flex-shrink-0"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowLinkInput(true)}
        >
          <LinkIcon className="h-4 w-4 stroke-[3.2]" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="icon-button flex-shrink-0"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setShowImageInput(true);
            // Save the current selection
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              setSavedSelection(selection.getRangeAt(0));
            }
          }}
        >
          <ImageIcon className="h-4 w-4 stroke-[3.2]" />
        </Button>
      </div>

      {/* Popups positioned relative to main container */}
      {showEmojiPicker && (
        <div className="absolute bottom-28 left-2 bg-white dark:bg-[#23272f] border border-gray-200 dark:border-[#23272f] rounded-lg shadow-lg p-2 z-[9999]">
          <EmojiPicker
            onEmojiClick={(emojiObject) => {
              editor?.chain().focus().insertContent(emojiObject.emoji).run();
              setShowEmojiPicker(false);
            }}
            width={300}
            height={400}
            searchDisabled={false}
            skinTonesDisabled={false}
            lazyLoadEmojis={true}
          />
        </div>
      )}

      {showLinkInput && (
        <div className="absolute bottom-28 left-32 bg-white dark:bg-[#23272f] border border-gray-200 dark:border-[#23272f] rounded-lg shadow-lg p-6 flex flex-col gap-2 w-[350px] z-[9999]">
          {/* Arrow pointer at the bottom */}
          <div
            className="absolute -bottom-2 left-36 w-0 h-0"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid #fff",
            }}
          />
          {/* Heading with icon, text, and close button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <Link2 className="h-6 w-6 text-black dark:text-white" />
              <span className="font-semibold text-lg text-black dark:text-white">
                Link
              </span>
            </div>
            <button
              onClick={() => setShowLinkInput(false)}
              className="p-1 rounded-full hover:bg-[rgba(15,55,95,0.05)] dark:hover:bg-[#363739] text-[#6b6d70] hover:text-[#76787b] dark:hover:text-white"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-2">
              <label className="text-[12.25px] text-black dark:text-white font-semibold">
                URL
              </label>
              <input
                type="text"
                value={linkURL}
                onChange={(e) => setLinkURL(e.target.value)}
                className="pt-[9px] pb-[9px] pl-[16px] pr-[16px] rounded-lg border border-[rgba(3,12,25,0.23)] dark:bg-[#2d2f31] focus:border-[#f7641b] outline-none dark:text-white text-black text-sm"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-[12.25px] text-black dark:text-white font-semibold">
                Text
              </label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="pt-[9px] pb-[9px] pl-[16px] pr-[16px] rounded-lg border border-[rgba(3,12,25,0.23)] dark:bg-[#2d2f31] focus:border-[#f7641b] outline-none dark:text-white text-black text-sm"
              />
              <div className="pt-4">
                <button
                  onClick={() => {
                    if (linkURL.trim()) {
                      editor?.chain().focus().setLink({ href: linkURL }).run();
                      setShowLinkInput(false);
                      setLinkURL("");
                      setLinkText("");
                    }
                  }}
                  disabled={!linkURL.trim()}
                  className={cn(
                    "text-sm h-9 font-medium text-white px-3 py-1 w-full rounded-full",
                    !linkURL.trim()
                      ? "bg-[#f3f5f7] text-[#a7a9ac] cursor-not-allowed"
                      : "text-white bg-[#f7641b] hover:bg-[#eb611f] shadow-[#f7641b] hover:shadow-[#eb611f]"
                  )}
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImageInput && (
        <div className="absolute bottom-28 left-40 bg-white dark:bg-[#23272f] border border-gray-200 dark:border-[#23272f] rounded-lg shadow-lg p-6 flex flex-col gap-2 z-[9999] w-[350px]">
          {/* Arrow pointer at the bottom */}
          <div
            className="absolute -bottom-2 left-36 w-0 h-0"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid #fff",
            }}
          />
          {/* Heading with icon, text, and close button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <ImageIcon className="h-6 w-6 text-black dark:text-white" />
              <span className="font-semibold text-lg text-black dark:text-white">
                Add Image
              </span>
            </div>
            <button
              onClick={() => setShowImageInput(false)}
              className="p-1 rounded-full hover:bg-[rgba(15,55,95,0.05)] dark:hover:bg-[#363739] text-[#6b6d70] hover:text-[#76787b] dark:hover:text-white"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col space-y-8">
            {/* Upload image section */}
            <div className="flex flex-col space-y-2">
              <label className="text-[12.25px] text-black dark:text-white font-semibold">
                Upload image
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload-input"
                  onChange={handleImageFileChange}
                />
                <label
                  htmlFor="image-upload-input"
                  className="px-3 py-2 h-9 rounded-full w-fit border border-[#f7641b] text-[#f7641b] bg-white hover:bg-[#fbece3] dark:bg-[#481802] dark:text-[#f97936] dark:border-[#f97936] dark:hover:border-[#f7641b] dark:hover:text-[#f7641b] dark:hover:bg-[#612203] text-sm font-medium cursor-pointer"
                >
                  Choose
                </label>
                <span className="text-sm text-[#a7a9ac] dark:text-[#8b8d90]">
                  {imageInsertFile ? imageInsertFile.name : "Nothing selected"}
                </span>
              </div>
            </div>
            {/* Image from URL section */}
            <div className="flex flex-col space-y-2">
              <label className="text-[12.25px] text-black dark:text-white font-semibold">
                Image from URL
              </label>
              <input
                type="text"
                placeholder="Image URL"
                value={imageInsertUrl}
                onChange={handleImageUrlChange}
                className="pt-[9px] pb-[9px] pl-[16px] pr-[16px] rounded-lg border border-[rgba(3,12,25,0.23)] dark:bg-[#2d2f31] focus:border-[#f7641b] outline-none dark:text-white text-black text-sm"
              />
              {/* Placement options */}
              <span className="text-[12.25px] text-black dark:text-white font-semibold mr-2 pt-4">
                Placement:
              </span>
              <div className="flex flex-row mt-1 w-full">
                <button
                  onClick={() => setSelected("left")}
                  className={cn(
                    "w-1/2 py-2 h-9 rounded-l-full border text-sm font-medium focus:outline-none flex flex-row justify-center items-center gap-1",
                    selected === "left"
                      ? "bg-[#f7641b] border-[#f7641b] text-white hover:bg-[#eb611f] hover:border-[#eb611f]"
                      : "text-[#6b6d70] border-[#dfe1e4] hover:bg-white hover:text-[#f7641b] hover:border-[#dfe1e4]"
                  )}
                >
                  <AlignLeft className="h-6 w-6" />
                  <span>Left</span>
                </button>
                <button
                  onClick={() => setSelected("middle")}
                  className={cn(
                    "w-1/2 py-2 h-9 -ml-[1px] rounded-r-full border text-sm font-medium focus:outline-none flex flex-row justify-center items-center gap-1",
                    selected === "middle"
                      ? "bg-[#f7641b] border-[#f7641b] text-white hover:bg-[#eb611f] hover:border-[#eb611f]"
                      : "text-[#6b6d70] border-[#dfe1e4] hover:bg-white hover:text-[#f7641b] hover:border-[#dfe1e4]"
                  )}
                >
                  <AlignCenter className="h-6 w-6" />
                  <span>Middle</span>
                </button>
              </div>

              <div className="pt-4">
                <button
                  onClick={handlePlaceImage}
                  className="text-sm h-9 font-medium text-white px-3 py-1 w-full rounded-full bg-[#f7641b] hover:bg-[#eb611f] shadow-[#f7641b] hover:shadow-[#eb611f]"
                  disabled={!imageInsertFile && !imageInsertUrl}
                >
                  Place image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
