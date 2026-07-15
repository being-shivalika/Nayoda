/**
 * Lightweight AI-matching engine.
 *
 * In production this can call out to a Hugging Face sentence-similarity
 * model (e.g. `sentence-transformers/all-MiniLM-L6-v2`) via the Inference API
 * to embed gig requirements and freelancer skill sets, then rank by cosine
 * similarity. That call is stubbed behind `getEmbeddingSimilarity` below so
 * the rest of the scoring pipeline (distance, rating, price-fit) stays the
 * same regardless of which embedding backend is wired up.
 */

const axios = require("axios");

const HF_API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2";

// Haversine distance in km between two [lng, lat] points.
function distanceKm([lng1, lat1], [lng2, lat2]) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Simple, dependency-free skill overlap score (Jaccard index), used as the
// default / fallback when no Hugging Face API key is configured.
function jaccardSkillScore(gigSkills = [], freelancerSkills = []) {
  const a = new Set(gigSkills.map((s) => s.toLowerCase().trim()));
  const b = new Set(freelancerSkills.map((s) => s.toLowerCase().trim()));
  if (a.size === 0 || b.size === 0) return 0;
  const intersection = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return intersection / union; // 0..1
}

async function getEmbeddingSimilarity(gigText, freelancerText) {
  if (!process.env.HUGGINGFACE_API_KEY) return null;
  try {
    const { data } = await axios.post(
      HF_API_URL,
      { inputs: { source_sentence: gigText, sentences: [freelancerText] } },
      { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` }, timeout: 8000 }
    );
    // API returns an array of similarity scores in the same order as `sentences`
    return Array.isArray(data) ? data[0] : null;
  } catch (err) {
    console.warn("Hugging Face inference unavailable, falling back to Jaccard score:", err.message);
    return null;
  }
}

/**
 * Scores a single freelancer against a gig on a 0-100 scale, blending:
 *  - skill similarity (0.5 weight)
 *  - reputation / rating (0.25 weight)
 *  - proximity (0.15 weight)
 *  - responsiveness (0.10 weight)
 */
async function scoreFreelancerForGig(gig, freelancer, freelancerUser) {
  let skillScore = jaccardSkillScore(gig.skills, (freelancer.skills || []).map((s) => s.name));

  const embeddingScore = await getEmbeddingSimilarity(
    `${gig.title} ${gig.description} ${gig.skills.join(" ")}`,
    `${freelancer.title} ${(freelancer.skills || []).map((s) => s.name).join(" ")}`
  );
  if (embeddingScore !== null) {
    skillScore = 0.6 * embeddingScore + 0.4 * skillScore;
  }

  let proximityScore = 0.5;
  if (gig.location?.coordinates?.length === 2 && freelancerUser.location?.coordinates?.length === 2) {
    const km = distanceKm(gig.location.coordinates, freelancerUser.location.coordinates);
    proximityScore = Math.max(0, 1 - km / 50); // linear falloff to 0 at 50km
  }

  const ratingScore = (freelancer.ratingAverage || 0) / 5;
  const responsivenessScore = Math.max(0, 1 - (freelancer.responseTimeMinutes || 120) / 720);

  const total =
    skillScore * 0.5 + ratingScore * 0.25 + proximityScore * 0.15 + responsivenessScore * 0.1;

  return Math.round(total * 100);
}

/**
 * Ranks a list of freelancer profiles (each with `.freelancer` + `.user`
 * populated) against a gig, returning them sorted by descending match score.
 */
async function rankFreelancersForGig(gig, candidates) {
  const scored = await Promise.all(
    candidates.map(async (c) => ({
      ...c,
      matchScore: await scoreFreelancerForGig(gig, c.freelancer, c.user),
    }))
  );
  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = {
  jaccardSkillScore,
  distanceKm,
  scoreFreelancerForGig,
  rankFreelancersForGig,
};
