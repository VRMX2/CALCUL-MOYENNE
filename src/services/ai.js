
export const analyzeGrades = async (apiKey, grades, overview) => {
    // Note: apiKey is no longer used here, but kept in signature to minimize refactoring churn for now,
    // though the caller usually passes it. We can ignore it.

    const API_URL = 'http://localhost:5000/analyze';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                grades,
                overview
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to analyze grades');
        }

        const data = await response.json();
        return data.analysis;
    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
};
