import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./StarRating";
import CustomButton from "@/common/CustomButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "./ui/label";

interface Review {
  id: string;
  shopName: string;
  reviewText: string;
  rating: number;
  date: string;
}

const formSchema = z.object({
  shopName: z.string().min(2, {
    message: "Please enter your shop name.",
  }),
  reviewText: z.string().min(2, {
    message: "Please enter your review.",
  }),
  rating: z
    .number()
    .min(1, {
      message: "Please provide a rating.",
    })
    .max(5),
});

const STORAGE_KEY = "shop_reviews";

const ReviewForm = () => {
  const [searchReviews, setSearchReviews] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    shopName: "",
    reviewText: "",
    rating: 0,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopName: "",
      reviewText: "",
      rating: 0,
    },
  });

  useEffect(() => {
    const loadReviews = () => {
      try {
        const savedReviews = localStorage.getItem(STORAGE_KEY);
        console.log("Loading from localStorage:", savedReviews);

        if (
          savedReviews &&
          savedReviews !== "undefined" &&
          savedReviews !== "null"
        ) {
          const parsed = JSON.parse(savedReviews);
          setReviews(parsed);
        }
      } catch (error) {
        console.error("Error parsing saved reviews:", error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  useEffect(() => {
    if (!isLoading && reviews.length >= 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
      } catch (error) {
        console.error("Error saving reviews", error);
      }
    }
  }, [reviews, isLoading]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newReview: Review = {
      id: crypto.randomUUID(),
      shopName: values.shopName,
      reviewText: values.reviewText,
      rating: values.rating,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setReviews((prev) => [newReview, ...prev]);
    form.reset({ shopName: "", reviewText: "", rating: 0 });
  }
  const handleEditClick = (review: Review) => {
    setEditingReviewId(review.id);
    setEditData({
      shopName: review.shopName,
      reviewText: review.reviewText,
      rating: review.rating,
    });
  };
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditData({ shopName: "", reviewText: "", rating: 0 });
  };

  // Save edit
  const handleSaveEdit = () => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === editingReviewId
          ? {
              ...review,
              ...editData,
              date: new Date().toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : review
      )
    );
    setEditingReviewId(null);
  };

  const handleDeleteReview = (id: string) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== id)
    );
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.shopName.toLowerCase().includes(searchReviews.toLowerCase()) ||
      review.reviewText.toLowerCase().includes(searchReviews.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center p-4 md:p-8 lg:p-12">
        <p className="text-lg">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 md:p-8 lg:p-12">
      <p className="text-3xl font-semibold text-start mb-5">
        Online Shop Review
      </p>
      <div className="w-full max-w-2xl space-y-8">
        <Card className="w-full bg-[#f8f8ff] shadow-none">
          <CardHeader>
            <CardTitle className="text-xl">
              Submit Your Online Shop Review
            </CardTitle>
            <CardDescription>
              Share your experience with other shoppers.
            </CardDescription>
          </CardHeader>
          <CardContent className="border-shad">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
                <FormField
                  control={form.control}
                  name="shopName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shop Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Daraz, Aarong, Le re ve"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reviewText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your shopping experience..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <StarRating
                          initialRating={field.value}
                          onRatingChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CustomButton
                  text="Submit Review"
                  type="submit"
                  className="w-full"
                />
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Submitted Reviews ({reviews.length})
          </h2>
          <Input
            placeholder="Search reviews by shop name or text..."
            value={searchReviews}
            onChange={(e) => setSearchReviews(e.target.value)}
            className="w-full"
          />
          <div className="grid gap-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => {
                const isEditing = editingReviewId === review.id;

                return (
                  <Card key={review.id} className="w-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        {isEditing ? (
                          <div className="w-1/2">
                            <Label>Shop name</Label>
                            <Input
                              className="mt-2"
                              value={editData.shopName}
                              onChange={(e) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  shopName: e.target.value,
                                }))
                              }
                            />
                          </div>
                        ) : (
                          <CardTitle className="text-lg">
                            {review.shopName}
                          </CardTitle>
                        )}
                        <span className="text-[10px] font-semibold rounded-full text-green-700 border-[#67AE6E] border-[2px] bg-green-200 py-[2px] px-4">
                          {review.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {isEditing ? (
                          <div className="mt-5">
                            <Label className="mb-2 text-black">Rating</Label>
                            <StarRating
                              initialRating={editData.rating}
                              onRatingChange={(rating) =>
                                setEditData((prev) => ({ ...prev, rating }))
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
                              setEditData((prev) => ({
                                ...prev,
                                reviewText: e.target.value,
                              }))
                            }
                            className="min-h-[100px]"
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700">
                          {review.reviewText}
                        </p>
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
                );
              })
            ) : (
              <p className="text-center text-muted-foreground">
                {searchReviews
                  ? "No reviews match your search."
                  : "No reviews found."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
