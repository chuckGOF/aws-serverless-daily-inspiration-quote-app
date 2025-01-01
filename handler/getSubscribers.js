const {DynamoDBClient, ScanCommand} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient} = require("@aws-sdk/lib-dynamodb");
const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const USERS_TABLE = process.env.USERS_TABLE;
const api = process.env.SENDGRID_API_KEY

module.exports.getSubscribers = async (event, context, callback) => {
    const params = {
        TableName: USERS_TABLE
    }

    console.log(api)

    try {
        const data = await dynamodb.send(new ScanCommand(params))
        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Items)
        }
        callback(null, response)
    } catch (error) {
        console.error("Error::::", error)
        callback(new Error("Couldn't fetch users"))
        return {
            statusCode: 400,
            body: JSON.stringify({error: "Couldn't fetch users"})
        }
    }
}