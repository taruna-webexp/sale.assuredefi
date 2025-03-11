// app/api/signature/route.js
import axios from "axios";

export async function POST(request) {
  const { documentId, signerEmail, signerName } = await request.json();

  const apiKey = process.env.SIGNWELL_API_KEY;
  const apiUrl = "https://api.signwell.com/v1/documents";

  try {
    const response = await axios.post(
      apiUrl,
      {
        document_id: documentId,
        signers: [
          {
            email: signerEmail,
            name: signerName,
          },
        ],
        test_mode: true, // Testing mode
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
