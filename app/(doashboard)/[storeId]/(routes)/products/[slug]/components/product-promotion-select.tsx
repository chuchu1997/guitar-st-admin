/** @format */

"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronDown,
  X,
  Tag,
  Search,
  Percent,
  DollarSign,
  Plus,
} from "lucide-react";
import ProductAPI from "@/app/api/products/products.api";
import { useParams } from "next/navigation";
import { ProductInterface } from "@/types/product";
import { FormatUtils } from "@/utils/format";
import debounce from "lodash.debounce";
import { discountTypeEnum } from "@/types/promotions";
import { PromotionProduct } from "../../../promotions/[id]/components/promotion-form";

interface ProductPromotionSelectorProps {
  form: any;
  loading: boolean;
  initValue?: any[];
  name: string;
}

interface DiscountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (discountType: discountTypeEnum, discountValue: number) => void;
  product: ProductInterface | null;
  loading: boolean;
}

const DiscountDialog: React.FC<DiscountDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  product,
  loading,
}) => {
  const [discountType, setDiscountType] = useState<discountTypeEnum>(
    discountTypeEnum.PERCENT
  );
  const [discountValue, setDiscountValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleConfirm = () => {
    const value = parseFloat(discountValue);

    if (isNaN(value) || value <= 0) {
      setError("Vui lòng nhập giá trị hợp lệ");
      return;
    }

    if (discountType === discountTypeEnum.PERCENT && value > 100) {
      setError("Phần trăm giảm giá không được vượt quá 100%");
      return;
    }

    if (
      discountType === discountTypeEnum.FIXED &&
      product &&
      value >= product.price
    ) {
      setError("Số tiền giảm không được lớn hơn hoặc bằng giá sản phẩm");
      return;
    }

    onConfirm(discountType, value);
    setDiscountValue("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setDiscountValue("");
    setError("");
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Thiết lập giảm giá
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">
                {product.name}
              </p>
              <p className="text-orange-600 font-medium text-sm">
                {FormatUtils.formatPriceVND(product.price)}
              </p>
            </div>
          </div>

          {/* Discount Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại giảm giá
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDiscountType(discountTypeEnum.PERCENT)}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  discountType === discountTypeEnum.PERCENT
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                <Percent className="w-4 h-4" />
                <span className="text-sm font-medium">Phần trăm</span>
              </button>
              <button
                type="button"
                onClick={() => setDiscountType(discountTypeEnum.FIXED)}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  discountType === discountTypeEnum.FIXED
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Số tiền cố định</span>
              </button>
            </div>
          </div>

          {/* Discount Value Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {discountType === discountTypeEnum.PERCENT
                ? "Phần trăm giảm giá"
                : "Số tiền giảm"}
            </label>
            <div className="relative">
              <input
                type="number"
                value={discountValue}
                onChange={(e) => {
                  setDiscountValue(e.target.value);
                  setError("");
                }}
                placeholder={
                  discountType === discountTypeEnum.PERCENT ? "0" : "0"
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {discountType === discountTypeEnum.PERCENT ? "%" : "VND"}
              </div>
            </div>
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
          </div>

          {/* Preview */}
          {discountValue && !error && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <span className="font-medium">Giá sau giảm: </span>
                {FormatUtils.formatPriceVND(
                  discountType === discountTypeEnum.PERCENT
                    ? product.price * (1 - parseFloat(discountValue) / 100)
                    : product.price - parseFloat(discountValue)
                )}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading || !discountValue}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductPromotionSelector: React.FC<
  ProductPromotionSelectorProps
> = ({ form, loading, initValue, name }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [availableProducts, setAvailableProducts] = useState<
    ProductInterface[]
  >([]);
  const [selectedPromotionProducts, setSelectedPromotionProducts] = useState<
    PromotionProduct[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { storeId, slug } = useParams();
  const [currentSlugs, setCurrentSlugs] = useState<string[]>(
    slug ? [slug.toString()] : []
  );

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductInterface | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useCallback(
    debounce((name: string) => {
      if (name.length > 3) {
        fetchListProducts(name);
      } else {
        fetchListProducts("");
      }
    }, 300),
    [currentSlugs, searchTerm]
  );

  const fetchListProducts = async (name: string) => {
    const response = await ProductAPI.getListProducts({
      storeID: Number(storeId),
      name: name,
    });

    if (response.status === 200) {
      let data = response.data.products.filter(
        (product: ProductInterface) => !currentSlugs.includes(product.slug)
      );
      setAvailableProducts(data);
    }
  };

  // Initialize selected products
  useEffect(() => {
    if (initValue) {
      let promotionProducts: PromotionProduct[] = initValue.map((value) => ({
        id: value.id,
        slug: value.slug,
        discountType: value.discountType,
        discount: value.discountValue,
        product: value.product,
      })) as PromotionProduct[];

      setCurrentSlugs((prev) => [
        ...prev,
        ...promotionProducts.map((value) => value.slug ?? ""),
      ]);

      setSelectedPromotionProducts(promotionProducts);
    }
  }, [initValue]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Watch searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const handleProductSelect = (product: ProductInterface): void => {
    setSelectedProduct(product);
    setDialogOpen(true);
    setIsOpen(false);
  };

  const handleDiscountConfirm = (
    discountType: discountTypeEnum.PERCENT | discountTypeEnum.FIXED,
    discount: number
  ) => {
    if (!selectedProduct) return;

    const currentSelection: PromotionProduct[] = form.getValues(name) || [];
    const newPromotionProduct: PromotionProduct = {
      id: selectedProduct.id,
      slug: selectedProduct.slug,
      discountType,
      discount,
      product: selectedProduct,
    };

    const newSelection: PromotionProduct[] = [
      ...currentSelection,
      newPromotionProduct,
    ];

    form.setValue(name, newSelection);
    setSelectedPromotionProducts((prev) => [...prev, newPromotionProduct]);
    setCurrentSlugs((prev) => [...prev, selectedProduct.slug]);
    setSearchTerm("");
    setSelectedProduct(null);
  };

  const handleProductRemove = (productId: number): void => {
    const currentSelection: PromotionProduct[] = form.getValues(name) || [];
    const newSelection: PromotionProduct[] = currentSelection.filter(
      (item) => item.id !== productId
    );

    const newSelectedProducts: PromotionProduct[] =
      selectedPromotionProducts.filter((item) => item.id !== productId);

    setSelectedPromotionProducts(newSelectedProducts);
    setCurrentSlugs((prev) =>
      prev.filter(
        (s) => s === slug || newSelectedProducts.some((item) => item.slug === s)
      )
    );

    form.setValue(name, newSelection);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5 text-orange-600" />
        <label className="text-sm font-medium text-gray-700">
          Chọn sản phẩm áp dụng khuyến mãi
        </label>
      </div>

      {/* Selected Products Display */}
      {selectedPromotionProducts.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            Đã chọn {selectedPromotionProducts.length} sản phẩm áp dụng khuyến
            mãi
          </p>
          <div className="space-y-2">
            {selectedPromotionProducts.map((item: PromotionProduct) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-red-50 
                         border border-orange-200 rounded-lg p-3 group hover:shadow-sm 
                         transition-all duration-200">
                <img
                  src={item.product?.images[0].url}
                  alt={item.product?.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.product?.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500 line-through">
                      {FormatUtils.formatPriceVND(item.product?.price || 0)}
                    </p>
                    <p className="text-sm text-orange-600 font-medium">
                      {FormatUtils.formatPriceVND(
                        item.discountType === discountTypeEnum.PERCENT
                          ? (item.product?.price || 0) *
                              (1 - item.discount / 100)
                          : (item.product?.price || 0) - item.discount
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {item.discountType === discountTypeEnum.PERCENT ? (
                      <Percent className="w-3 h-3 text-green-600" />
                    ) : (
                      <DollarSign className="w-3 h-3 text-green-600" />
                    )}
                    <span className="text-xs text-green-600 font-medium">
                      {item.discountType === discountTypeEnum.PERCENT
                        ? `Giảm ${item.discount}%`
                        : `Giảm ${FormatUtils.formatPriceVND(item.discount)}`}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleProductRemove(item.id)}
                  disabled={loading}
                  className="p-1 rounded-full hover:bg-red-100 text-gray-400 
                           hover:text-red-500 transition-colors duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown Selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={loading}
          className="w-full flex items-center justify-between px-4 py-3 
                   bg-white border border-gray-300 rounded-lg shadow-sm
                   hover:border-orange-400 focus:outline-none focus:ring-2 
                   focus:ring-orange-500 focus:border-orange-500
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200">
          <span className="text-gray-700">
            {selectedPromotionProducts.length > 0
              ? `Thêm sản phẩm khác vào khuyến mãi...`
              : "Chọn sản phẩm áp dụng khuyến mãi..."}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 
                       ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 
                        rounded-lg shadow-lg max-h-80 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                w-4 h-4 text-gray-400"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-orange-500 
                           focus:border-orange-500 text-sm"
                />
              </div>
            </div>

            {/* Product List */}
            <div className="max-h-60 overflow-y-auto">
              {availableProducts.length > 0 ? (
                <div className="py-2">
                  {availableProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleProductSelect(product)}
                      className="w-full flex items-center gap-3 px-4 py-3 
                               hover:bg-orange-50 transition-colors duration-150
                               text-left border-b border-gray-50 last:border-b-0">
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-orange-600 font-medium">
                          {FormatUtils.formatPriceVND(product.price)}
                        </p>
                      </div>
                      <Plus className="w-5 h-5 text-orange-500" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    {searchTerm
                      ? "Không tìm thấy sản phẩm phù hợp"
                      : "Không có sản phẩm nào khả dụng"}
                  </p>
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="text-orange-600 hover:text-orange-700 text-sm mt-2
                               underline transition-colors duration-200">
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        Chọn các sản phẩm sẽ được áp dụng khuyến mãi. Sau khi chọn sản phẩm, bạn
        có thể thiết lập mức giảm giá theo phần trăm hoặc số tiền cố định.
      </p>

      {/* Form Error Display */}
      {form.formState.errors[name] && (
        <p className="text-xs text-red-600 mt-1">
          {form.formState.errors[name].message}
        </p>
      )}

      {/* Discount Dialog */}
      <DiscountDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDiscountConfirm}
        product={selectedProduct}
        loading={loading}
      />
    </div>
  );
};
