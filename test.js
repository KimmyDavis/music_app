const fs = require("node:fs");
const folderPath = "./songs";

const reader = async () => {
  const songs = await fs.readdir(folderPath);
  console.log(songs);
};

reader();

// 4ce3ba4717086ea1f78bd187b7bf427f84a49707
// 1258464a838462c3181c420ec13df851dad0ad05
