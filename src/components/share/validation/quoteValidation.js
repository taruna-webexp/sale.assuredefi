import * as Yup from "yup";

export const addQuoteSchema = Yup.object().shape({
  clientEmail: Yup.string()
    .email("Invalid email format")
    .required("Client email is required"),
  clientName: Yup.string().required("Client name is required"),
  projectName: Yup.string().required("Project name is required"),
  productServices: Yup.array()
    .of(
      Yup.object().shape({
        productService: Yup.string().required("Product/service is required"),
        amount: Yup.number()
          .typeError("Amount must be a number")
          .positive("Amount must be greater than zero"),
        qty: Yup.number()
          .typeError("Quantity must be a number")
          .positive("Quantity must be greater than zero")
          .integer("Quantity must be a whole number"),
      })
    )
    .min(1, "At least one line item is required"),
});
