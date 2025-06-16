/** @format */

"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, X, Gift, Search } from "lucide-react";
import ProductAPI from "@/app/api/products/products.api";
import { useParams } from "next/navigation";
import { ProductInterface } from "@/types/product";
import { FormatUtils } from "@/utils/format";
import debounce from "lodash.debounce";
import { GiftProduct } from "./product.form";

interface GiftProductSelectorProps {
  form: any;
  loading: boolean;
  initValue?: any[];
}

export const GiftProductSelector: React.FC<GiftProductSelectorProps> = ({
  form,
  loading,
  initValue,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [gifts, setGifts] = useState<ProductInterface[]>([]);
  const [selectGifts, setSelectGifts] = useState<ProductInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { storeId, slug } = useParams();
  const [currentSlugs, setCurrentSlugs] = useState<string[]>(
    slug ? [slug.toString()] : []
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useCallback(
    debounce((name: string) => {
      if (name.length > 3) {
        fetchListProductGift(name);
      } else {
        fetchListProductGift(""); // hoặc bỏ lọc nếu rỗng
      }
    }, 300),

    [currentSlugs, searchTerm]
  );

  const fetchListProductGift = async (name: string) => {
    const response = await ProductAPI.getListProducts({
      storeID: Number(storeId),
      name: name,
    });

    if (response.status === 200) {
      let data = response.data.products.filter(
        (product: ProductInterface) => !currentSlugs.includes(product.slug)
      );

      setGifts(data);
    }
  };

  // Debounced version of fetchListProductGift

  // Initial fetch

  // Handle click outside dropdown
  useEffect(() => {
    if (initValue) {
      // let gifts: ProductInterface[] = initValue.map(
      //   (value) => value.gift
      // ) as ProductInterface[];
      let gifts: ProductInterface[] = initValue.map((value) => ({
        ...value.gift, // các field từ bảng Product
        id: value.id, // ID của bảng GiftProduct
      })) as ProductInterface[];

      setCurrentSlugs((prev) => [
        ...prev,
        ...gifts.map((value) => value.slug ?? ""),
      ]);

      setSelectGifts(gifts);
      // const newSelection: GiftProduct[] = [
      //   ...currentSelection,
      //   { id: product.id, slug: product.slug },
      // ];
    }
  }, [initValue]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // setSearchTerm("");
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
  useEffect(() => {
    console.log("CURRENT ", currentSlugs);
  }, [currentSlugs]);
  const handleProductSelect = (product: ProductInterface): void => {
    const currentSelection: GiftProduct[] =
      form.getValues("giftProducts") || [];
    const newSelection: GiftProduct[] = [
      ...currentSelection,
      { id: product.id, slug: product.slug },
    ];

    form.setValue("giftProducts", newSelection);
    setSelectGifts((prev) => [...prev, product]);
    setCurrentSlugs((prev) => [...prev, product.slug]);
    setSearchTerm("");
  };
  //   const handleProductSelect = (product: ProductInterface): void => {
  //     console.log("CURRENT ID SELECT ", currentProductIDSelects);
  //     console.log("product id", product.id);
  //     if (!currentProductIDSelects.includes(product.id)) {
  //       console.log("PRODUCT", product);
  //       setCurrentProductIDSelects([...currentProductIDSelects, product.id]);
  //       const currentSelection: ProductInterface[] =
  //         form.getValues("giftProducts") || [];
  //       const newSelection: ProductInterface[] = [...currentSelection, product];
  //       form.setValue("giftProducts", newSelection);
  //       setSearchTerm("");
  //     }

  //   };

  const handleProductRemove = (productId: number): void => {
    const currentSelection: GiftProduct[] =
      form.getValues("giftProducts") || [];
    console.log("CURRENT S", currentSelection);
    currentSelection.map((dd) => {
      console.log("DD", dd.id);
    });
    console.log("productID", productId);
    const newSelection: GiftProduct[] = currentSelection.filter(
      (gift) => gift.id !== productId
    );
    const newSelectWithRemove: ProductInterface[] = selectGifts.filter(
      (item) => item.id !== productId
    );

    setSelectGifts(newSelectWithRemove);

    setCurrentSlugs((prev) =>
      prev.filter(
        (s) => s === slug || newSelectWithRemove.some((gift) => gift.slug === s)
      )
    );
    console.log("NEW", newSelection);
    // setCurrentSlugs((prev) =>
    //   prev.filter((slug) => selectGifts.some((gift) => gift.slug === slug))
    // );

    form.setValue("giftProducts", newSelection);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Gift className="w-5 h-5 text-orange-600" />
        <label className="text-sm font-medium text-gray-700">
          Sản phẩm quà tặng kèm theo (Tùy chọn)
        </label>
      </div>

      {/* Selected Products Display */}
      {selectGifts.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            Đã chọn {selectGifts.length} sản phẩm quà tặng
          </p>
          <div className="flex flex-wrap gap-2">
            {selectGifts.map((product: ProductInterface) => (
              <div
                key={product.id}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 
                         border border-orange-200 rounded-lg px-3 py-2 group hover:shadow-sm 
                         transition-all duration-200">
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-8 h-8 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-orange-600 font-medium">
                    {FormatUtils.formatPriceVND(product.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleProductRemove(product.id)}
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
            {selectGifts.length > 0
              ? `Thêm sản phẩm quà tặng khác...`
              : "Chọn sản phẩm quà tặng..."}
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
              {gifts.length > 0 ? (
                <div className="py-2">
                  {gifts.map((product) => (
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
                      <div
                        className="flex items-center justify-center w-6 h-6 
                                    rounded-full border-2 border-orange-300">
                        <div
                          className="w-2 h-2 rounded-full bg-orange-500 opacity-0 
                                      group-hover:opacity-100 transition-opacity duration-200"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
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
        Chọn các sản phẩm sẽ được tặng kèm khi khách hàng mua sản phẩm này.
        Không thể chọn chính sản phẩm hiện tại.
      </p>

      {/* Form Error Display */}
      {form.formState.errors?.giftProducts && (
        <p className="text-xs text-red-600 mt-1">
          {form.formState.errors.giftProducts.message}
        </p>
      )}
    </div>
  );
};
