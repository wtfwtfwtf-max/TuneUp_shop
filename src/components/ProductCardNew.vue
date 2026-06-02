<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  info: {
    id: string;
    name: string;
    Price: number;
    img: string;
  };
}>();

const router = useRouter();
const goToDetail = () => {
  router.push(`/product/${props.info.id}`);
};
</script>

<template>
  <div 
    class="flex flex-col relative w-[12.25em] h-[17.5em] md:w-[22.25em] md:h-[26.75em] bg-[#f2f3f5] items-center text-center rounded-lg mt-0 cursor-pointer transition-transform hover:scale-105 flex-shrink-0 max-w-full p-0 justify-normal"
    @click="goToDetail"
  >
    <img src="/assets/image/icon/new_icon.svg" class="absolute top-[0.6em] md:top-[1.125em] left-[0.6em] md:left-[1.125em] w-[2em] md:w-auto h-auto" />
    <img :src="info.img" class="mt-5 mb-5 max-md:mt-8 max-md:mb-2 max-md:max-h-[50%] object-contain" />

    <div class="w-full md:w-[10.25em] grid gap-1 md:gap-3 text-center items-center mt-2 md:mt-0">
      <p class="text-[0.85em] md:text-[1.5em] min-[1496px]:text-[1.8em] font-medium m-0 truncate min-h-[1.5em] w-full">{{ info.name }}</p>
      <p class="text-[0.75em] md:text-[1.25em] min-[1496px]:text-[1.5em] font-bold m-0 text-red-500">TWD {{ info.Price }}元</p>
      <p class="text-[0.6em] md:text-[1em] min-[1496px]:text-[1.2em] text-[#666] m-0">點我看詳情</p>
    </div>
  </div>
</template>
