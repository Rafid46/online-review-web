/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "./ui/label";
import StarRating from "./StarRating";
import { Textarea } from "./ui/textarea";
import CustomButton from "@/common/CustomButton";
import { Input } from "./ui/input";
import { Calendar1Icon } from "lucide-react";

const ReviewCard = ({
  review,
  isEditing,
  editData,
  setEditData,
  handleSaveEdit,
  handleCancelEdit,
  handleEditClick,
  handleDeleteReview,
}: any) => {
  return (
    <AnimatePresence>
      <motion.div
        key={review.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          y: 20,
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        layout
      >
        <Card className="w-full">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              {isEditing ? (
                <div className="w-1/2">
                  <Label>Shop name</Label>
                  <Input
                    className="mt-2"
                    value={editData.shopName}
                    onChange={(e) =>
                      setEditData((prev: any) => ({
                        ...prev,
                        shopName: e.target.value,
                      }))
                    }
                  />
                </div>
              ) : (
                <CardTitle className="text-lg">{review.shopName}</CardTitle>
              )}
              <div className="flex items-center gap-x-2">
                <Calendar1Icon size={16} />
                <span className="text-[10px] font-semibold rounded-full text-green-700 border-[#67AE6E] border-[2px] bg-green-200 py-[2px] px-4">
                  {review.date}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isEditing ? (
                <div className="mt-5">
                  <Label className="mb-2 text-black">Rating</Label>
                  <StarRating
                    initialRating={editData.rating}
                    onRatingChange={(rating) =>
                      setEditData((prev: any) => ({ ...prev, rating }))
                    }
                  />
                </div>
              ) : (
                <StarRating initialRating={review.rating} readOnly />
              )}
            </div>
          </CardHeader>

          <CardContent>
            {isEditing ? (
              <div>
                <Label className="mb-2">Review text</Label>
                <Textarea
                  value={editData.reviewText}
                  onChange={(e) =>
                    setEditData((prev: any) => ({
                      ...prev,
                      reviewText: e.target.value,
                    }))
                  }
                  className="min-h-[100px]"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-700">{review.reviewText}</p>
            )}
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-0">
            {isEditing ? (
              <>
                <CustomButton
                  className="cursor-pointer py-4 px-4"
                  text="Save"
                  onClick={handleSaveEdit}
                />
                <CustomButton
                  className="cursor-pointer py-4 px-4 bg-transparent text-gray-900 border-[1px] border-gray-400 hover:text-white"
                  text="Cancel"
                  onClick={handleCancelEdit}
                />
              </>
            ) : (
              <>
                <CustomButton
                  className="cursor-pointer py-4 px-4 bg-transparent text-gray-900 border-[1px] border-gray-400 hover:text-white"
                  text="Edit"
                  onClick={() => handleEditClick(review)}
                />
                <CustomButton
                  className="cursor-pointer py-4 px-4 bg-[#D92C54]"
                  text="Delete"
                  onClick={() => handleDeleteReview(review.id)}
                />
              </>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewCard;
