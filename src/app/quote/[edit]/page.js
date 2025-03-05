"use client";
import React from "react";
import EditQuotes from "./quoteEdit";
import { useSearchParams } from "next/navigation";
import { CircularProgress } from "@mui/material";

function EditQuote({ params }) {
  const [edit, setEdit] = React.useState(null);
  const searchParams = useSearchParams();
  const source = searchParams.get("source");

  React.useEffect(() => {
    async function getParams() {
      const resolvedParams = await params; // Unwrapping params
      setEdit(resolvedParams.edit);
    }
    getParams();
  }, [params]);

  if (!edit)
    return (
      <div className="text-center">
        <CircularProgress
          className="theme-color !text-sm !w-5 !h-5"
          fontSize="small"
        />
      </div>
    ); // Prevent rendering before params are resolved

  return (
    <div>
      <EditQuotes quoteId={edit} source={source} />
    </div>
  );
}

export default EditQuote;
