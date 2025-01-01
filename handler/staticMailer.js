const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const axios = require("axios");

const sns = new SNSClient()

const publishToSNS = async (message) => {
    const input = {
        Message: message,
        TopicArn: process.env.SNS_TOPIC_ARN
    }

    await sns.send(new PublishCommand(input))
}

const buildEmailBody = (id, form) => {
    return `
        Message: ${form.message}
        Name: ${form.name}
        Email: ${form.email}
        Service Information: ${id.sourceIp} - ${id.userAgent}
    `
}

module.exports.staticMailer = async (event) => {
    console.log("EVENT::::", event)
    const data = JSON.parse(event.body)
    const emailBody = buildEmailBody(event.requestContext.identity, data)

    await publishToSNS(emailBody)

    await axios.post(
        'https://o1l8bj0hn0.execute-api.eu-west-1.amazonaws.com/dev/subscribe',
        {
            email: data.email
        }
    ).then((response) => {
        console.log("Response::::", response)
    }).catch((error) => {
        console.error("Error::::", error)        
    })

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": false
        },
        body: JSON.stringify({message: "Email sent!"})
    }

}