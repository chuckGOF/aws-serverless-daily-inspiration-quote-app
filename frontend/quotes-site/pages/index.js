import Head from "next/head";
import axios from "axios";
import { useState } from "react";

const Home = ({ initialQuote, initialError }) => {
  const [randomQuote, setRandomQuote] = useState(initialQuote);
  const [error, setError] = useState(initialError);

  const sendMessage = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(
        "https://o1l8bj0hn0.execute-api.eu-west-1.amazonaws.com/dev/static-mailer",
        {
          name: event.target.name.value,
          email: event.target.email.value,
          message: event.target.message.value,
        }
      );
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <div className="container">
      <Head>
        <title>Welcome</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Welcome!</h1>
        <h3 className="footer">
          Subscribe and Receive Inspirational Quotes Daily
        </h3>

        <p>Daily emails will look like this:</p>
        <div className="card">
          <span>
            <p>{randomQuote.quote}</p>
            <blockquote>by {randomQuote.author}</blockquote>
          </span>
        </div>

        <div className="grid">
          <form onSubmit={sendMessage}>
            <label htmlFor="name">Name: </label>
            <input id="name" name="name" type="text" required />

            <label htmlFor="email">Email: </label>
            <input id="email" name="email" type="email" required />

            <label htmlFor="message">Message: </label>
            <input id="message" name="message" type="text" required />
            <button className="button" type="submit">
              Subscribe
            </button>
          </form>
        </div>
      </main>

      <footer>Powered by Awesomeness</footer>

      <style jsx>{`
        /* Style inputs */
        input[type="text"],
        input[type="email"],
        select {
          width: 100%;
          padding: 12px 20px;
          margin: 8px 0;
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }

        /* Style the submit button */
        .button {
          width: 100%;
          background-color: #04aa6d;
          color: white;
          padding: 14px 20px;
          margin: 8px 0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        /* Add a background color to the submit button on mouse-over */
        .button:hover {
          background-color: #45a049;
        }

        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          text-align: center;
        }

        .footer {
          text-align: center;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover {
          color: #0070f3;
          border-color: #0070f3;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

Home.getInitialProps = async () => {
  try {
    const res = await axios.get(
      "https://o1l8bj0hn0.execute-api.eu-west-1.amazonaws.com/dev/quotes"
    );
    const quotes = res.data;
    const randomQuote =
      quotes.quotes[Math.floor(Math.random() * quotes.quotes.length)];
    return { initialQuote: randomQuote };
  } catch (error) {
    return { initialError: error };
  }
};

export default Home;
