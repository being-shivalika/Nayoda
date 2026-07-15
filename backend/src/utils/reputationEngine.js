const { Review } = require("../models");

/**
 * Weighted reputation score (0-100), instead of a naive ratings average:
 *  - Verified-hire reviews count more than unverified ones
 *  - Recent reviews are weighted more heavily than old ones (recency decay)
 *  - A volume bonus rewards consistently high review counts (social proof)
 *  - Flagged/hidden reviews are excluded entirely (fraud detection)
 */
async function recomputeReputationForUser(userId) {
  const reviews = await Review.find({ subject: userId, isHidden: false });
  if (reviews.length === 0) return { reputationScore: 0, ratingAverage: 0, ratingCount: 0 };

  const now = Date.now();
  let weightedSum = 0;
  let weightTotal = 0;

  for (const r of reviews) {
    const ageDays = (now - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    const recencyWeight = Math.exp(-ageDays / 180); // ~half-life of ~125 days
    const verifiedWeight = r.isVerifiedHire ? 1.5 : 0.75;
    const weight = recencyWeight * verifiedWeight;

    weightedSum += r.rating * weight;
    weightTotal += weight;
  }

  const weightedAverage = weightedSum / weightTotal; // 0..5
  const volumeBonus = Math.min(10, Math.log2(reviews.length + 1) * 3); // up to +10
  const reputationScore = Math.min(100, Math.round((weightedAverage / 5) * 90 + volumeBonus));

  const ratingAverage = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return {
    reputationScore,
    ratingAverage: Math.round(ratingAverage * 10) / 10,
    ratingCount: reviews.length,
  };
}

module.exports = { recomputeReputationForUser };
