import React, { useState, useEffect } from "react";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ name: "", amount: "", category: "", date: "" });
    const [categories, setCategories] = useState(["Food", "Entertainment", "Subscriptions", "Miscellaneous", "Housing"]);
    const [newCategory, setNewCategory] = useState(""); // For creating custom categories
    const [editingExpense, setEditingExpense] = useState(null); // For tracking which expense is being edited
    const [errorMessage, setErrorMessage] = useState(""); // State for validation messages

    useEffect(() => {
        fetchExpenses();
    }, []);

    function fetchExpenses() {
        const username = localStorage.getItem("username"); // Get the logged-in user's username
        fetch("http://127.0.0.1:5001/expenses", {
            headers: { "Content-Type": "application/json", "Username": username }
        })
            .then((response) => response.json())
            .then((data) => setExpenses(data))
            .catch((error) => console.error("Failed to fetch expenses:", error));
    }

    function handleAddOrUpdateExpense(event) {
        event.preventDefault();

        // Validation
        if (!newExpense.name || !newExpense.amount || !newExpense.category || !newExpense.date) {
            setErrorMessage("All fields are required!");
            return;
        }
        if (newExpense.amount <= 0) {
            setErrorMessage("Amount must be greater than 0!");
            return;
        }

        setErrorMessage("");

        const username = localStorage.getItem("username"); // Get the logged-in user's username
        const url = editingExpense
            ? `http://127.0.0.1:5001/expenses/${editingExpense.id}`
            : "http://127.0.0.1:5001/expenses";
        const method = editingExpense ? "PATCH" : "POST";

        const expenseToSend = editingExpense || newExpense;

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json", "Username": username },
            body: JSON.stringify(expenseToSend),
        })
            .then((response) => response.json())
            .then(() => {
                fetchExpenses(); // Refresh the expense list
                setNewExpense({ name: "", amount: "", category: "", date: "" }); // Clear form
                setEditingExpense(null); // Clear edit mode
            })
            .catch((error) => console.error("Failed to add/update expense:", error));
    }

    function handleDeleteExpense(expenseId) {
        const username = localStorage.getItem("username"); // Get the logged-in user's username
        fetch(`http://127.0.0.1:5001/expenses/${expenseId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Username": username },
        })
            .then(() => fetchExpenses()) // Refresh the expense list
            .catch((error) => console.error("Failed to delete expense:", error));
    }

    function handleCreateCategory() {
        if (newCategory.trim() === "") {
            alert("Category name cannot be empty!"); // Basic validation
            return;
        }
        setCategories([...categories, newCategory]); // Add new category to the list
        setNewCategory(""); // Clear the input
    }

    return (
        <div>
            <h2>Welcome to Your Dashboard</h2>

            {/* Validation error message */}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            {/* Form for adding or updating an expense */}
            <form onSubmit={handleAddOrUpdateExpense}>
                <input
                    type="text"
                    placeholder="Expense Name"
                    value={editingExpense ? editingExpense.name : newExpense.name}
                    onChange={(e) =>
                        editingExpense
                            ? setEditingExpense({ ...editingExpense, name: e.target.value })
                            : setNewExpense({ ...newExpense, name: e.target.value })
                    }
                    required
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={editingExpense ? editingExpense.amount : newExpense.amount}
                    onChange={(e) =>
                        editingExpense
                            ? setEditingExpense({ ...editingExpense, amount: e.target.value })
                            : setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    required
                />
                <select
                    value={editingExpense ? editingExpense.category : newExpense.category}
                    onChange={(e) =>
                        editingExpense
                            ? setEditingExpense({ ...editingExpense, category: e.target.value })
                            : setNewExpense({ ...newExpense, category: e.target.value })
                    }
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    value={editingExpense ? editingExpense.date : newExpense.date}
                    onChange={(e) =>
                        editingExpense
                            ? setEditingExpense({ ...editingExpense, date: e.target.value })
                            : setNewExpense({ ...newExpense, date: e.target.value })
                    }
                    required
                />
                <button type="submit">{editingExpense ? "Update Expense" : "Add Expense"}</button>
            </form>

            {/* Form for creating a new category */}
            <div>
                <input
                    type="text"
                    placeholder="New Category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button onClick={handleCreateCategory}>Add Category</button>
            </div>

            {/* List of expenses */}
            <ul>
                {expenses.map((expense) => (
                    <li key={expense.id}>
                        {expense.name} - ${expense.amount} ({expense.category}) on {expense.date}
                        <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
                        <button onClick={() => setEditingExpense(expense)}>Update</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;