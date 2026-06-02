<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Button from 'primevue/button';

import ProductCard from '../components/ProductCard.vue';
import ProductCardTopSales from '../components/ProductCardTopSales.vue';
import ProductCardNew from '../components/ProductCardNew.vue';
import AppFooter from '../components/AppFooter.vue';

// 從資料層匯入 API 函式與型別
import { 
  getHomeProducts, 
  getTopSalesProducts, 
  getTopSalesProducts2, 
  getHomeNewProducts,
  type Product
} from '../data/api';

const products = ref<Product[]>([]);
const topSalesProducts = ref<Product[]>([]);
const topSalesProducts2 = ref<Product[]>([]);
const NewProducts = ref<Product[]>([]);

onMounted(async () => {
  try {
    const results = await Promise.allSettled([
      getHomeProducts(),
      getTopSalesProducts(),
      getTopSalesProducts2(),
      getHomeNewProducts()
    ]);
    
    // 分配結果，若失敗則給予空陣列
    products.value = results[0].status === 'fulfilled' ? results[0].value : [];
    topSalesProducts.value = results[1].status === 'fulfilled' ? results[1].value : [];
    topSalesProducts2.value = results[2].status === 'fulfilled' ? results[2].value : [];
    NewProducts.value = results[3].status === 'fulfilled' ? results[3].value : [];
    
    console.log('首頁資料加載完成');
  } catch (error) {
    console.error('抓取資料時發生嚴重錯誤：', error);
  }
});
</script>

<template>
  <div class="home-wrapper overflow-x-hidden w-full flex flex-col items-center">
    
    <!-- Banner Section -->
    <section class="w-full flex justify-center  min-[1496px]:mt-0">
      <div class="relative w-full max-w-[93.5em]">
        <router-link to="/cart">
          <Button 
            label="立即選購" 
            class="!absolute bottom-[28%] left-[5%] !w-[7em] md:!w-[9em] lg:!w-[11.125em] !h-[2.2em] md:!h-[2.8em] lg:!h-[3.25em] !bg-white !border-white !tracking-[0.125em] !font-black !text-[0.65em] md:!text-[0.9em] lg:!text-[1.25em] !text-black shadow-lg z-10" 
          />
        </router-link>
        <img 
          src="/assets/image/banner.svg" 
          alt="banner_1" 
          class="w-full h-auto min-h-[12em] min-[1496px]:h-[45em] object-cover rounded-none lg:rounded-[8px]" 
        />
      </div>
    </section>

    <!-- Discounts Section -->
    <section class="w-full max-w-[93.5em] mt-9 px-0 min-[1496px]:px-0 flex flex-col items-center">
      <div class="w-full flex justify-center min-[1496px]:justify-start">
        <a href="#" class="text-[1.8em] md:text-[2.25em] font-medium no-underline text-black block mb-4">優惠專區</a>
      </div>
      <div class="flex flex-col min-[1496px]:flex-row gap-[0.5em] md:gap-[24px] items-center min-[1496px]:items-start w-full">
        <!-- Group 1 (在中尺寸下並排置中) -->
        <div class="flex flex-row justify-center gap-[0.5em] md:gap-[24px] w-full min-[1496px]:w-auto">
          <ProductCard
            v-for="item in products.slice(0, 2)"
            :key="item.id"
            :info="item"
            type="discount"
          />
        </div>
        <!-- Group 2 (在中尺寸下並排置中) -->
        <div class="flex flex-row justify-center gap-[0.5em] md:gap-[24px] w-full min-[1496px]:w-auto">
          <ProductCard
            v-for="item in products.slice(2, 4)"
            :key="item.id"
            :info="item"
            type="discount"
          />
        </div>
      </div>
    </section>

    <!-- Best Sellers Section -->
    <section class="w-full max-w-[93.5em] mt-9 px-0 min-[1496px]:px-0 flex flex-col items-center">
      <div class="w-full flex justify-center min-[1496px]:justify-start">
        <a href="#" class="text-[1.8em] md:text-[2.25em] font-medium no-underline text-black block mb-4">售出最多</a>
      </div>
      <div class="flex flex-col min-[1496px]:flex-row gap-[0.5em] md:gap-[24px] items-center min-[1496px]:items-start w-full">
        <!-- Row 1: Top 1 (在中尺寸下置中) -->
        <div class="flex justify-center w-full min-[1496px]:w-auto">
          <ProductCardTopSales
            v-for="item in topSalesProducts"
            :key="'top1-' + item.id"
            :info="item"
          />
        </div>
        <!-- Row 2: Top 2 & 3 (在中尺寸下並排且置中) -->
        <div class="flex flex-row justify-center gap-[0.5em] md:gap-[24px] w-full min-[1496px]:w-auto">
          <ProductCardTopSales
            v-for="item in topSalesProducts2"
            :key="'top2-' + item.id"
            :info="item"
          />
        </div>
      </div>
    </section>

    <!-- New Arrivals Section -->
    <section class="w-full max-w-[93.5em] mt-9 px-0 min-[1496px]:px-0 flex flex-col items-center">
      <div class="w-full flex justify-center min-[1496px]:justify-start">
        <a href="#" class="text-[1.8em] md:text-[2.25em] font-medium no-underline text-black block mb-4">新品上市</a>
      </div>
      <div class="flex flex-col min-[1496px]:flex-row gap-[0.5em] md:gap-[24px] items-center min-[1496px]:items-start w-full">
        <!-- Group 1 (在中尺寸下並排置中) -->
        <div class="flex flex-row justify-center gap-[0.5em] md:gap-[24px] w-full min-[1496px]:w-auto">
          <ProductCardNew
            v-for="item in NewProducts.slice(0, 2)"
            :key="item.id"
            :info="item"
          />
        </div>
        <!-- Group 2 (在中尺寸下並排置中) -->
        <div class="flex flex-row justify-center gap-[0.5em] md:gap-[24px] w-full min-[1496px]:w-auto">
          <ProductCardNew
            v-for="item in NewProducts.slice(2, 4)"
            :key="item.id"
            :info="item"
          />
        </div>
      </div>
    </section>

  </div>

  <AppFooter />
</template>

<style scoped>
.home-wrapper {
  width: 100%;
}
</style>
