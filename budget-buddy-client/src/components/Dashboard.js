import React, { useState, useEffect } from "react";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: '', date: '' });
    const [error, setError] = useState("");
    const [editExpense, setEditExpense] = useState(null);

    // Fetch expenses
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const username = localStorage.getItem("username"); // Retrieve username from localStorage
                const response = await fetch("http://127.0.0.1:5001/expenses", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Username": username, // Send the username in the header
                    },
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setExpenses(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || "Failed to fetch expenses.");
                }
            } catch (error) {
                setError("An error occurred. Please try again.");
            }
        };
    
        fetchExpenses();
    }, []);    
    

    // Add new expense
    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            const username = localStorage.getItem("username");
            const expenseToAdd = { ...newExpense, amount: parseFloat(newExpense.amount) };

            const response = await fetch("http://127.0.0.1:5001/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Username": username,
                },
                body: JSON.stringify(expenseToAdd),
            });

            if (response.ok) {
                const createdExpense = await response.json();
                setExpenses([...expenses, createdExpense]);
                setNewExpense({ name: '', amount: '', category: '', date: '' });
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to add expense.");
            }
        } catch (error) {
            setError("An error occurred while adding the expense.");
        }
    };

    // Delete expense
    const handleDeleteExpense = async (id) => {
        try {
            const username = localStorage.getItem("username");
            const response = await fetch(`http://127.0.0.1:5001/expenses/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Username": username,
                },
            });

            if (response.ok) {
                setExpenses(expenses.filter(expense => expense.id !== id));
            } else {
                setError("Failed to delete expense.");
            }
        } catch (error) {
            setError("An error occurred while deleting the expense.");
        }
    };

    // Edit expense
    const handleEditExpense = async (e) => {
        e.preventDefault();
        try {
            const username = localStorage.getItem("username");
            const response = await fetch(`http://127.0.0.1:5001/expenses/${editExpense.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Username": username,
                },
                body: JSON.stringify(editExpense),
            });

            if (response.ok) {
                const updatedExpense = await response.json();
                setExpenses(expenses.map(exp => (exp.id === updatedExpense.id ? updatedExpense : exp)));
                setEditExpense(null); // Clear the edit form
            } else {
                setError("Failed to update expense.");
            }
        } catch (error) {
            setError("An error occurred while updating the expense.");
        }
    };

    // Calculate summary
    const totalExpenses = expenses.length;
    const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const categoryBreakdown = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
        return acc;
    }, {});

    return (
        <div>
            <h2>Welcome to Your Dashboard</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div>
                <h3>Summary</h3>
                <p>Total Expenses: {totalExpenses}</p>
                <p>Total Amount Spent: ${totalAmount.toFixed(2)}</p>
                <h4>Breakdown by Category:</h4>
                <ul>
                    {Object.entries(categoryBreakdown).map(([category, amount]) => (
                        <li key={category}>
                            {category}: ${amount.toFixed(2)}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3>{editExpense ? "Edit Expense" : "Add New Expense"}</h3>
                <form onSubmit={editExpense ? handleEditExpense : handleAddExpense}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={editExpense ? editExpense.name : newExpense.name}
                        onChange={(e) =>
                            editExpense
                                ? setEditExpense({ ...editExpense, name: e.target.value })
                                : setNewExpense({ ...newExpense, name: e.target.value })
                        }
                        required
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={editExpense ? editExpense.amount : newExpense.amount}
                        onChange={(e) =>
                            editExpense
                                ? setEditExpense({ ...editExpense, amount: e.target.value })
                                : setNewExpense({ ...newExpense, amount: e.target.value })
                        }
                        required
                    />
                    <select
                        value={editExpense ? editExpense.category : newExpense.category}
                        onChange={(e) =>
                            editExpense
                                ? setEditExpense({ ...editExpense, category: e.target.value })
                                : setNewExpense({ ...newExpense, category: e.target.value })
                        }
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Food">Food</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Subscriptions">Subscriptions</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                        <option value="Housing">Housing</option>
                    </select>
                    <input
                        type="date"
                        value={editExpense ? editExpense.date : newExpense.date}
                        onChange={(e) =>
                            editExpense
                                ? setEditExpense({ ...editExpense, date: e.target.value })
                                : setNewExpense({ ...newExpense, date: e.target.value })
                        }
                        required
                    />
                    <button type="submit">{editExpense ? "Update Expense" : "Add Expense"}</button>
                </form>
            </div>

            <div>
                <h3>Your Expenses</h3>
                <ul>
                    {expenses.map((expense) => (
                        <li key={expense.id}>
                            {expense.name} - ${expense.amount} ({expense.category}) on{' '}
                            {new Date(expense.date).toLocaleDateString()}
                            <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
                            <button onClick={() => setEditExpense(expense)}>Edit</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;