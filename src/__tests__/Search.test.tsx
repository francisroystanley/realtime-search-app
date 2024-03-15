import { Search } from "@/components/Search";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const testData = [
  {
    id: 1,
    firstName: "John",
    maidenName: "Doe",
    lastName: "Smith",
    age: 30,
    gender: "M",
    email: "john.smith@example.com"
  },
  { id: 2, firstName: "Jane", maidenName: "Air", lastName: "Doe", age: 25, gender: "F", email: "jane.doe@example.com" }
];

describe("Search Component", () => {
  it("renders input and allows typing", async () => {
    render(<Search data={testData} />);

    const inputElement = screen.getByPlaceholderText("Enter First Name");
    await userEvent.type(inputElement, "John");
    expect(inputElement).toHaveValue("John");
  });

  it("filters results based on query", async () => {
    render(<Search data={testData} />);

    const inputElement = screen.getByPlaceholderText("Enter First Name");
    await userEvent.type(inputElement, "Jane");
    expect(screen.queryByText("john.smith@example.com")).not.toBeInTheDocument();
    expect(screen.getByText("jane.doe@example.com")).toBeInTheDocument();
  });

  it("allows changing filter type", async () => {
    render(<Search data={testData} />);

    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "1" } });
    const inputElement = screen.getByPlaceholderText("Enter Maiden Name");
    await userEvent.type(inputElement, "Doe");
    expect(screen.queryByText("jane.doe@example.com")).not.toBeInTheDocument();
    expect(screen.getByText("john.smith@example.com")).toBeInTheDocument();
  });

  it("displays all entries when no search query is given", () => {
    render(<Search data={testData} />);

    expect(screen.getByText("john.smith@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane.doe@example.com")).toBeInTheDocument();
  });
});

export {};
