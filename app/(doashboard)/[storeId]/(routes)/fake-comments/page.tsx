/** @format */

"use client";
import React, { useEffect, useState } from "react";
import {
  Edit2,
  Plus,
  Trash2,
  Star,
  User,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { FakeComment, FakeCommentCreate } from "@/types/fake-comments";
import CommentList from "./components/CommentList";
import CommentForm from "./components/CommendForm";
import { ProductInterface } from "@/types/product";
import ProductAPI from "@/app/api/products/products.api";
import { useParams } from "next/navigation";
import FakeCommentAPI from "@/app/api/fake-comments/fake-comments.api";
import PaginationCustom from "@/components/common/PaginationCustom";

const mockComments: FakeComment[] = [
  {
    id: 1,
    productId: 2,
    content:
      "Amazing sound quality! The bass is incredible and battery life exceeded my expectations.",
    ratingCount: 5,
    authorName: "John Smith",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
];

type Screen = "list" | "create" | "edit";

const FakeCommentManager: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("list");
  const [comments, setComments] = useState<FakeComment[]>(mockComments);
  const [selectedComment, setSelectedComment] = useState<FakeComment | null>(
    null
  );
  const [products, setProducts] = useState<ProductInterface[]>([]);

  const params = useParams();
  const storeID = params.storeId ? parseInt(params.storeId as string) : 1;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    initialData();
  }, []);
  useEffect(() => {
    if (currentPage) {
      fetchAllComments();
    }
    [currentPage];
  });

  const fetchAllProducts = async () => {
    let res = await ProductAPI.getListProducts({
      storeID,
      limit: 999999,
      currentPage: 1,
    });
    setProducts(res.data.products as ProductInterface[]);
  };
  const fetchAllComments = async () => {
    let res = await FakeCommentAPI.getFakeComments({
      storeID,
      limit: 4,
      currentPage: currentPage,
    });

    const total = res.data.total; // tổng số bình luận
    const limit = res.data.comments.length || 1; // tránh chia cho 0
    const totalPagesCal = Math.ceil(total / limit);
    setTotalPages(totalPagesCal);
    setComments(res.data.comments as FakeComment[]);
  };

  const initialData = async () => {
    await Promise.all([fetchAllProducts(), fetchAllComments()]);
  };

  const handleCreateComment = async (commentData: FakeCommentCreate) => {
    let res = await FakeCommentAPI.createFakeComment(commentData);
    let newComment = res.data.comment as FakeComment;
    setComments([...comments, newComment]);
    setCurrentScreen("list");
  };

  const handleUpdateComment = async (
    commentData: Omit<FakeComment, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!selectedComment) return;

    const updatedComment: FakeComment = {
      id: selectedComment.id,
      ...commentData,
      createdAt: selectedComment.createdAt,
      updatedAt: new Date(),
    };
    await FakeCommentAPI.updateFakeComment(selectedComment.id, updatedComment);

    setComments(
      comments.map((c) => (c.id === selectedComment.id ? updatedComment : c))
    );

    setCurrentScreen("list");
    setSelectedComment(null);
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  const handleEditComment = (comment: FakeComment) => {
    setSelectedComment(comment);
    setCurrentScreen("edit");
  };
  const navigateToList = () => {
    setCurrentScreen("list");
    setSelectedComment(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentScreen === "list" && (
          <CommentList
            comments={comments}
            products={products}
            onCreateNew={() => setCurrentScreen("create")}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
          />
        )}

        {currentScreen === "create" && (
          <CommentForm
            mode="create"
            products={products}
            onSubmit={handleCreateComment}
            onCancel={navigateToList}
          />
        )}

        {currentScreen === "edit" && selectedComment && (
          <CommentForm
            mode="edit"
            products={products}
            initialData={selectedComment}
            onSubmit={handleUpdateComment}
            onCancel={navigateToList}
          />
        )}
        <PaginationCustom
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
        />
      </div>
    </div>
  );
};

export default FakeCommentManager;
