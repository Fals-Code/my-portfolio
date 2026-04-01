async function listModels() {
  const apiKey = "AIzaSyC5Ut1yA7ry7q57Mw_QYtCfm6YXj3eM1jo"; // Use the key from .env.local direct for the script
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
