<script setup lang="ts">
const { user } = useAuth();

definePageMeta({
  middleware: "auth",
});
</script>
<template>
  <div>
    <div v-if="!user">
      <p>no user fetched</p>
    </div>
    <div v-else>
      <p>id: {{ user?._id }}</p>
      <p>email: {{ user?.email }}</p>
      <p>username: {{ user?.username }}</p>
    </div>
  </div>
</template>
