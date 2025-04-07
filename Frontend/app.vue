<script setup lang="ts">
const { user } = useAuth();

console.log("user >>> ", user.value);
</script>

<template>
  <a-config-provider>
    <div class="h-screen overflow-y-auto py-10">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </a-config-provider>
</template>
