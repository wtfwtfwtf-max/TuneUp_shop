<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  info: {
    id: string | number;
    name: string;
    oldPrice?: number;
    newPrice?: number;
    img: string;
    Price?: number;
  };
  type: 'default' | 'discount';
  variant?: 'regular' | 'compact';
}>();

const router = useRouter();

const goToDetail = () => {
  router.push(`/product/${props.info.id}`);
};
</script>

<template>
  <div
    class="flex flex-col cursor-pointer transition-transform hover:scale-105 flex-shrink-0 max-w-full"
    :class="type === 'default'
      ? variant === 'compact'
        ? 'w-full'
        : 'w-[12.25em] md:w-[17.9375em] min-[1496px]:w-[287px]'
      : 'w-[12.25em] md:w-[22.25em]'"
    @click="goToDetail"
  >
    <div
      v-if="type === 'default'"
      class="flex flex-col bg-[#f2f3f5] w-full items-center"
      :class="variant === 'compact'
        ? 'h-[17.5em] rounded-md p-[0.75em]'
        : 'h-[14.8em] md:h-[21.5em] rounded-lg p-0'"
    >
      <img
        :src="info.img"
        alt="product image"
        :class="variant === 'compact'
          ? 'h-[8.4em] w-full object-contain mt-[0.25em]'
          : 'mt-0 max-md:max-w-[80%] max-md:mt-4'"
      />
      <div
        class="grid text-center items-center"
        :class="variant === 'compact'
          ? 'w-full gap-[0.45em] mt-[0.85em] px-[0.35em]'
          : 'w-full md:w-[10.25em] gap-1 md:gap-3 mt-2 md:mt-[1.25em]'"
      >
        <p
          class="font-medium m-0 truncate min-h-[1.5em]"
          :class="variant === 'compact'
            ? 'text-[1.15em]'
            : 'text-[0.85em] md:text-[1.5em] min-[1496px]:text-[1.8em]'"
        >
          {{ info.name }}
        </p>
        <p
          class="font-semibold text-red-500 m-0"
          :class="variant === 'compact'
            ? 'text-[1em]'
            : 'text-[0.75em] md:text-[1.25em] min-[1496px]:text-[1.5em]'"
        >
          TWD {{ info.Price }}
        </p>
        <p
          class="text-[#666] m-0"
          :class="variant === 'compact'
            ? 'text-[0.85em]'
            : 'text-[0.6em] md:text-[1em] min-[1496px]:text-[1.2em]'"
        >
          點我看詳情
        </p>
      </div>
    </div>

    <div
      v-else-if="type === 'discount'"
      class="flex flex-col relative w-full h-[17.5em] md:h-[26.75em] bg-[#f2f3f5] items-center text-center rounded-lg mt-0 md:mt-[1.75em]"
    >
      <img
        src="/assets/image/icon/discount_icon.svg"
        alt="discount"
        class="absolute top-[0.6em] md:top-[1.125em] left-[0.6em] md:left-[1.125em] w-[2em] md:w-auto h-auto"
      />
      <img
        :src="info.img"
        alt="product image"
        class="mt-5 mb-5 max-md:mt-8 max-md:mb-2 max-md:max-h-[50%] object-contain"
      />
      <div class="w-full md:w-[10.25em] grid gap-1 md:gap-3 text-center items-center mt-0">
        <p class="text-[0.85em] md:text-[1.5em] min-[1496px]:text-[1.8em] font-medium m-0 truncate min-h-[1.5em]">
          {{ info.name }}
        </p>
        <p class="text-[0.65em] md:text-[1em] min-[1496px]:text-[1.2em] line-through text-gray-500 m-0">
          TWD {{ info.oldPrice }}
        </p>
        <p class="text-[0.75em] md:text-[1.25em] min-[1496px]:text-[1.5em] font-bold m-0 text-red-500">
          TWD {{ info.newPrice }}
        </p>
      </div>
    </div>
  </div>
</template>
