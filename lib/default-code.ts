export const defaultCode = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brutalist CodeAssist</title>
</head>
<body>
  <div class="container">
    <h1>🚧 Welcome To CodeAssist</h1>
    <p>This is your playground. Edit the HTML, CSS, and JS to build bold things!</p>
    <button id="changeColorBtn">Toggle Shadow</button>

    <div class="social-media">
      <h3>🔗 Connect with the Creator</h3>
      <a href="https://github.com/brayanj4y" target="_blank">🐱 GitHub</a>
      <a href="https://linkedin.com/in/brayan-j4y" target="_blank">💼 LinkedIn</a>
      <a href="https://instagram.com/brayanj4y" target="_blank">📸 Instagram</a>
    </div>
  </div>
</body>
</html>`,

  css: `body {
  font-family: 'Courier New', Courier, monospace;
  margin: 0;
  padding: 0;
  background-color: #fff;
  color: #000;
}

.container {
  width: 80%;
  margin: 40px auto;
  padding: 20px;
  background-color: #ffeb00;
  border: 5px solid black;
  box-shadow: 8px 8px 0 black;
}

h1 {
  font-size: 2.5rem;
  font-weight: 900;
  background: black;
  color: #ffeb00;
  padding: 10px;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  box-shadow: 6px 6px 0 #000;
  transition: box-shadow 0.3s ease;
}

p {
  font-size: 0.95rem;
  font-weight: bold;
  margin: 10px 0;
}

button {
  background-color: black;
  color: #ffeb00;
  border: 3px solid black;
  padding: 8px 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 4px 4px 0 black;
  text-transform: uppercase;
  transition: box-shadow 0.3s ease;
}

button:hover {
  background-color: #ffeb00;
  color: black;
  box-shadow: none;
}

.social-media {
  margin-top: 25px;
  padding: 10px;
  border-top: 3px dashed black;
}

.social-media h3 {
  margin-bottom: 12px;
  font-size: 1.2rem;
  text-transform: uppercase;
}

.social-media a {
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 8px;
  font-weight: 700;
  color: black;
  background: white;
  padding: 4px 8px;
  border: 2px solid black;
}

.social-media a:hover {
  background: black;
  color: #ffeb00;
  transition: all 0.2s ease-in-out;
}

.no-shadow {
  box-shadow: none !important;
}`,

  js: `document.addEventListener('DOMContentLoaded', function() {
  const changeColorBtn = document.getElementById('changeColorBtn');
  const header = document.querySelector('h1');

  changeColorBtn.addEventListener('click', function() {
    // Toggle shadows on header and button
    header.classList.toggle('no-shadow');
    this.classList.toggle('no-shadow');
  });
});`,
};
