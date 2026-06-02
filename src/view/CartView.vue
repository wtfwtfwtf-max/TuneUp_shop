<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import AppFooter from '../components/AppFooter.vue';

// 暫時的假資料，之後我們會改成從 Pinia 或 LocalStorage 讀取
const cartItems = ref([
  {
    id: '1',
    name: 'AirPods Pro 3',
    price: 7499,
    quantity: 1,
    img: '/assets/image/product_card/sales_area/product_card_1.svg'
  },
  {
    id: '2',
    name: 'Sony WH-1000XM5',
    price: 9900,
    quantity: 1,
    img: '/assets/image/product_card/sales_area/product_card_2.svg'
  }
]);

// 計算總金額
const totalAmount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

// 移除商品
const removeItem = (id: string) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id);
};

// 更新數量
const updateQuantity = (id: string, delta: number) => {
  const item = cartItems.value.find(i => i.id === id);
  if (item) {
    const newQty = item.quantity + delta;
    if (newQty > 0) item.quantity = newQty;
  }
};
</script>

<template>
  <div class="px-[7.25em] py-18 min-h-screen flex justify-center">
    <div class="w-[93.5em]">
      <h1 class="text-3xl font-bold mb-8 text-gray-800">您的購物車</h1>

      <div v-if="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左側：商品清單 -->
        <div class="lg:col-span-2 space-y-4">
          <div 
            v-for="item in cartItems" 
            :key="item.id" 
            class="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <img :src="item.img" :alt="item.name" class="w-24 h-24 object-cover rounded-lg" />
            
            <div class="flex-1 ml-6">
              <h3 class="text-lg font-semibold text-gray-800">{{ item.name }}</h3>
              <p class="text-primary font-medium mt-1">NT$ {{ item.price.toLocaleString() }}</p>
            </div>

                      <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden h-10 w-fit shadow-sm bg-gray-50 mx-8">
                        <button 
                          @click="updateQuantity(item.id, -1)"
                          class="w-10 h-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer border-none"
                        > - </button>
                        <div class="w-12 h-full bg-white flex items-center justify-center font-bold border-x border-gray-200">{{ item.quantity }}</div>
                        <button 
                          @click="updateQuantity(item.id, 1)"
                          class="w-10 h-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer border-none"
                        > + </button>
                      </div>
            <div class="text-right min-w-[100px]">
              <p class="font-bold text-gray-800">NT$ {{ (item.price * item.quantity).toLocaleString() }}</p>
              <button 
                @click="removeItem(item.id)"
                class="text-red-500 text-sm mt-2 hover:underline"
              > 移除 </button>
            </div>
          </div>
        </div>

        <!-- 右側：訂單摘要 -->
        <div class="bg-gray-50 p-6 rounded-2xl h-fit border border-gray-200">
          <h2 class="text-xl font-bold mb-6 italic">ORDER SUMMARY</h2>
          
          <div class="space-y-4 text-gray-600">
            <div class="flex justify-between">
              <span>商品小計</span>
              <span>NT$ {{ totalAmount.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span>運費</span>
              <span class="text-green-600">免運費</span>
            </div>
            <hr class="border-gray-300 my-4" />
            <div class="flex justify-between text-xl font-bold text-gray-900">
              <span>總計</span>
              <span>NT$ {{ totalAmount.toLocaleString() }}</span>
            </div>
          </div>

          <Button 
            label="前往結帳" 
            class="w-full mt-8 !bg-black !border-none !rounded-full !py-3 font-bold" 
          />
          
          <router-link to="/" class="block text-center mt-4 text-gray-500 hover:underline">
            繼續購物
          </router-link>
        </div>
      </div>

      <!-- 空購物車狀態 -->
      <div v-else class="text-center py-20">
        <div class="text-6xl mb-4">🛒</div>
        <h2 class="text-2xl font-semibold text-gray-600">您的購物車目前是空的</h2>
        <p class="text-gray-400 mt-2">快去逛逛選購您心儀的耳機吧！</p>
        <router-link to="/">
          <Button label="回到首頁" class="mt-8 !rounded-full !px-8" />
        </router-link>
      </div>
    </div>
  </div>
  <AppFooter />
</template>

<style scoped>
.text-primary {
  color: #1a1a1a;
}
</style>
