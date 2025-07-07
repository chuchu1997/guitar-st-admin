import { FakeComment } from "@/types/fake-comments";
import { FormatUtils } from "@/utils/format";
import { Calendar, Edit2, Package, Star, Trash2, User } from "lucide-react";

// Comment Card Component
const CommentCard: React.FC<{
  comment: FakeComment;
  productName: string;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ comment, productName, onEdit, onDelete }) => {
  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < count ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden shadow-md">
              {comment.avatarUrl ? (
                <img
                  src={comment.avatarUrl}
                  alt={comment.authorName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-lg">{comment.authorName}</p>
              <div className="flex items-center gap-1 mt-1">
                {renderStars(comment.ratingCount)}
                <span className="text-sm text-gray-500 ml-1">({comment.ratingCount}/5)</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4 leading-relaxed text-base">{comment.content}</p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="font-medium">{productName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{FormatUtils.formatDate(comment.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            title="Edit comment"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Delete comment"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
