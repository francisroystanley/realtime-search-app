import { Search } from "@/components/Search";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Sample data to be used in tests for the Search component.
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
  {
    id: 2,
    firstName: "Jane",
    maidenName: "Air",
    lastName: "Doe",
    age: 25,
    gender: "F",
    email: "jane.doe@example.com"
  }
];

// Describe block defines a test suite for the Search component.
describe("Search Component", () => {
  // Test case to ensure that the input element is rendered and allows typing into it.
  it("renders input and allows typing", async () => {
    // Render the Search component with the provided testData.
    render(<Search data={testData} />);

    // Query for the input element with a specific placeholder text.
    const inputElement = screen.getByPlaceholderText("Enter First Name");
    // Simulate the user typing the name "John" into the input element.
    await userEvent.type(inputElement, "John");
    // Assert that the input element's value is now "John".
    expect(inputElement).toHaveValue("John");
  });

  // Test case to check if the Search component correctly filters results based on the user query.
  it("filters results based on query", async () => {
    // Render the Search component with the provided testData.
    render(<Search data={testData} />);

    // Query for the input element with a specific placeholder and type "Jane" into it.
    const inputElement = screen.getByPlaceholderText("Enter First Name");
    await userEvent.type(inputElement, "Jane");
    // Assert that John Smith's email should not be present in the document as it doesn't match the filter.
    expect(screen.queryByText("john.smith@example.com")).not.toBeInTheDocument();
    // Assert that Jane Doe's email should be present in the document as it matches the filter.
    expect(screen.getByText("jane.doe@example.com")).toBeInTheDocument();
  });

  // Test case to ensure changing the filter type works as expected.
  it("allows changing filter type", async () => {
    // Render the Search component with the provided testData.
    render(<Search data={testData} />);

    // Get the select element which acts as a combobox for selecting filter types.
    const selectElement = screen.getByRole("combobox");
    // Change the selected option of the combobox.
    fireEvent.change(selectElement, { target: { value: "1" } });
    // Find the input element by its new placeholder after selecting a different filter type.
    const inputElement = screen.getByPlaceholderText("Enter Maiden Name");
    // Type "Doe" into the input element after changing filter type.
    await userEvent.type(inputElement, "Doe");
    // Assert that Jane Doe's email does not appear when filtering by maiden name.
    expect(screen.queryByText("jane.doe@example.com")).not.toBeInTheDocument();
    // Assert that John Smith's email appears since his maiden name matches the filter string.
    expect(screen.getByText("john.smith@example.com")).toBeInTheDocument();
  });

  // Test case to verify that all entries are displayed when no search query is given.
  it("displays all entries when no search query is given", () => {
    // Render the Search component without typing anything into the search input.
    render(<Search data={testData} />);

    // Assert that the emails of both test data entries are present in the document.
    expect(screen.getByText("john.smith@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane.doe@example.com")).toBeInTheDocument();
  });
});
