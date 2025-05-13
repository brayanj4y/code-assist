export const defaultCode = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Web Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Welcome to CodeAssist</h1>
    <p>This is a simple web page.  Edit the HTML, CSS, and JavaScript to create your own project!</p>
    <button id="changeColorBtn">Change Color</button> <p>Star the creator on GitHub: <a href="https://github.com/brayanj4y" target="_blank">@brayanj4y</a></p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,

  css: `body {
  font-family: sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f4f4f4; /* Light gray background */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Ensure content is centered vertically */
}

.container {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center; /* Center text within the container */
}

h1 {
  color: #333; /* Dark gray heading */
  margin-bottom: 15px;
}

p {
  line-height: 1.6;
  margin-bottom: 10px;
  color: #555; /* Slightly lighter gray for paragraphs */
}

#changeColorBtn {
  background-color: #4CAF50; /* Green button */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin: 10px 0; /* Added margin for spacing */
}

#changeColorBtn:hover {
  background-color: #45a049; /* Darker green on hover */
}

a {
  color: #007bff; /* Blue link color */
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}


/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }
  h1 {
    font-size: 1.8em;
  }
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
};
