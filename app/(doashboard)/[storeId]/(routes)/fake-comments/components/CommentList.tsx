/** @format */

"use client";

import EmptyState from "@/components/common/EmptyState";
import Header from "@/components/common/Header";
import StatsCard from "@/components/common/StatsCard";
import { FakeComment } from "@/types/fake-comments";
import { ProductInterface } from "@/types/product";
import {
  Filter,
  MessageSquare,
  Package,
  Plus,
  Search,
  Star,
  StarIcon,
  User,
} from "lucide-react";
import { useState } from "react";
import CommentCard from "./CommentCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";

interface CommentListProps {
  comments: FakeComment[];
  products: ProductInterface[];
  onCreateNew: () => void;
  onEditComment: (comment: FakeComment) => void;
  onDeleteComment: (id: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  products,
  onCreateNew,
  onEditComment,
  onDeleteComment,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const getProductName = (productId: number): string => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "Không tìm thấy sản phẩm";
  };

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProductName(comment.productId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesRating =
      filterRating === null || comment.ratingCount === filterRating;

    return matchesSearch && matchesRating;
  });

  return (
    <div className="space-y-6">
      <Header
        title="Quản lý bình luận giả"
        subtitle="Quản lý bình luận giả cho sản phẩm của bạn"
        actions={
          <Button
            disabled={!products.length}
            type="button"
            onClick={onCreateNew}>
            <Plus className="w-5 h-5" />
            Tạo comment mới
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          icon={<MessageSquare className="w-6 h-6 text-blue-600" />}
          label="Tổng lượng comments "
          value={comments.length}
          color="bg-blue-50"
        />

        <StatsCard
          icon={<Package className="w-6 h-6 text-green-600" />}
          label="Tổng sản phẩm trong store"
          value={products.length}
          color="bg-green-50"
        />
        <StatsCard
          icon={<User className="w-6 h-6 text-purple-600" />}
          label="Tên người comment"
          value={new Set(comments.map((c) => c.authorName)).size}
          color="bg-purple-50"
        />
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search comments, authors, or products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <Select
              value={filterRating !== null ? String(filterRating) : "all"}
              onValueChange={(value) =>
                setFilterRating(value === "all" ? null : parseInt(value))
              }>
              <SelectTrigger className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <SelectValue placeholder="Tất cả các sao *" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả các sao *</SelectItem>
                <SelectItem value="5">5 sao</SelectItem>
                <SelectItem value="4">4 sao</SelectItem>
                <SelectItem value="3">3 sao</SelectItem>
                <SelectItem value="2">2 sao</SelectItem>
                <SelectItem value="1">1 sao</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredComments.length === 0 ? (
          <EmptyState
            onCreateNew={onCreateNew}
            action="Tạo bình luận mới"
            title="Chưa có bình luận"
            description=" Hãy bắt đầu xây dựng bộ sưu tập bình luận của bạn bằng cách tạo bình luận giả đầu tiên cho các sản phẩm của bạn."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                productName={getProductName(comment.productId)}
                onEdit={() => onEditComment(comment)}
                onDelete={() => onDeleteComment(comment.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList;
