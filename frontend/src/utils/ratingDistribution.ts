type RatingDistribution = {
    [key: string]: number;
};

// This function takes in an average rating and distributes ratings from 1 to 5 based on a strong bias towards the rounded average rating. (just for prototype -> would be better to make an accurate calculation if real application)
export function ratingDistribution(averageRating: number): RatingDistribution {
    const ratings = [1, 2, 3, 4, 5];
    const distribution: RatingDistribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    const roundedAverage = Math.round(averageRating);

    // --- Step 1: Define a strong bias towards the rounded average ---
    const weights: { [key: string]: number } = {};
    for (const rating of ratings) {
        // Higher weight if the rating is the rounded average
        if (rating === roundedAverage) {
            weights[rating.toString()] = 5; // Significantly higher weight
        } else {
            weights[rating.toString()] = 1 / (Math.abs(rating - averageRating) + 0.5);
        }
    }

    // --- Step 2: Normalize weights to get probabilities ---
    let totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    const probabilities: { [key: string]: number } = {};
    for (const rating of ratings) {
        probabilities[rating.toString()] = weights[rating.toString()] / totalWeight;
    }

    // --- Step 3: Simulate 100 picks based on probabilities ---
    for (let i = 0; i < 100; i++) {
        let randomNumber = Math.random();
        let cumulativeProbability = 0;

        for (const rating of ratings) {
            const ratingStr = rating.toString();
            cumulativeProbability += probabilities[ratingStr];

            if (randomNumber < cumulativeProbability) {
                distribution[ratingStr]++;
                break;
            }
        }
    }

    return distribution;
}