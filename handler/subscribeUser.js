const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const uuid = require("uuid")

const USERS_TABLE = process.env.USERS_TABLE
const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

module.exports.subscribeUser = async (event, context, callback) => {
    const data = JSON.parse(event.body)
    console.log("EVENT::::", event.body)

    const timestamp = new Date().toISOString()

    if (typeof data.email !== "string") {
        console.error("Validation Failed")
        callback(new Error("Couldn't subscribe user because of validation errors"))
        return {
            statusCode: 400,
            body: JSON.stringify({error: "Validation Failed!"})
        }
    }

    const params = {
        TableName: USERS_TABLE,
        Item: {
            userId: uuid.v4(),
            email: data.email,
            subscriber: true,
            createdAt: timestamp,
            updatedAt: timestamp
        }
    }

    // write user to the database
    try {
        await dynamodb.send(new PutCommand(params))
        const response = {
            statusCode: 200,
            body: JSON.stringify(params.Item)
        }
        callback(null, response)
    } catch (error) {
        console.error("Error::::", error)
        callback(new Error("Couldn't subscribe user"))
        return {
            statusCode: 400,
            body: JSON.stringify({error: "Couldn't subscribe user"})
        }
    }
}

// const params = {
//     TableName: USERS_TABLE,
//     Item: {
//         userId: { S: uuid.v4() },
//         email: { S: data.email },
//         subscriber: { BOOL: true },
//         createdAt: { S: timestamp },
//         updatedAt: { S: timestamp }
//     }
// }