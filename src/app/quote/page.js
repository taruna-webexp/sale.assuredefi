"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import QuoteServices from "@/services/quoteService";
import moment from "moment";
import FormInputSelectWithHandler from "@/components/share/form/FormInputSelectWithHandler";
import { useForm } from "react-hook-form";
import FormInput from "@/components/share/form/FormInput";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import { errorMsg, successMsg } from "@/components/toaster/msg";
import QuoteModal from "@/components/share/modal/Quote";
import ConfirmationModal from "@/components/share/modal/Archive";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import Image from "next/image";
export default function QuotePage() {
  const [projects, setProjects] = useState([]);
  const [latestQuotes, setLatestQuotes] = useState([]);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [archiveConModal, setArchiveConModal] = useState(false);
  const [quoteId, setQuoteId] = useState("");

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await QuoteServices.getproject();
        if (response.status && response.data) {
          const formattedProjects = response.data.map((project) => ({
            ...project,
            label: project.name,
            value: project.id,
          }));

          const projectWithStaticOption = [
            { label: "All Active", value: "all-projects" },
            { label: "All Archive", value: "0" },
            ...formattedProjects,
          ];
          setProjects(projectWithStaticOption);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  //get all quotes
  const fetchAllQuotes = async () => {
    try {
      const { data } = await QuoteServices.allQutote();
      if (data.length) {
        const sortedQuotes = data.flatMap((project) =>
          project.quotes.map((quote) => ({
            ...quote,
            projectName: project.name,
            projectUpdatedAt: project.updatedAt,
          }))
        );
        setLatestQuotes(sortedQuotes);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    }
  };
  // Fetch all quotes
  useEffect(() => {
    fetchAllQuotes();
  }, []);

  // get all quotes base on project and archive id
  const filterProjectHandler = async (selectedProject) => {
    try {
      if (selectedProject === "0") {
        const response = await QuoteServices.getAllArchive();
        if (response.status && response.data) {
          const sortedQuotes = response.data.flatMap((project) =>
            project.quotes.map((quote) => ({
              ...quote,
              projectName: project.name,
              projectUpdatedAt: project.updatedAt,
            }))
          );
          setLatestQuotes(sortedQuotes);
        }
      } else if (selectedProject === "all-projects") {
        fetchAllQuotes();
      } else {
        try {
          const response = await QuoteServices.getProjectById(selectedProject);

          if (response.status && response.data) {
            const project = response.data;
            const sortedQuotes = project.quotes.map((quote) => ({
              ...quote,
              projectName: project.name,
              projectUpdatedAt: project.updatedAt,
            }));

            setLatestQuotes(sortedQuotes);
          }
        } catch (error) {
          errorMsg(error.message);
          console.error("Error fetching quotes for project:", error);
        }
      }
    } catch (error) {
      errorMsg("Error fetching quotes: " + error.message);
      console.error("Error fetching quotes:", error);
    }
  };

  const searchQuoteValue = watch("search-project")?.trim() || ""; //track current value for search field

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await QuoteServices.getProjectBySearch(
          searchQuoteValue
        );
        if (response.status && response.data) {
          const sortedQuotes = response.data.flatMap((project) =>
            project.quotes.map((quote) => ({
              ...quote,
              projectName: project.name,
              projectUpdatedAt: project.updatedAt,
            }))
          );
          setLatestQuotes(sortedQuotes);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setLatestQuotes([]);
      }
    };

    fetchSearchResults();
  }, [searchQuoteValue]);

  /// Quaote Edit Modal
  // const QuoteOpenModalHandler = () => {
  //   setQuoteModalOpen(true);
  // };
  // const QuoteCloseModalHandler = () => {
  //   setQuoteModalOpen(false);
  // };

  // Archive confirmation handler
  const archiveConfirmationHandler = async () => {
    try {
      const data = {
        archieve: 1,
      };
      const response = await QuoteServices.addQuoteArchive(quoteId, data);
      if (response.status == true) {
        successMsg("Quote successfully added to archive.");
        fetchAllQuotes();
      }
    } catch (error) {
      errorMsg(error.message);
      console.error("Error adding quote to archive:", error);
    } finally {
      archiveConfCloseHandler();
    }
  };

  const archiveConfOpenHandler = (id) => {
    console.log("id", id);
    setArchiveConModal(true);
    setQuoteId(id);
  };

  const archiveConfCloseHandler = () => {
    setArchiveConModal(false);
  };

  console.log("latestQuotes11111", process.env.NEXT_PUBLIC_GOOGLE_DOC_BASE_URL);
  return (
    <Box className="flex items-center justify-center dark-purple-bg px-6 mb-3.5 sales-container">
      <Container className="p-8 rounded-lg shadow-md !max-w-full mt-12 theme-border-light sales-outer">
        <Typography
          variant="h4"
          className="theme-color text-center font-bold mb-6"
        >
          Assure DeFi - Quote Dashboard
        </Typography>

        <Box className="flex justify-center mb-4 mt-5">
          <Button
            className="button-color w-full md:w-auto"
            variant="contained"
            href="/quote/add"
          >
            Generate New Quote
          </Button>
        </Box>

        <Box className="flex filter-outer">
          <Typography variant="h5" className="theme-color font-semibold !mb-3">
            All Saved Quotes
          </Typography>
          <div className="filter-item">
            <Box className="filter-input">
              <FormInput
                control={control}
                errors={errors}
                className="form-login-input"
                name="search-project"
                variant="outlined"
                placeholder="Search quote"
              />
            </Box>
            <Box className="filter-input">
              <FormInputSelectWithHandler
                options={[...projects]}
                control={control}
                errors={errors}
                className="form-login-input select-project"
                name="projects"
                variant="outlined"
                defaultValue="all-projects"
                onChange={filterProjectHandler}
              />
            </Box>
          </div>
        </Box>

        {latestQuotes.length ? (
          <div className="main-sale">
            <TableContainer
              component={Paper}
              className="!rounded-none MuiTable-root dark-purple-bg sales-table"
            >
              <Table className="quote-outer table-fixed">
                <TableHead>
                  <TableRow>
                    {[
                      "Project Name",
                      "Client",
                      "Created by",
                      "Product/Service",
                      "Amount",
                      "Date",
                      " View / Download / Archive",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        className="!p-2 theme-color theme-border-light"
                      >
                        <strong>{header}</strong>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {latestQuotes.map((quote) => {
                    let product = [];
                    console.log("quote", quote);
                    try {
                      product = quote.productServices
                        ? JSON.parse(quote.productServices)
                        : [];
                    } catch (error) {
                      console.error(
                        "Error parsing productServices JSON:",
                        error
                      );
                    }
                    return (
                      <TableRow key={quote.id}>
                        <TableCell className="!p-2 !text-white theme-border-light !text-sm capitalize">
                          {quote.projectName}
                        </TableCell>
                        <TableCell className="!p-2 !text-white theme-border-light !text-sm capitalize">
                          {quote.clientName}
                        </TableCell>
                        <TableCell className="!p-2 !text-white theme-border-light !text-sm capitalize">
                          {quote.userName}
                        </TableCell>
                        <TableCell className="!p-2 !text-white theme-border-light !text-sm capitalize">
                          {product.length > 0
                            ? product.map((prod, idx) => (
                                <div key={idx}>{prod.productService}</div>
                              ))
                            : "N/A"}
                        </TableCell>
                        <TableCell className="!p-2 !text-white theme-border-light !text-sm capitalize">
                          {product.length > 0
                            ? product.map((prod, idx) => {
                                return (
                                  <div
                                    key={idx}
                                    className="flex gap-2 items-center mb-1 amount-outer"
                                  >
                                    <span>{prod.amount}</span>
                                    {quote.currency == "USD" && (
                                      <Image
                                        src="/usd-icon.png"
                                        alt="Logo"
                                        width={18}
                                        height={18}
                                      />
                                    )}
                                    {quote.currency == "BNB" && (
                                      <Image
                                        src="/bnb-icon.png"
                                        alt="bnb-icon"
                                        width={18}
                                        height={18}
                                      />
                                    )}
                                    {quote.currency == "SOL" && (
                                      <Image
                                        src="/solana-icon.png"
                                        alt="sol-icon"
                                        width={18}
                                        height={18}
                                      />
                                    )}
                                    {quote.currency == "ETH" && (
                                      <Image
                                        src="/eth-icon.png"
                                        alt="sol-icon"
                                        width={18}
                                        height={18}
                                      />
                                    )}
                                  </div>
                                );
                              })
                            : "N/A"}
                        </TableCell>
                        <TableCell className="!p-2 !text-white theme-border-light !text-sm capitalize">
                          {quote.projectUpdatedAt
                            ? moment(quote.projectUpdatedAt).format(
                                "MMMM Do YYYY"
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell className="!p-2 !text-white theme-border-light w-28 !text-sm !text-center document-button">
                          <div className="flex flex-wrap gap-3">
                            <Link
                              href={`${process.env.NEXT_PUBLIC_GOOGLE_DOC_BASE_URL}${quote.templateId}`}
                              target="_blank"
                              className="mt-2"
                            >
                              <Button
                                className="button-color !text-white !px-2 !leading-5"
                                size="small"
                              >
                                <VisibilityOutlinedIcon />
                              </Button>
                            </Link>

                            <Link
                              href={`${process.env.NEXT_PUBLIC_GOOGLE_DOC_BASE_URL}${quote.templateId}/export?format=pdf`}
                              target="_blank"
                            >
                              <Button
                                className="button-color !text-white !px-2 !leading-5"
                                size="small"
                              >
                                <FileDownloadOutlinedIcon />
                              </Button>
                            </Link>

                            <Button
                              onClick={() => archiveConfOpenHandler(quote.id)}
                              className="button-color !text-white !px-2 !leading-5"
                              size="small"
                            >
                              <ArchiveOutlinedIcon />
                            </Button>

                            <Link href={`/quote/${quote.id}`}>
                              <Button
                                className="button-color !text-white !px-2 !leading-5"
                                size="small"
                              >
                                <EditTwoToneIcon />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <Typography variant="body1" className="text-gray-600 text-center">
            <span>No quotes saved yet.</span>
          </Typography>
        )}
      </Container>
      {/* <QuoteModal open={quoteModalOpen} close={QuoteCloseModalHandler} /> */}

      {/* /// archive confirmation modal */}
      <ConfirmationModal
        onConfirm={archiveConfirmationHandler}
        confirmMessage="Are you sure you want to archive this quote?"
        confirmTitle="Archive Confirmation"
        isOpen={archiveConModal}
        onClose={archiveConfCloseHandler}
      />
    </Box>
  );
}
