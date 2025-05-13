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
    <img src="https://i.imgur.com/Gqy2x5O.png" alt="CodeAssist Mascot" class="header-img" />
    <h1>🚧 Welcome To CodeAssist</h1>
    <p>This is your playground. Edit the HTML, CSS, and JS to build bold things!</p>
    <button id="changeColorBtn">Change Theme</button>

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
  text-align: center;
}

.header-img {
  width: 120px;
  margin-bottom: 20px;
  border: 3px solid black;
  box-shadow: 5px 5px 0 black;
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
  transition: background-color 0.3s ease, color 0.3s ease;
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
  transition: all 0.3s ease;
}

button:hover {
  background-color: #ff0066;
  color: white;
  box-shadow: 2px 2px 0 black;
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
  text-decoration: none;
  box-shadow: 4px 4px 0 black; 
  transition: all 0.2s ease-in-out;
}

.social-media a:hover {
  background: black;
  color: #ffeb00;
}`,

  js: `document.addEventListener('DOMContentLoaded', function() {
  const changeColorBtn = document.getElementById('changeColorBtn');
  const container = document.querySelector('.container');
  const h1 = document.querySelector('h1');

  const colors = [
    { bg: '#ffeb00', text: '#000' },
    { bg: '#ff0066', text: '#fff' },
    { bg: '#00ffff', text: '#000' },
    { bg: '#222222', text: '#ffeb00' },
    { bg: '#ffffff', text: '#000' }
  ];

  let index = 0;

  changeColorBtn.addEventListener('click', () => {
    index = (index + 1) % colors.length;
    container.style.backgroundColor = colors[index].bg;
    h1.style.backgroundColor = colors[index].text;
    h1.style.color = colors[index].bg;
  });
});`,
};
