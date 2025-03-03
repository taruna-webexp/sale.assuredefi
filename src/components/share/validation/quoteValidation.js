import * as yup from "yup";

export const addQuoteSchema = yup.object().shape({
  clientName: yup.string().required("Client name is required"),
  projectName: yup.string().required("Project name is required"),
  productServices: yup
    .array()
    .of(
      yup.object().shape({
        productService: yup
          .string()
          .required("Product/Service name is required"),
        amount: yup
          .string("This field is required")
          .typeError("Amount must be a number")
          .required("Amount is required"),
        qty: yup
          .number()
          .typeError("Quantity must be a number")
          .positive("Quantity must be greater than zero")
          .integer("Quantity must be a whole number")
          .required("Quantity is required"),
      })
    )
    .min(1, "At least one product/service is required"),
});
