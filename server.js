const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();

app.use(cors());

app.get("/youtube", (req, res) => {

    const url = req.query.url;

    if (!url) {
        return res.status(400).json({
            error: "Missing url"
        });
    }

    const cmd = `yt-dlp -g "${url}"`;

    exec(cmd, (error, stdout, stderr) => {

        if (error) {

            return res.status(500).json({
                error: stderr || error.message
            });

        }

        const lines = stdout
            .trim()
            .split(/\r?\n/)
            .filter(x => x);

        if (!lines.length) {

            return res.status(500).json({
                error: "No stream found"
            });

        }

        const titleCmd = `yt-dlp --get-title "${url}"`;

exec(titleCmd, (e2, titleOut) => {

    res.json({

        youtube: url,
        title: titleOut.trim(),
        stream: lines[0],
        updated: Date.now()

    });

});

    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("================================");
    console.log("YouTube API Running");
    console.log("Running on port " + PORT);
    console.log("================================");

});
