import "dotenv/config";
import express from "express";

import { upload, getFileUrl, usingS3, uploadsDir } from "./uploads.js";

const port = process.env.PORT || 8080;

// The notes are kept in memory, so they go back to these two every time the
// server restarts. A real deployment keeps them in a database instead.
const notes = [
  { id: 1, text: "Buy milk", attachment: null },
  { id: 2, text: "Finish the deployment tutorial", attachment: null },
];

let nextId = notes.length + 1;

const app = express();

app.use(express.static("dist"));

// With local storage the uploaded files are sitting on this machine, so this
// server has to serve them. In S3 mode nothing is stored here to serve.
if (!usingS3) {
  app.use("/uploads", express.static(uploadsDir));
}

app.get("/api/notes", async (req, res) => {
  // A note stores the name of its file, not a link to it, because an S3 link
  // expires. So the link is worked out fresh every time the notes are sent.
  const withUrls = await Promise.all(
    notes.map(async (note) => {
      if (!note.attachment) return note;

      return { ...note, url: await getFileUrl(note.attachment) };
    }),
  );

  res.json(withUrls);
});

// upload.single("file") runs before this handler. By the time the handler is
// reached the file has already been saved, and req.file describes where it is stored
app.post("/api/notes", upload.single("file"), (req, res) => {
  const note = {
    id: nextId++,
    text: req.body.text,
    // multer-s3 calls it "key", diskStorage "filename".
    attachment: req.file ? req.file.key || req.file.filename : null,
  };

  notes.push(note);

  res.status(201).json(note);
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
  console.log(
    `Storing uploaded files ${usingS3 ? "in S3" : "in backend/uploads"}`,
  );
});
