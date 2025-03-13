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
  CircularProgress,
  TextField,
  Autocomplete,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import QuoteServices from "@/services/quoteService";
import moment from "moment";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { useForm } from "react-hook-form";
import FormInput from "@/components/share/form/FormInput";
import { errorMsg, successMsg } from "@/components/toaster/msg";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import UnarchiveOutlinedIcon from "@mui/icons-material/UnarchiveOutlined";
import ConfirmationModal from "@/components/share/modal/Archive";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileSignature } from "@fortawesome/free-solid-svg-icons";

export default function QuotePage() {
  const [projects, setProjects] = useState([]);
  const [latestQuotes, setLatestQuotes] = useState([]);
  const [archive, setArchive] = useState();
  const [archiveConModal, setArchiveConModal] = useState(false);
  const [quoteId, setQuoteId] = useState("");
  const [selectProjects, setSelectProjects] = useState("");
  const [loading, setLoading] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState({
    label: "All Active",
    value: "all-projects",
  });
  const [searchInput, setSearchInput] = useState("");
  const {
    control,
    watch,
    formState: { errors },
  } = useForm();

  // Function to fetch default projects from API
  const fetchDefaultProjects = async () => {
    try {
      setIsLoading(true);
      const response = await QuoteServices.searchByProject();
      if (response.status && response.data) {
        const formattedProjects = response.data.map((project) => ({
          label: project.name,
          value: project.id,
        }));

        const projectWithStaticOptions = [
          { label: "All Active", value: "all-projects" },
          { label: "All Archive", value: "0" },
          ...formattedProjects,
        ];

        setProjects(projectWithStaticOptions);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Initial Project List on Mount
  useEffect(() => {
    fetchDefaultProjects();
  }, []);

  // Fetch Projects Based on Search Input (3 or more characters)
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchInput.length >= 3) {
        try {
          const response = await QuoteServices.getProjectBySearch(searchInput);
          if (response.status && response.data.length) {
            const formattedProjects = response.data.map((project) => ({
              label: project.name,
              value: project.id,
            }));
            setProjects(formattedProjects);
          }
        } catch (error) {
          setLatestQuotes([]);
          console.error("Error fetching search results:", error);
        }
      }
    };

    fetchSearchResults();
  }, [searchInput]);

  // Fetch All Quotes
  const fetchAllQuotes = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQuotes();
  }, []);

  // Filter Quotes Based on Selected Project
  const filterProjectHandler = async (selectedProjectValue) => {
    setSelectedProject(projects.find((p) => p.value === selectedProjectValue));
    setIsLoading(true);
    try {
      if (selectedProjectValue === "0") {
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
      } else if (selectedProjectValue === "all-projects") {
        fetchAllQuotes();
      } else {
        try {
          const response = await QuoteServices.getProjectById(
            selectedProjectValue
          );
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
    } finally {
      setIsLoading(false);
    }
  };
  //track current value for search field
  const searchQuoteValue = watch("search-project")?.trim() || "";

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
        } else {
          setLatestQuotes([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [searchQuoteValue]);

  // Archive confirmation handler
  const archiveConfirmationHandler = async () => {
    try {
      const data = {
        archieve: archive,
      };
      const response = await QuoteServices.addQuoteArchive(quoteId, data);
      if (response.status == true) {
        successMsg("Quote successfully added to archive.");
        if (archive === 1) {
          fetchAllQuotes();
        } else {
          filterProjectHandler(selectProjects);
        }
      }
    } catch (error) {
      errorMsg(error.message);
      console.error("Error adding quote to archive:", error);
    } finally {
      archiveConfCloseHandler();
    }
  };

  // Archive confirmation open handler
  const archiveConfOpenHandler = (id, isArchive) => {
    setArchive(isArchive);
    setArchiveConModal(true);
    setQuoteId(id);
  };
  // Archive confirmation close handler

  const archiveConfCloseHandler = () => {
    setArchiveConModal(false);
  };

  //Signwell api handle
  const handleSignRequest = async (
    fileName,
    fileUrl,
    clientName,
    email,
    quoteId
  ) => {
    const data = { email, fileName: `${fileName}.pdf`, fileUrl, clientName };
    try {
      setLoading((prev) => ({ ...prev, [quoteId]: true })); // Set loading for specific button
      const response = await QuoteServices.signwellApi(data);
      successMsg(`Signature request sent to ${email}!`);
      fetchAllQuotes();
      return response.data;
    } catch (error) {
      errorMsg(error);
    } finally {
      setLoading((prev) => ({ ...prev, [quoteId]: false })); // Reset loading state
    }
  };

  //Autocomplete clear value handler
  const handleClearValue = () => {
    fetchDefaultProjects();
  };
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
              <Autocomplete
                className="form-login-input"
                freeSolo
                options={projects}
                getOptionLabel={(option) => option.label || ""}
                value={selectedProject} // Keeps the selected value
                onInputChange={(event, newInputValue) => {
                  if (event?.type === "change") {
                    setSearchInput(newInputValue);
                  }
                }}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setSelectedProject(newValue);
                    filterProjectHandler(newValue.value);
                  } else {
                    handleClearValue();
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="autocomplete-text-field"
                    variant="outlined"
                    placeholder="Search or type to create a project"
                  />
                )}
              />
            </Box>
          </div>
        </Box>
        {isLoading ? (
          <div className="text-center">
            <CircularProgress
              className="theme-color !text-sm !w-5 !h-5"
              fontSize="small"
            />
          </div>
        ) : latestQuotes.length > 0 ? (
          <div className="main-sale">
            <TableContainer
              component={Paper}
              className="!rounded-none MuiTable-root dark-purple-bg sales-table"
            >
              <Table className="quote-outer table-auto">
                <TableHead>
                  <TableRow>
                    {[
                      "Project Name",
                      "Client",
                      "Created by",
                      "Product/Service",
                      "Amount",
                      "Date",
                      latestQuotes.some((quote) => quote.archieve === false)
                        ? "View / Download / Archive / Edit / Clone"
                        : "View / Download / Unarchive / Clone",
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

                    try {
                      if (typeof quote.productServices === "string") {
                        product = JSON.parse(quote.productServices);
                      } else if (Array.isArray(quote.productServices)) {
                        product = quote.productServices;
                      }
                      if (!Array.isArray(product)) {
                        product = [];
                      }
                    } catch (error) {
                      console.error(
                        "Error parsing productServices JSON:",
                        error
                      );
                      product = [];
                    }
                    return (
                      <TableRow key={quote.id}>
                        <TableCell className="!p-2 !text-white theme-border-light !text-sm capitalize">
                          {quote.projectName}
                        </TableCell>
                        <TableCell className="!p-2 !text-white theme-border-light !text-sm capitalize">
                          {quote.clientName}
                        </TableCell>
                        <TableCell className="!p-2 !text-white theme-border-light !text-sm ">
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
                            ? (() => {
                                const total = product
                                  .reduce(
                                    (sum, item) =>
                                      sum +
                                      (Number(item.amount) * item.qty || 0),
                                    0
                                  )
                                  .toFixed(2);

                                return (
                                  <div className="flex gap-2 items-center mb-1 amount-outer">
                                    {quote.currency === "USD" && (
                                      <Image
                                        src="/usd-icon.png"
                                        alt="USD Icon"
                                        width={18}
                                        height={18}
                                      />
                                    )}
                                    {quote.currency === "BNB" && (
                                      <Image
                                        src="/bnb-icon.png"
                                        alt="BNB Icon"
                                        width={18}
                                        height={18}
                                      />
                                    )}
                                    {quote.currency === "SOL" && (
                                      <Image
                                        src="/solana-icon.png"
                                        alt="SOL Icon"
                                        width={18}
                                        height={18}
                                      />
                                    )}
                                    {quote.currency === "ETH" && (
                                      <Image
                                        src="/eth-icon.png"
                                        alt="ETH Icon"
                                        width={18}
                                        height={18}
                                      />
                                    )}
                                    <span>{total}</span>
                                  </div>
                                );
                              })()
                            : "N/A"}
                        </TableCell>
                        <TableCell className="!p-2 !text-white theme-border-light !text-sm capitalize">
                          {quote.projectUpdatedAt
                            ? moment(quote.projectUpdatedAt).format(
                                "MMMM Do YYYY"
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell className="!p-2 !text-white theme-border-light w-32 !text-sm !text-center document-button">
                          <div className="flex flex-wrap gap-3 document-icons">
                            <Tooltip
                              title="View Google Document"
                              placement="top"
                              arrow
                            >
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
                            </Tooltip>

                            <Tooltip title="Download PDF" placement="top" arrow>
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
                            </Tooltip>
                            {quote.archieve === false ? (
                              <Tooltip
                                title="Move Quote to Archive"
                                placement="top"
                                arrow
                              >
                                <Button
                                  onClick={() =>
                                    archiveConfOpenHandler(quote.id, 1)
                                  }
                                  className="button-color !text-white !px-2 !leading-5"
                                  size="small"
                                >
                                  <ArchiveOutlinedIcon />{" "}
                                </Button>
                              </Tooltip>
                            ) : (
                              <Tooltip
                                title="Unarchive Quote"
                                placement="top"
                                arrow
                              >
                                <Button
                                  onClick={() =>
                                    archiveConfOpenHandler(quote.id, 0)
                                  }
                                  className="button-color !text-white !px-2 !leading-5"
                                  size="small"
                                >
                                  <UnarchiveOutlinedIcon />
                                </Button>
                              </Tooltip>
                            )}
                            {quote.archieve === false && (
                              <Tooltip title="Edit Quote" placement="top" arrow>
                                <Link href={`/quote/${quote.id}`}>
                                  <Button
                                    className="button-color !text-white !px-2 !leading-5"
                                    size="small"
                                  >
                                    <EditTwoToneIcon />
                                  </Button>
                                </Link>
                              </Tooltip>
                            )}
                            <Tooltip title="Clone Quote" placement="top" arrow>
                              <Link
                                href={`/quote/${quote.id}?source=clonequote`}
                              >
                                <Button
                                  className="button-color !text-white !px-2 !leading-5"
                                  size="small"
                                >
                                  <ContentCopyOutlinedIcon />
                                </Button>
                              </Link>
                            </Tooltip>
                            {quote.signWellId !== null ? (
                              <Tooltip
                                title="Documents Signed"
                                placement="top"
                                arrow
                              >
                                <Button
                                  className="button-color !text-white !px-2 !leading-5 !cursor-not-allowed"
                                  size="small"
                                >
                                  <FontAwesomeIcon
                                    icon={faFileSignature}
                                    className="!text-md"
                                  />
                                </Button>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Sign Docs" placement="top" arrow>
                                <Button
                                  onClick={() =>
                                    handleSignRequest(
                                      quote.projectName,
                                      `${process.env.NEXT_PUBLIC_GOOGLE_DOC_BASE_URL}${quote.templateId}/export?format=pdf`,
                                      quote.clientName,
                                      quote.clientEmail,
                                      quote.id
                                    )
                                  }
                                  className={`button-color !text-white !px-2 !leading-5 ${
                                    quote.signWellId !== null ? "disabled" : ""
                                  }`}
                                  size="small"
                                >
                                  {loading[quote.id] ? (
                                    <CircularProgress className="theme-color !w-5 !h-5" />
                                  ) : (
                                    <FontAwesomeIcon
                                      icon={faFileSignature}
                                      className="!text-md"
                                    />
                                  )}
                                </Button>
                              </Tooltip>
                            )}
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

      {/* archive confirmation modal */}
      <ConfirmationModal
        onConfirm={archiveConfirmationHandler}
        confirmMessage={
          archive === 1
            ? "Are you sure you want to archive this quote?"
            : "Are you sure you want to unarchive this quote?"
        }
        confirmTitle={
          archive === 1 ? "Archive Confirmation" : "Unarchive Confirmation"
        }
        isOpen={archiveConModal}
        archive={archive}
        onClose={archiveConfCloseHandler}
      />
    </Box>
  );
}
