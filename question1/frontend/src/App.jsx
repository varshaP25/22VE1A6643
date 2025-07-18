// App.js
import React, { useState } from "react";
import "./App.css"; // optional if you want to move styles to a separate CSS file

const App = () => {
  const [urls, setUrls] = useState([{ longUrl: "", validity: 30, shortcode: "" }]);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [error, setError] = useState("");

  const validateInput = (url, validity, shortcode) => {
    const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/+#-]*[\w@?^=%&/+#-])?$/;
    if (!urlRegex.test(url)) return "Invalid URL format";
    if (isNaN(validity) || validity <= 0) return "Validity must be a positive integer";
    if (shortcode && !/^[a-zA-Z0-9]{1,10}$/.test(shortcode)) return "Shortcode must be alphanumeric and max 10 characters";
    return "";
  };

  const handleShorten = () => {
    const newErrors = urls.map(({ longUrl, validity, shortcode }) =>
      validateInput(longUrl, validity, shortcode)
    );
    if (newErrors.some((err) => err)) {
      setError(newErrors.find((err) => err));
      return;
    }

    setError("");
    const newShortenedUrls = urls.map((url) => ({
      ...url,
      shortUrl: `http://localhost:3000/${Math.random().toString(36).substr(2, 6)}`,
      expiry: new Date(Date.now() + url.validity * 60000).toISOString(),
      clicks: 0,
      clickData: [],
    }));
    setShortenedUrls([...shortenedUrls, ...newShortenedUrls]);
    setUrls([{ longUrl: "", validity: 30, shortcode: "" }]);
  };

  const handleRedirect = (shortUrl) => {
    const urlData = shortenedUrls.find((u) => u.shortUrl === shortUrl);
    if (urlData && new Date(urlData.expiry) > new Date()) {
      urlData.clicks++;
      urlData.clickData.push({
        timestamp: new Date().toISOString(),
        source: "direct",
        location: "unknown",
      });
      setShortenedUrls([...shortenedUrls]);
      window.location.href = urlData.longUrl;
    } else {
      setError("URL expired or invalid");
    }
  };

  const handleInputChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      {urls.slice(0, 5).map((url, index) => (
        <div key={index} className="form-group">
          <input
            className="input-field"
            placeholder="Long URL"
            value={url.longUrl}
            onChange={(e) => handleInputChange(index, "longUrl", e.target.value)}
          />
          <input
            className="input-field"
            type="number"
            placeholder="Validity (minutes)"
            value={url.validity}
            onChange={(e) => handleInputChange(index, "validity", e.target.value)}
          />
          <input
            className="input-field"
            placeholder="Shortcode (optional)"
            value={url.shortcode}
            onChange={(e) => handleInputChange(index, "shortcode", e.target.value)}
          />
          {index < 4 && (
            <button onClick={() => setUrls([...urls, { longUrl: "", validity: 30, shortcode: "" }])}>
              Add URL
            </button>
          )}
        </div>
      ))}
      <button onClick={handleShorten}>Shorten URLs</button>
      {error && <div className="error">{error}</div>}

      <div className="shortened-urls">
        <h2>Shortened URLs</h2>
        {shortenedUrls.map((url, index) => (
          <div key={index} className="url-item">
            <p>
              Short URL:{" "}
              <a href="#" onClick={() => handleRedirect(url.shortUrl)}>
                {url.shortUrl}
              </a>
            </p>
            <p>Expiry: {url.expiry}</p>
            <p>Clicks: {url.clicks}</p>
          </div>
        ))}
      </div>

      <div className="stats">
        <h2>Statistics</h2>
        {shortenedUrls.map((url, index) => (
          <div key={index} className="url-item">
            <p>Short URL: {url.shortUrl}</p>
            <p>Created: {url.expiry}</p>
            <p>Expiry: {url.expiry}</p>
            <p>Total Clicks: {url.clicks}</p>
            {url.clickData.map((click, i) => (
              <div key={i}>
                <p>Click Timestamp: {click.timestamp}</p>
                <p>Source: {click.source}</p>
                <p>Location: {click.location}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;



























// import { useState } from 'react'
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//    return (
//      <>
//        <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p> 
//     </>
//   )
// }

// export default App
