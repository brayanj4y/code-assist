export const defaultCode = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Web Page</title>
</head>
<body>
  <div class="container">
    <h1>Welcome to CodeAssist</h1>
    <p>This is a simple web page. Edit the HTML, CSS, and JavaScript to create your own project!</p>
    <button id="changeColorBtn">Change Color</button>
  </div>
</body>
</html>`,

  css: `body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 20px;
  background-color: #f8f9fa;
  color: #333;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2563eb;
  margin-top: 0;
}

button {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #1d4ed8;
}`,

  js: `// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get the button element
  const changeColorBtn = document.getElementById('changeColorBtn');
  
  // Add click event listener to the button
  changeColorBtn.addEventListener('click', function() {
    // Generate a random color
    const randomColor = getRandomColor();
    
    // Change the heading color
    document.querySelector('h1').style.color = randomColor;
    
    // Change the button background color
    this.style.backgroundColor = randomColor;
  });
  
  // Function to generate a random color
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
});`,
}
