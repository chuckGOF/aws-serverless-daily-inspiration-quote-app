const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3")
const { Readeable } = require("stream")

const s3 = new S3Client()
const streamToString = (stream) =>
    new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });

module.exports.getQuotes = async (event, context, callback) => {
    console.log("Incoming::::", event)

    // get json file from s3
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: "quotes.json"
    })

    const res = await s3.send(command)
    if (!res) {
        console.error("Error::::", res)
        callback(new Error(res))
        return;
    } else {
        const json2string = await streamToString(res.Body)
        const quotes = JSON.parse(json2string)
        const response = {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Origin": "*"
            },
            statusCode: 200,
            body: JSON.stringify(quotes)
        }
        callback(null, response)
    }
}