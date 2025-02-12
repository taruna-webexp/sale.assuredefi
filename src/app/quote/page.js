"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
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
  const [loginUser, setLoginUser] = useState("");
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    // Retrieve saved quotes from localStorage
    const allProjects =
      JSON.parse(localStorage.getItem("ListOfProjects")) || [];
    setProjectList(allProjects);
  }, []);

  useEffect(() => {
    const user = Cookies.get("userDetail"); // Get the cookie value
    if (user) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(user));
        setLoginUser(parsedUser?.email);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
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
        <Typography variant="h5" className="theme-color font-semibold mb-4">
          All Saved Quotes
        </Typography>
        {projectList.length > 0 ? (
          <TableContainer component={Paper}>
            <Table className="bg-gray-300">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Project</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Client</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Notes</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Product/Service</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Amount</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Document</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectList.map((quote, index) => (
                  <TableRow key={index}>
                    <TableCell>{quote.projectName}</TableCell>
                    <TableCell>{quote.clientName}</TableCell>
                    <TableCell>{quote.notes}</TableCell>
                    <TableCell>
                      {quote.productServices.map((ps, i) => (
                        <Typography key={i}>
                          {ps.productService || "N/A"}
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell>
                      {quote.productServices.map((ps, i) => (
                        <Typography key={i}>{ps.amount}</Typography>
                      ))}
                    </TableCell>
                    <TableCell>
                      {new Date(quote.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link href={quote.docUrl} target="_blank">
                        <Button
                          className="button-color !text-white"
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

        {/* Logged-in User Info */}
        <Box className="flex justify-center mt-6">
          <Typography variant="body2">
            <strong>Logged in user:</strong> {loginUser || "Not logged in"}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
