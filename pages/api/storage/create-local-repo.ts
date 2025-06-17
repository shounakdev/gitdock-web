import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const BASE_PATH = process.env.GITDOCK_LOCAL_STORAGE!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { repoId, repoName } = req.body;

  if (!repoId || !repoName) {
    return res.status(400).json({ error: "Missing repoId or repoName" });
  }

  try {
    const folderName = `${repoId}_${repoName.replace(/\s+/g, "_")}`;
    const folderPath = path.join(BASE_PATH, folderName);

    fs.mkdirSync(folderPath, { recursive: true });
    fs.writeFileSync(path.join(folderPath, "README.md"), `# ${repoName}\n\nCreated by GitDock`);

    return res.status(200).json({ message: "Local repo initialized", path: folderPath });
  } catch (err: any) {
    console.error("Error writing to local disk:", err);
    return res.status(500).json({ error: "Failed to write to local path" });
  }
}