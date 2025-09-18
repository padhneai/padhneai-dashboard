import { Editor } from "@tinymce/tinymce-react";

export default function Texteditor({
  content,
  setContent,
  id,
  placeholder,
  label,
}: {
  label: string;
  content: string;
  setContent: (value: string) => void;
  id: string;
  placeholder?: string;
}) {
  const apikey  = process.env.NEXT_PUBLIC_TINYMCE_API_KEY!;
  
  return (
    <div className="p-5 w-full">
      <h1 className="text-xl font-bold mb-4">{label}</h1>
      <Editor
        apiKey={apikey}
        value={content}
        onEditorChange={(newContent) => setContent(newContent)}
        id={id}
        init={{
          height: 500,
          width: "100%",
          menubar: false,
          placeholder: placeholder || "Start writing here...",
          plugins: [
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "image",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
            "paste",
            "preview"
          ],
          // toolbar:
          //   "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | " +
          //   "forecolor backcolor | alignleft aligncenter alignright alignjustify | " +
          //   "bullist numlist outdent indent | blockquote | link image media table | " +
          //   "codesample emoticons charmap | removeformat preview",

          toolbar:
  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | " +
  "forecolor backcolor | alignleft aligncenter alignright alignjustify | " +
  "bullist numlist outdent indent | blockquote | link image media table | " +
  "imageoptions | codesample emoticons charmap | removeformat preview",
          toolbar_mode: "sliding", // makes it mobile friendly
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6 }",
          branding: false, // removes TinyMCE watermark
          elementpath: false, // hides element path at bottom
          statusbar: false, // hides status bar
          spellchecker_dialog: true,
          spellchecker_whitelist: ["PhadneAI", "NextJS"], // custom words
        }}
      />
    </div>
  );
}
