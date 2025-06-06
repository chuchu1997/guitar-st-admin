/** @format */

//  id        Int      @id @default(autoincrement())
//   storeId   Int
//   store Store @relation("StoreToBanner",fields: [storeId],references: [id])

//   imageUrl     String
//   link      String?
//   title     String?
//   description String?
//   position    Int       @default(1) // Luôn có giá trị, không để mặc định là 0 (Là vị trí đầu tiên khi thêm mới )
//   isActive  Boolean  @default(true)
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

interface BannerBaseInterface {
  imageUrl: string;
  link?: string;
  title?: string;
  description?: string;
  position?: number; // 1 là vị trí đầu tiên
  isActive?: boolean;

  storeId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBannerInterface
  extends Partial<Omit<BannerBaseInterface, "createdAt" | "updatedAt">> {}

export interface BannerInterface extends BannerBaseInterface {
  id: number;
}

export interface UpdateBannerInterface
  extends Partial<Omit<BannerInterface, "id">> {
  updatedAt: Date;
}
