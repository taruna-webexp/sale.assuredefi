"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Link from "next/link";

export default function QuotePage() {
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    // Retrieve saved quotes from localStorage
    const allProjects =
      JSON.parse(localStorage.getItem("ListOfProjects")) || [];
    setProjectList(allProjects);
  }, []);

  return (
    <Box className="min-h-screen flex items-center justify-center dark-purple-bg">
      <Container className="p-8 rounded-lg shadow-md !max-w-5xl min-h-screen mt-12 theme-border-light">
        {/* Title */}
        <Typography
          variant="h4"
          className="theme-color text-center font-bold mb-6"
        >
          Assure DeFi - Quote Dashboard
        </Typography>

        {/* Generate New Quote Button */}
        <Box className="flex justify-center">
          <Link href="/quote/add">
            <Button
              className="button-color w-full md:w-auto"
              type="submit"
              variant="contained"
              sx={{ marginTop: 2, marginBottom: 4 }}
            >
              Generate New Quote
            </Button>
          </Link>
        </Box>

        {/* All Saved Quotes */}
        <Typography variant="h5" className="theme-color font-semibold !mb-3">
          All Saved Quotes
        </Typography>

        {projectList.length > 0 ? (
          <TableContainer
            component={Paper}
            className="!rounded-none bg-transparent"
          >
            <Table className="dark-purple-bg sales-table">
              <TableHead>
                <TableRow>
                  <TableCell className="!p-2 theme-color theme-border-light">
                    <strong>Project</strong>
                  </TableCell>
                  <TableCell className="!p-2 theme-color theme-border-light">
                    <strong>Client</strong>
                  </TableCell>
                  <TableCell className="!p-2 theme-color theme-border-light">
                    <strong>Notes</strong>
                  </TableCell>
                  <TableCell className="!p-2 theme-color theme-border-light">
                    <strong>Product/Service</strong>
                  </TableCell>
                  <TableCell className="!p-2 theme-color theme-border-light">
                    <strong>Amount</strong>
                  </TableCell>
                  <TableCell className="!p-2 theme-color theme-border-light">
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell className="!p-2 theme-color theme-border-light">
                    <strong>Document</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectList.map((quote, index) => (
                  <TableRow key={index}>
                    <TableCell className="!p-2 !text-white theme-border-light !text-sm capitalize w-32">
                      {quote.projectName}
                    </TableCell>
                    <TableCell className="!p-2 !text-white theme-border-light !text-sm capitalize w-40">
                      {quote.clientName}
                    </TableCell>
                    <TableCell className="!p-2 !text-white theme-border-light w-60 !text-sm">
                      {quote.notes}
                    </TableCell>
                    <TableCell className="!p-2 !text-white theme-border-light capitalize">
                      {quote.productServices.map((ps, i) => (
                        <Typography key={i}>
                          {ps.productService || "N/A"}
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell className="!p-2 !text-white theme-border-light !text-sm">
                      {quote.productServices.map((ps, i) => (
                        <Typography key={i}>{ps.amount}</Typography>
                      ))}
                    </TableCell>
                    <TableCell className="!p-2 !text-white theme-border-light !text-sm">
                      {new Date(quote.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="!p-2 !text-white theme-border-light w-28 !text-sm !text-center">
                      <Link href={quote.docUrl} target="_blank">
                        <Button
                          className="button-color !text-white !px-2 !leading-5 "
                          size="small"
                        >
                          View Doc
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" className="text-gray-600">
            No quotes saved yet.
          </Typography>
        )}
      </Container>
    </Box>
  );
}
