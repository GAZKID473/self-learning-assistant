export default function moodTracker(userState) {
  const mood = userState.mood || "neutral";
  return `Today you're feeling ${mood}. Want to log a new mood?`;
}