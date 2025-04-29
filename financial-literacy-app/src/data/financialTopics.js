export const topics = {
    0: { id: 0, name: "Saving", description: "Setting aside income for future use." },
    1: { id: 1, name: "Budgeting", description: "Creating a plan to spend your money." },
    2: { id: 2, name: "Investing", description: "Using money to potentially earn a financial return." },
    3: { id: 3, name: "Emergency Fund", description: "Saving money for unexpected financial challenges." },
    4: { id: 4, name: "Retirement Planning", description: "Preparing for your financial needs after you stop working." },
    5: { id: 5, name: "Debt Management", description: "Strategies to control and pay off debts." },
    6: { id: 6, name: "Tax Planning", description: "Minimizing tax liability through legal means." },
    7: { id: 7, name: "Insurance", description: "Protecting against financial loss." },
    8: { id: 8, name: "Real Estate", description: "Investing in property." },
    9: { id: 9, name: "Stock Market", description: "Buying and selling shares of companies." },
    10: { id: 10, name: "Cryptocurrency", description: "Digital or virtual currencies secured by cryptography." },
    11: { id: 11, name: "Personal Loans", description: "Borrowing money for personal use." },
    12: { id: 12, name: "Financial Independence", description: "Having enough income to pay living expenses without employment." },
    13: { id: 13, name: "Credit Score Management", description: "Understanding and improving your creditworthiness." },
    14: { id: 14, name: "Estate Planning", description: "Arranging for the management and disposal of your estate." },
    15: { id: 15, name: "Financial Education", description: "Learning about various financial concepts and skills." },
    16: { id: 16, name: "Budget Allocation", description: "Deciding how to distribute funds within a budget." },
    17: { id: 17, name: "Saving for College", description: "Planning and saving for higher education costs." },
    18: { id: 18, name: "Investment Risk", description: "Understanding the potential for loss in investments." },
    19: { id: 19, name: "Credit Card Management", description: "Using credit cards responsibly and effectively." }
};

export const topics_groups = {
    "Financial Planning": [0, 1, 3, 4, 6, 16, 17, 14], // Added 14, 16, 17 here based on names
    "Investment Strategies": [2, 8, 9, 10],
    "Risk Management": [7, 18], // Added 18 here
    "Credit and Debt": [5, 11, 13, 19], // Added 19 here
    "Personal Finance Education": [15, 12], // Added 12 here
};

// Helper function to get topics by category name
export const getTopicsByCategory = (categoryName) => {
    const topicIds = topics_groups[categoryName] || [];
    return topicIds.map(id => topics[id]).filter(Boolean); // filter(Boolean) removes undefined if ID is invalid
}

// Helper function to get category by topic ID
export const getCategoryByTopicId = (topicId) => {
    for (const category in topics_groups) {
        if (topics_groups[category].includes(topicId)) {
            return category;
        }
    }
    return null;
}