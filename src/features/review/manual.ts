import type { Review } from "../../domain/progress";

export function addManualReview(reviews: Review[], id: string, day: string): Review[] {
  return reviews.some((review) => review.id === id)
    ? reviews
    : [...reviews, { id, due: day, interval: 0 }];
}

export function removeManualReview(reviews: Review[], id: string): Review[] {
  return reviews.filter((review) => review.id !== id);
}
