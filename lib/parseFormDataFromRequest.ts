export async function parseFormDataFromRequest(req: Request): Promise<{
    buffers: Buffer[];
    mimetypes: string[];
    originalFilenames: string[];
  }> {
    const formData = await req.formData();
  
    const files = formData.getAll("files"); // Giả sử "files" là tên trường chứa tệp
    const buffers: Buffer[] = [];
    const mimetypes: string[] = [];
    const originalFilenames: string[] = [];
    if (!files || files.length === 0) {
      throw new Error("Không có tệp nào được gửi trong form data.");
    }
  
    for (const file of files as File[]) {
      // Kiểm tra nếu file là hợp lệ
      if (!(file instanceof File)) {
        console.error("Dữ liệu không phải là một file hợp lệ:", file);
        continue;
      }
      const arrayBuffer = await file.arrayBuffer();
      if (!arrayBuffer) {
        console.error("Không thể lấy ArrayBuffer từ file:", file.name);
        continue;
      }
      buffers.push(Buffer.from(arrayBuffer)); // Chuyển ArrayBuffer thành Buffer
      mimetypes.push(file.type || "application/octet-stream");
      originalFilenames.push(file.name || "file");
    }
  
    // Kiểm tra nếu không có dữ liệu hợp lệ
    if (buffers.length === 0) {
      throw new Error("Không có tệp hợp lệ để xử lý.");
    }
  
    return { buffers, mimetypes, originalFilenames };
  }