export const createGoogleDoc = async (data) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_GOOGLE_DOC_API, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Google Doc Created:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error creating Google Doc:", error);
    return { status: "error", message: error.message };
  }
};
