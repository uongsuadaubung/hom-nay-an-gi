export interface FoodItem {
  id: number;
  name: string;
  color: string;
  image?: string; // Bổ sung image từ Google Sheet
}

export const mockMains: FoodItem[] = [
  { id: 1, name: 'Phở',    color: '#FF512F' },
  { id: 2, name: 'Bún chả', color: '#DD2476' },
  { id: 3, name: 'Cơm tấm', color: '#F09819' },
  { id: 4, name: 'Pizza',   color: '#8E2DE2' },
  { id: 5, name: 'Kebab',   color: '#4A00E0' },
  { id: 6, name: 'Sushi',   color: '#00C9FF' },
  { id: 7, name: 'Gà rán',  color: '#92FE9D' },
  { id: 8, name: 'Bánh mì', color: '#fdbb2d' },
];

export const mockVegs: FoodItem[] = [
  { id: 9,  name: 'Rau muống xào tỏi', color: '#2ecc71' },
  { id: 10, name: 'Canh mùng tơi',     color: '#27ae60' },
  { id: 11, name: 'Salad dưa chuột',   color: '#1abc9c' },
  { id: 12, name: 'Bắp cải luộc',      color: '#16a085' },
  { id: 13, name: 'Su su xào',         color: '#3498db' },
  { id: 14, name: 'Đậu cove xào',      color: '#2980b9' },
  { id: 15, name: 'Cải ngồng luộc',    color: '#9b59b6' },
  { id: 16, name: 'Đậu lướt ván',      color: '#e67e22' },
];

// Hàm fetch danh sách món ăn qua phương pháp JSONP để vượt qua CORS
export function fetchMenuFromGoogleSheet(scriptUrl: string): Promise<{mains: FoodItem[], vegs: FoodItem[]}> {
  return new Promise((resolve, reject) => {
    // Tạo tên callback độc nhất
    const callbackName = 'jsonpCallback_' + Math.round(100000 * Math.random());
    
    // Tạo thẻ script
    const script = document.createElement('script');
    
    // Hàm gọi khi dữ liệu JSONP tải về thành công
    (window as any)[callbackName] = (data: any) => {
      // Dọn dẹp bộ nhớ và DOM
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      
      // Bảng màu mặc định nếu không có color trong sheet
      const mainColors = ['#FF512F', '#DD2476', '#F09819', '#8E2DE2', '#4A00E0', '#00C9FF', '#92FE9D', '#fdbb2d'];
      const vegColors = ['#2ecc71', '#27ae60', '#1abc9c', '#16a085', '#3498db', '#2980b9', '#9b59b6', '#e67e22'];
      
      try {
        // Chuyển đổi dữ liệu Google Sheet về Format của App
        const mains: FoodItem[] = (data.mains || []).map((item: any, idx: number) => ({
          id: idx + 1,
          name: item.name,
          color: item.color || mainColors[idx % mainColors.length],
          image: item.image || undefined,
        }));
        
        const vegs: FoodItem[] = (data.vegs || []).map((item: any, idx: number) => ({
          id: (data.mains || []).length + idx + 1,
          name: item.name,
          color: item.color || vegColors[idx % vegColors.length],
          image: item.image || undefined,
        }));

        resolve({ mains, vegs });
      } catch (err) {
        reject(err);
      }
    };

    // Xử lý khi có lỗi mạng / đường dẫn sai
    script.onerror = () => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      reject(new Error('Script load failed - Check URL or CORS issue'));
    };

    // Chuẩn bị URL (Thêm tham số callback)
    const urlWithParams = `${scriptUrl}${scriptUrl.includes('?') ? '&' : '?'}callback=${callbackName}`;
    script.src = urlWithParams;
    
    // Kích hoạt request bằng cách gắn thẻ vào thẻ body
    document.body.appendChild(script);
  });
}
