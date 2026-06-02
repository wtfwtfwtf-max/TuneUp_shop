<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Button from 'primevue/button';
import Drawer from 'primevue/drawer';

const value = ref('');
const loading = ref(false);
const visible = ref(false);
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const isCompact = computed(() => windowWidth.value < 1496);

const load = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};

const navItems = [
  { label: '首頁', to: '/' },
  { label: '入耳式', to: '/in-ear' },
  { label: '耳塞式', to: '/earbuds' },
  { label: '耳罩式', to: '/over-ear' },
  { label: '其他耳機', to: '/others' },
];
</script>

<template>
  <div class="navbarContainer">
    <!-- Desktop Layout (Visible on lg and above) -->
    <div class="desktopLayout hidden lg:flex items-center w-full max-w-[93.5em] h-full mx-auto px-15 min-[1496px]:px-0 relative">
      <!-- Logo Left -->
      <div class="flex-shrink-0">
        <router-link to="/">
          <img src="/assets/image/logo.svg" alt="Logo" class="logoImg transition-all duration-300" :class="isCompact ? 'h-20 w-auto' : 'w-[13.5em] h-[7em]'" />
        </router-link>
      </div>

      <!-- Nav Items Center -->
      <div class="flex-grow flex justify-center">
        <ul class="navLinks flex items-center gap-[0.625em] list-none p-0 m-0">
          <template v-for="(item, index) in navItems" :key="item.label">
            <router-link :to="item.to" class="navLink">{{ item.label }}</router-link>
            <div v-if="index < navItems.length - 1" class="dividerWrapper flex items-center h-full">
              <Divider layout="vertical" />
            </div>
          </template>
        </ul>
      </div>

      <!-- Right Side Actions -->
      <div class="flex-shrink-0 flex items-center gap-4">
        <!-- Full Version Search/Login (> 1496px) -->
        <div v-if="!isCompact" class="flex items-center gap-4">
          <div class="searchSection">
            <IconField iconPosition="right" class="searchField">
              <InputText v-model="value" placeholder="#耳機關鍵字" class="searchInput" />
              <InputIcon class="searchIconWrapper">
                <img src="/assets/image/icon/search.svg" class="searchIconImg" />
              </InputIcon>
            </IconField>
          </div>
          <Button class="loginBtn" type="button" label="Log in / Sign up" :loading="loading" @click="load" />
        </div>

        <!-- Compact Version Hamburger (1024px - 1496px) -->
        <Button 
          v-else
          icon="pi pi-bars" 
          @click="visible = true" 
          class="!bg-black !border-black !w-12 !h-12 !p-0 flex items-center justify-center" 
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </template>
        </Button>
      </div>
    </div>

    <!-- Mobile Layout (Visible below lg) -->
    <div class="mobileLayout flex lg:hidden items-center justify-between w-full px-4 h-full">
      <router-link to="/">
        <img src="/assets/image/logo.svg" alt="Logo" class="h-20 w-auto" />
      </router-link>
      
      <Button 
        icon="pi pi-bars" 
        @click="visible = true" 
        class="!bg-black !border-black !w-12 !h-12 !p-0 flex items-center justify-center" 
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </template>
      </Button>
    </div>

    <!-- Mobile Drawer -->
    <Drawer v-model:visible="visible" :header="windowWidth < 1024 ? 'TuneUp Menu' : '帳戶與搜尋'" position="right" class="!w-64">
      <div class="flex flex-col gap-4 p-2">
        <!-- Only show navItems if width < 1024 -->
        <template v-if="windowWidth < 1024">
          <router-link 
            v-for="item in navItems" 
            :key="item.label" 
            :to="item.to" 
            class="text-xl no-underline text-black py-3 border-b border-gray-100"
            @click="visible = false"
          >
            {{ item.label }}
          </router-link>
        </template>
        
        <!-- Search & Login (Always in Drawer when opened via Hamburger in Compact mode) -->
        <div class="mt-4">
          <IconField iconPosition="right" class="w-full">
            <InputText
              v-model="value"
              placeholder="#耳機關鍵字"
              class="!w-full"
            />
          </IconField>
        </div>
        
        <Button
          class="!w-full !mt-6 !bg-black !border-black"
          label="Log in / Sign up"
          :loading="loading"
          @click="load"
        />
      </div>
    </Drawer>
  </div>
</template>

<style scoped>
@reference "../style.css";

/* Desktop Specific Styles - strictly preserved */
.navbarContainer {
  @apply flex items-center bg-white w-full max-w-[108em] h-[8rem] lg:h-[12.875em] mx-auto;
}

.logoImg {
  @apply w-[13.5em] h-[7em];
}
.navLinks {
  @apply flex items-center gap-[0.625em] text-[1rem] h-[2.625em] w-[36em] list-none p-0;
}

.navLink {
  @apply no-underline text-inherit text-[1.5em] leading-none flex items-center cursor-pointer;
}

.dividerWrapper {
  @apply flex items-center h-full;
}

:deep(.p-divider-vertical) {
  @apply !border-l !border-[#333] !h-[2.5em] self-center;
}

.searchSection {
  /* Margin removed for flex layout */
}

.searchField {
  @apply relative;
}

.searchInput {
  @apply !w-[22.5em] !h-[3.5em];
}

.searchIconWrapper {
  @apply flex items-center justify-center;
}

.searchField :deep(.p-inputicon) {
  @apply -translate-y-[33%];
}

.searchIconImg {
  @apply w-auto h-auto;
}

.loginBtn {
  @apply !w-[11.125em] !h-[3.5em] !bg-black !border-black hover:!bg-black hover:!border-black;
}
</style>
