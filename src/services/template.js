export const createGoogleDoc = async (data) => {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzyJXd8QQcq7MFrC7xM7TTiFF1NNJMFTjWKiAqbORBuYXar3l1iEHoXQNfYAXpB60uM/exec",
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
