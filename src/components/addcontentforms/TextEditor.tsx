
import { Editor } from '@tinymce/tinymce-react';
export default function Texteditor({ content, setContent ,id}: { content: string; setContent: (value: string) => void,id:string }) {
  return (
    <div className="p-5 w-full ">
      <h1 className="text-xl font-bold mb-4">Description</h1>
      <Editor
        apiKey="adcqj94qbelb4hxl3u8hliljc3kyf2ceq2flqhen709xvi3b"
        value={content} // Controlled value
        onEditorChange={(newContent) => setContent(newContent)} // Update content on change
        id={id}
        init={{
          height: 400,
          width: "100%",
          menubar: false,
          plugins: [
            "anchor", "autolink", "charmap", "codesample",
            "emoticons", "image", "link", "lists",
            "media", "searchreplace", "table",
            "visualblocks", "wordcount"
          ],
          toolbar:
            "undo redo | bold italic underline strikethrough | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | link image media table | " +
            "codesample emoticons charmap | removeformat",
          toolbar_mode: "wrap",
          content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
        }}
      />
    </div>
  );
}
