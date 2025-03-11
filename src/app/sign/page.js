// "use client";
// import { useState } from "react";

// export default function SignDocument({ linkpdf, email, name }) {
//   console.log("linkpdf", linkpdf);

//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [response, setResponse] = useState(null);

//   const handleSignRequest = async () => {
//     const response = await fetch("https://api.signwell.com/v1/documents", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_SIGNWELL_API_KEY}`,
//       },
//       body: JSON.stringify({
//         file_url: linkpdf,
//         signers: [{ email, name }],
//         test_mode: true,
//       }),
//     });

//     const data = await res.json();
//     setResponse(data);
//   };
// }
