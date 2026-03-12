export interface Recipe {
  name: string;    // Tên cách nấu, VD: "Cách 1: Xào tỏi"
  content: string; // Nội dung các bước nấu (xuống dòng phân cách bước)
}

export interface FoodItem {
  id: number;
  name: string;
  color: string;
  image?: string;
  recipes?: Recipe[]; // Danh sách cách nấu (từ Sheet 2)
}

export const mockMains: FoodItem[] = [
  { id: 1, name: 'Phở',     color: '#FF512F', recipes: [{ name: 'Cách truyền thống', content: 'Bước 1: Ninh xương bò 4-6 tiếng với gừng nướng, hành tây.\nBước 2: Lọc nước dùng trong, nêm muối, nước mắm, đường phèn.\nBước 3: Chần bánh phở vào tô, xếp thịt bò tái lên trên.\nBước 4: Chan nước dùng sôi vào tô, ăn kèm giá, rau thơm, chanh, ớt.' }] },
  { id: 2, name: 'Bún chả', color: '#DD2476', recipes: [{ name: 'Kiểu Hà Nội', content: 'Bước 1: Ướp thịt ba chỉ và thịt viên với nước mắm, đường, tỏi, hành.\nBước 2: Nướng thịt trên than hoa đến khi chín vàng.\nBước 3: Pha nước chấm: nước mắm, đường, chanh, tỏi, ớt, giấm.\nBước 4: Chan nước chấm vào bát, cho thịt nướng vào, ăn kèm bún và rau sống.' }] },
  { id: 3, name: 'Cơm tấm', color: '#F09819' },
  { id: 4, name: 'Pizza',   color: '#8E2DE2' },
  { id: 5, name: 'Kebab',   color: '#4A00E0' },
  { id: 6, name: 'Sushi',   color: '#00C9FF' },
  { id: 7, name: 'Gà rán',  color: '#92FE9D' },
  { id: 8, name: 'Bánh mì', color: '#fdbb2d' },
];

export const mockVegs: FoodItem[] = [
  { id: 9,  name: 'Rau muống xào tỏi', color: '#2ecc71', recipes: [
    { name: 'Xào tỏi', content: 'Bước 1: Nhặt rau muống, rửa sạch, để ráo.\nBước 2: Đun nóng dầu, phi tỏi vàng thơm.\nBước 3: Cho rau muống vào xào lửa lớn, nêm muối, nước mắm.\nBước 4: Đảo đều tay đến khi rau chín tái, không xào quá kỹ.' },
    { name: 'Xào tôm', content: 'Bước 1: Nhặt rau muống, rửa sạch. Tôm bóc vỏ, ướp chút muối tiêu.\nBước 2: Đun nóng dầu, xào tôm chín đỏ rồi gắp ra.\nBước 3: Phi tỏi thơm, cho rau muống vào xào lửa lớn.\nBước 4: Cho tôm trở lại, nêm nước mắm, hạt nêm. Đảo nhanh tay rồi tắt bếp.' },
  ] },
  { id: 10, name: 'Canh mùng tơi',     color: '#27ae60' },
  { id: 11, name: 'Salad dưa chuột',   color: '#1abc9c' },
  { id: 12, name: 'Bắp cải luộc',      color: '#16a085' },
  { id: 13, name: 'Su su xào',         color: '#3498db' },
  { id: 14, name: 'Đậu cove xào',      color: '#2980b9' },
  { id: 15, name: 'Cải ngồng luộc',    color: '#9b59b6' },
  { id: 16, name: 'Đậu lướt ván',      color: '#e67e22' },
];

// Hàm fetch danh sách món ăn + cách nấu qua JSONP để vượt qua CORS
export function fetchMenuFromGoogleSheet(scriptUrl: string): Promise<{mains: FoodItem[], vegs: FoodItem[]}> {
  return new Promise((resolve, reject) => {
    const callbackName = 'jsonpCallback_' + Math.round(100000 * Math.random());
    const script = document.createElement('script');

    (window as any)[callbackName] = (data: any) => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);

      const mainColors = ['#FF512F', '#DD2476', '#F09819', '#8E2DE2', '#4A00E0', '#00C9FF', '#92FE9D', '#fdbb2d'];
      const vegColors = ['#2ecc71', '#27ae60', '#1abc9c', '#16a085', '#3498db', '#2980b9', '#9b59b6', '#e67e22'];

      try {
        // recipes là map: { [tênMón]: Recipe[] }
        const recipesMap: Record<string, Recipe[]> = data.recipes || {};

        const mains: FoodItem[] = (data.mains || [])
          .filter((item: any) => item.name?.toString()?.trim())
          .map((item: any, idx: number) => ({
          id: idx + 1,
          name: item.name,
          color: item.color || mainColors[idx % mainColors.length],
          image: item.image || undefined,
          recipes: recipesMap[item.name] || undefined,
        }));

        const vegs: FoodItem[] = (data.vegs || [])
          .filter((item: any) => item.name?.toString()?.trim())
          .map((item: any, idx: number) => ({
          id: (data.mains || []).length + idx + 1,
          name: item.name,
          color: item.color || vegColors[idx % vegColors.length],
          image: item.image || undefined,
          recipes: recipesMap[item.name] || undefined,
        }));

        resolve({ mains, vegs });
      } catch (err) {
        reject(err);
      }
    };

    script.onerror = () => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      reject(new Error('Script load failed - Check URL or CORS issue'));
    };

    const urlWithParams = `${scriptUrl}${scriptUrl.includes('?') ? '&' : '?'}callback=${callbackName}`;
    script.src = urlWithParams;
    document.body.appendChild(script);
  });
}
