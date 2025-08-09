import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  initialRating?: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating = ({
  initialRating = 0,
  maxRating = 5,
  onRatingChange,
  readOnly = false,
}: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (index: number) => {
    if (!readOnly) {
      setRating(index);
      onRatingChange?.(index);
    }
  };

  const handleStarHover = (index: number) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center" onMouseLeave={handleMouseLeave}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            className={cn(
              "w-5 h-5 cursor-pointer transition-colors",
              displayRating >= starValue
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted stroke-muted-foreground",
              readOnly && "cursor-default"
            )}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarHover(starValue)}
          />
        );
      })}
    </div>
  );
};
export default StarRating;
