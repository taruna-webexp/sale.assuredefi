export const createGoogleDoc = async (data) => {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwwXtWbg5U66qKfS0mcZcRFirdZMi39BphI7Ks-wk5tQzMIZkXaIYYGbP6zyr84apWn/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain", // Change to text/plain to bypass CORS preflight
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json(); // Rename 'data' to 'responseData'
    console.log("Google Doc Created:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error creating Google Doc:", error);
    return { status: "error", message: error.message };
  }
};
