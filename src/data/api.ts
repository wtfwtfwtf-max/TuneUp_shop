import axios from 'axios';
import { z } from 'zod';

// 1. 定義商品基礎 Schema (與 db.json 實際欄位對應)
export const ProductSchema = z.object({
  id: z.union([z.string(), z.number()]), // 支援字串和數字 ID
  name: z.string(),
  img: z.string(),
  // 不同商品有不同的價格欄位
  price: z.number().optional(),
  Price: z.number().optional(),
  oldPrice: z.number().optional(),
  newPrice: z.number().optional(),
  // 其他欄位
  type: z.string().optional(),
  flag: z.string().optional(),
  isLarge: z.boolean().optional(),
  amount: z.number().optional(),
  tag: z.string().optional(),
});

// 2. 推導出 TypeScript 型別
export type Product = z.infer<typeof ProductSchema>;

// 3. 定義陣列 Schema 用於列表 API
const ProductListSchema = z.array(ProductSchema);

// 使用 Vite 的環境變數設定 API 基礎路徑
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

// 4. 實作經過驗證的 API 函式
export const getHomeProducts = (): Promise<Product[]> => 
  apiClient.get('/homeProducts').then(res => ProductListSchema.parse(res.data));

export const getTopSalesProducts = (): Promise<Product[]> => 
  apiClient.get('/topSalesProducts').then(res => ProductListSchema.parse(res.data));

export const getTopSalesProducts2 = (): Promise<Product[]> => 
  apiClient.get('/topSalesProducts2').then(res => ProductListSchema.parse(res.data));

export const getHomeNewProducts = (): Promise<Product[]> => 
  apiClient.get('/homeNewProducts').then(res => ProductListSchema.parse(res.data));

export const getCategoryProductList = (): Promise<Product[]> => 
  apiClient.get('/page1ProductList').then(res => ProductListSchema.parse(res.data));

export const getCategoryDefaultCards = (): Promise<Product[]> => 
  apiClient.get('/page1DefaultCards').then(res => ProductListSchema.parse(res.data));

// 獲取所有可能的商品來源 (增強容錯)
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const results = await Promise.allSettled([
      getHomeProducts(),
      getTopSalesProducts(),
      getTopSalesProducts2(),
      getHomeNewProducts()
    ]);
    
    const all = results.map(res => res.status === 'fulfilled' ? res.value : []);
    return all.flat();
  } catch (error) {
    console.error('getAllProducts 發生錯誤:', error);
    return [];
  }
};

