import React from "react";
import EditQuotes from "./quoteEdit";

function EditQuote({ params }) {
  const { edit } = params;
  return (
    <div>
      <EditQuotes quoteId={edit} />
    </div>
  );
}

export default EditQuote;
