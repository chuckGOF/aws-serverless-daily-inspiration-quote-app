const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const axios = require("axios")



module.exports.sendEmail = async (event) => {
    const randQuote = await getQuote()
    const emailHTML = createEmailHTML(randQuote)
    const subscribers = await getSubscribers()

    try {
        await sgMail.sendMultiple({
            to: subscribers,
            from: process.env.EMAIL_FROM,
            subject: `[Daily Words of Wisdom]`,
            text: "Get Inspired Today",
            html: emailHTML
        })
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: error.message})
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({message: "OK"})
    }
}
const getQuote = async () => {
    const getQuotes = await axios.get(
        'https://o1l8bj0hn0.execute-api.eu-west-1.amazonaws.com/dev/quotes'
    )
    let length = getQuotes.data.quotes.length
    let randomQuote = getQuotes.data.quotes[Math.floor(Math.random() * length)]
    return randomQuote
}

const getSubscribers = async () => {
    const subscribers = await axios.get(
        'https://o1l8bj0hn0.execute-api.eu-west-1.amazonaws.com/dev/get-subscribers'
    )
    let list = []
    subscribers.data.forEach(subscriber => {
        list.push(subscriber.email.S)
    })
    return list
}

const createEmailHTML = (randQuote) => {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html lang="en">
        <body>
            <div class="container" style="min-height: 40vh; padding: 0 0.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center;"> 
                <div class="card" style="margin-left: 20px; margin-right: 20px;">
                    <div style="font-size: 14px;">
                        <div class='card' style="background: #f0c5c5; border-radius: 5px; padding: 1.75rem; font-size: 1.1rem; font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;">
                            <p>${randQuote.quote}</p>
                            <blockquote>by ${randQuote.author}</blockquote>
                        </div>
                        <br>
                    </div>
                    <div class="footer-links" style="display: flex; justify-content: center; align-items: center;">
                        <a href="/" style="text-decoration: none; margin: 8px; color: #9CA3AF;">Unsubscribe?</a>
                        <a href="/" style="text-decoration: none; margin: 8px; color: #9CA3AF;">About Us</a>
                    </div>
                </div>
            </div>
        </body>
    </html>`;
};